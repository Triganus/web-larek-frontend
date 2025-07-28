# Web-ларёк

Интернет-магазин магических товаров для веб-разработчиков. Проект реализован на TypeScript по паттерну MVP с событийным обменом. Пользователь может просмотреть каталог, положить товары в корзину и оформить заказ в два шага.

## 1. Используемый стек

| Цель                    | Технология                           |
|-------------------------|--------------------------------------|
| Язык / типизация        | TypeScript 5                        |
| Сборка                  | Webpack 5, ts-loader, sass-loader   |
| Стили                   | SCSS + PostCSS (autoprefixer)       |
| UI                      | HTML 5, семантические теги, flex / grid|
| Линтинг                 | ESLint, Prettier                    |

Дополнительные пакеты перечислены в `package.json`.

## 2. Быстрый старт

Клонируйте репозиторий и установите зависимости:

```bash
npm install
```

или

```bash
yarn
```

Создайте файл окружения `.env` в корне проекта с содержимым:

```env
API_ORIGIN=https://larek-api.nomoreparties.co
```

Запустите режим разработки с hot-reload:

```bash
npm run start
```

Соберите production-версию:

```bash
npm run build
```

### Полезные скрипты

- `npm run lint` — проверка ESLint
- `npm run lint:fix` — авто-исправление
- `npm run format` — форматирование Prettier

## 3. Архитектура проекта

Проект разбит на три логических слоя: **Модели (Model)**, **Представления (View)** и **Презентер (Presenter)**. Связь между слоями осуществляется через общий EventEmitter — брокер событий, что обеспечивает слабое связывание и упрощает тестирование.

```
┌─────────┐   пользовательское действие   ┌──────────────┐   изменение данных   ┌────────────┐
│  View   │ ────────────────────────────▶ │  Presenter   │ ──────────────────▶ │   Model    │
└─────────┘ ◀──────────────────────────── └──────────────┘ ◀────────────────── └────────────┘
              render/update                        load / mutate
```

### 3.1 Базовые классы

| Класс         | Расположение                        | Назначение                                                                   |
|---------------|-------------------------------------|------------------------------------------------------------------------------|
| EventEmitter  | src/components/base/events.ts       | Управляет подпиской и рассылкой событий между слоями приложения.             |
| Model<T>      | src/components/base/Model.ts        | Абстрактная модель-обёртка поверх данных типа T. Предоставляет emitChanges.  |
| Component<P>  | src/components/base/component.ts    | Базовый класс представления: хранит ссылку на DOM, управляет элементами.     |
| Api           | src/components/base/api.ts          | Инкапсулирует HTTP-запросы (fetch). Методы для GET/POST запросов.            |

### 3.2 Модели данных

| Модель        | Интерфейс       | Назначение                                                         |
|---------------|-----------------|-------------------------------------------------------------------|
| CatalogModel  | ICatalogModel   | Управление списком товаров и выбранным товаром для предпросмотра  |
| BasketModel   | IBasketModel    | Управление содержимым корзины, подсчет суммы и количества         |
| OrderModel    | IOrderModel     | Хранение данных заказа, валидация форм, создание объекта заказа   |

#### 3.2.1 CatalogModel — каталог товаров

**Назначение**: единственный источник информации о загруженных товарах каталога.

**Наследование**: `extends Model<IProduct[]>`

**Конструктор**: `(events: IEvents)`
- `events` — экземпляр брокера событий для взаимодействия с другими слоями.

**Поля**
- `products: IProduct[]` — актуальный список товаров.

**Методы**
- `setProducts(products: ApiProduct[]): void` — сохраняет массив товаров из API и эмитит `catalog:changed`.
- `getProducts(): Promise<IProduct[]>` — возвращает копию массива товаров.
- `getProduct(id: string): IProduct | undefined` — ищет товар по ID.
- `getTotal(): number` — возвращает количество товаров в каталоге.

#### 3.2.2 BasketModel — корзина покупателя

**Назначение**: управляет набором выбранных товаров и предоставляет агрегированные данные (количество, сумма).

**Наследование**: `extends Model<IBasket>`

**Конструктор**: `(events: IEvents)`

**Поля**
- `items: Map<string, IBasketItem>` — коллекция позиций в корзине, ключ — ID товара.

**Методы**
- `add(product: IProduct): void` — кладёт товар в корзину и эмитит `basket:changed`.
- `remove(productId: string): void` — убирает товар и эмитит `basket:changed`.
- `clear(): void` — очищает корзину и эмитит `basket:changed`.
- `getItems(): IBasketItem[]` — массив позиций корзины.
- `getCount(): number` — количество товаров.
- `getTotal(): number` — суммарная стоимость.
- `contains(productId: string): boolean` — проверка наличия товара.

#### 3.2.3 OrderModel — оформление заказа

**Назначение**: хранит данные, введённые в формах оплаты и контактов, выполняет валидацию и формирует финальный объект заказа.

**Наследование**: `extends Model<IOrder>`

**Конструктор**: `(events: IEvents)`

**Поля**
- `order: IOrder` — промежуточные данные заказа.

**Методы**
- `setPayment(payment: PaymentMethod): void` — устанавливает способ оплаты и эмитит `order:changed`.
- `setEmail(email: string): void` — устанавливает email и эмитит `order:changed`.
- `setPhone(phone: string): void` — устанавливает телефон и эмитит `order:changed`.
- `setAddress(address: string): void` — устанавливает адрес и эмитит `order:changed`.
- `setItems(items: IBasketItem[]): void` — устанавливает товары заказа.
- `validateOrder(): boolean` — валидирует данные первого шага (оплата + адрес).
- `validateContacts(): boolean` — валидирует данные второго шага (email + телефон).
- `getErrors(): string[]` — возвращает список ошибок валидации.
- `clear(): void` — сбрасывает данные заказа.
- `getOrderData(): IOrder` — возвращает объект заказа для отправки.

### 3.3 Представления (View-компоненты)

| Компонент     | Файл                                      | Функция                                               |
|---------------|-------------------------------------------|-------------------------------------------------------|
| Card          | src/components/base/views/Card.ts         | Карточка товара. Отображает информацию, кнопки действий |
| Basket        | src/components/base/views/Basket.ts       | Список товаров в корзине + сумма + кнопка «Оформить»  |
| Modal         | src/components/base/views/Modal.ts        | Универсальное модальное окно с анимацией и оверлеем   |
| Form          | src/components/base/views/Form.ts         | Общая логика форм: сбор данных, валидация, блокировка |
| OrderForm     | src/components/base/views/OrderForm.ts    | Шаг 1: выбор оплаты + ввод адреса                     |
| ContactsForm  | src/components/base/views/ContactsForm.ts | Шаг 2: почта + телефон                               |
| Success       | src/components/base/views/Success.ts      | Модалка успешной покупки                              |
| Page          | src/components/base/views/Page.ts         | Шапка + основной контейнер. Отображает счётчик корзины |

#### 3.3.1 Card — карточка товара

**Наследование**: `extends Component<IProductView>`

**Конструктор**: `(blockName: string, container: HTMLElement, actions?: ICardActions)`

**Сохраняемые элементы**
- `_title` – заголовок товара
- `_image` – картинка товара
- `_price` – цена товара
- `_category` – категория товара
- `_description` – описание товара
- `_button` – кнопка действия
- `_index` – порядковый номер (для корзины)

**Методы**: свойства устанавливаются через сеттеры `title`, `image`, `price`, `category`, `description`, `button`, `index`.

#### 3.3.2 Basket — список корзины

**Наследование**: `extends Component<IBasketView>`

**Конструктор**: `(container: HTMLElement, events: IEvents)`

**Сохраняемые элементы**
- `_list` – контейнер для позиций корзины
- `_total` – сумма заказа
- `_button` – кнопка «Оформить»

**Методы/сеттеры**: `items`, `total`, `selected`.

#### 3.3.3 Modal — всплывающее окно

**Наследование**: `extends Component<IModalData>`

**Конструктор**: `(container: HTMLElement, events: IEvents)`

**Сохраняемые элементы**
- `_closeButton` – крестик закрытия
- `_content` – область контента

**Методы**: `content`, `open()`, `close()`, `render()`.

#### 3.3.4 Form — базовый класс форм

**Наследование**: `extends Component<IFormState>`

**Конструктор**: `(container: HTMLFormElement, events: IEvents)`

**Сохраняемые элементы**
- `_submit` – кнопка отправки формы
- `_errors` – блок ошибок валидации

**Методы**: `onInputChange()`, `valid`, `errors`, `render()`.

#### 3.3.5 OrderForm — выбор оплаты и адреса

**Наследование**: `extends Form<IOrderForm>`

**Конструктор**: `(container: HTMLFormElement, events: IEvents)`

**Сохраняемые элементы**
- `_payment` – массив кнопок способов оплаты
- `_address` – поле адреса

**Методы**: `payment`, `address`, `setPaymentMethod()`.

#### 3.3.6 ContactsForm — контактные данные

**Наследование**: `extends Form<IContactsForm>`

**Конструктор**: `(container: HTMLFormElement, events: IEvents)`

**Сохраняемые элементы**
- `_email` – поле email
- `_phone` – поле телефона

**Методы**: `email`, `phone`.

#### 3.3.7 Success — окно успешной оплаты

**Наследование**: `extends Component<ISuccess>`

**Конструктор**: `(container: HTMLElement, actions: ISuccessActions)`

**Сохраняемые элементы**
- `_close` – кнопка закрытия
- `_total` – сумма заказа

**Методы**: `total`.

#### 3.3.8 Page — обёртка страницы

**Наследование**: `extends Component<IPage>`

**Конструктор**: `(container: HTMLElement, events: IEvents)`

**Сохраняемые элементы**
- `_counter` – счётчик товаров в корзине
- `_catalog` – грид каталога
- `_wrapper` – обёртка контента
- `_basket` – кнопка корзины

**Методы/сеттеры**: `counter`, `catalog`, `locked`.

### 3.4 Взаимодействие компонентов

1. Пользователь кликает по Card → Card эмитит событие `card:select`.
2. Presenter в `src/index.ts` ловит событие, создаёт превью товара, вставляет его в Modal и открывает окно.
3. Кнопка «В корзину» → эмитит событие, вызывается `basketModel.add(item)`, который обновляет состояние и эмитит `basket:changed`.
4. Page подписан на `basket:changed` и обновляет счётчик, Basket — перерисовывает список.
5. OrderForm и ContactsForm передают введённые значения через события `order:change` и `contacts:change`.
6. OrderModel валидирует данные и обновляет состояние форм.
7. При отправке OrderModel собирает финальный объект и через Presenter вызывается `WebLarekAPI.orderProducts()`.

## 4. Данные и типы

Все типы объявлены в `src/types/` и разделены по файлам:

| Интерфейс     | Файл                  | Назначение                                    |
|---------------|-----------------------|-----------------------------------------------|
| IProduct      | src/types/product.ts  | Объект товара из API                          |
| IBasketItem   | src/types/basket.ts   | Товар в корзине                               |
| IOrder        | src/types/order.ts    | Финальный объект заказа для API               |
| IOrderForm    | src/types/order.ts    | Данные формы первого шага                     |
| IContactsForm | src/types/order.ts    | Данные формы второго шага                     |
| ApiProduct    | src/types/api.ts      | Товар из API ответа                           |
| PaymentMethod | src/types/api.ts      | Способ оплаты: 'online' \| 'cash'             |

### Ключевые интерфейсы

```typescript
// Товар из API
interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: ProductCategory;
}

// Данные заказа
interface IOrder {
  payment?: PaymentMethod;
  email?: string;
  phone?: string;
  address?: string;
  items: IBasketItem[];
  total: number;
}

// Элемент корзины
interface IBasketItem {
  product: IProduct;
  quantity: number;
}
```

Включена опция `strict: true` для строгой типизации.

## 5. Процессы в приложении

1. **Загрузка каталога** – при инициализации Presenter (`src/index.ts`) вызывает `WebLarekAPI.getProductList()`, передаёт данные в `CatalogModel.setProducts()`, которая эмитит `catalog:changed`.

2. **Добавление в корзину** – `BasketModel` изменяет состояние, `Basket` и `Page` перерисовываются по событию `basket:changed`.

3. **Оформление заказа** – две формы наследуют `Form`, обмен данными идёт через события с автоматической валидацией в `OrderModel`.

4. **Оплата** – `OrderModel` генерирует `IOrder`, API возвращает результат, открывается `Success`.

Каждый шаг реализован через события; прямых ссылок Model ↔ View нет.

## 6. Структура репозитория

```
src/
├── components/base/           # базовые абстракции
│   ├── api/                  # API клиент
│   │   └── WeblarekAPI.ts    # WebLarek API
│   ├── models/               # модели данных
│   │   ├── Catalog.ts        # модель каталога
│   │   ├── Basket.ts         # модель корзины
│   │   └── Order.ts          # модель заказа
│   ├── views/                # UI-компоненты
│   │   ├── Card.ts           # карточка товара
│   │   ├── Basket.ts         # корзина
│   │   ├── Modal.ts          # модальное окно
│   │   ├── Form.ts           # базовая форма
│   │   ├── OrderForm.ts      # форма заказа
│   │   ├── ContactsForm.ts   # форма контактов
│   │   ├── Success.ts        # страница успеха
│   │   └── Page.ts           # главная страница
│   ├── api.ts                # базовый API класс
│   ├── component.ts          # базовый компонент
│   ├── events.ts             # система событий
│   └── Model.ts              # базовая модель
├── types/                     # декларации TS-типов
│   ├── api.ts                # типы API
│   ├── product.ts            # типы товаров
│   ├── basket.ts             # типы корзины
│   ├── order.ts              # типы заказов
│   ├── events.ts             # типы событий
│   ├── views.ts              # типы представлений
│   └── index.ts              # общий экспорт
├── utils/                     # утилиты и константы
│   ├── constants.ts          # константы приложения
│   └── utils.ts              # вспомогательные функции
├── scss/                      # стили + переменные
└── index.ts                   # точка входа / Presenter
```

---

Проект выполнен в рамках курса «Веб-разработчик» (Яндекс Практикум).



