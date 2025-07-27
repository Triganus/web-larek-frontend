# Веб-ларёк

Интернет-магазин веб-разработчика с товарами для программистов. Проект реализован на TypeScript по архитектурному паттерну MVP с событийным взаимодействием. Пользователь может просматривать каталог товаров, добавлять их в корзину и оформлять заказ в два этапа.

## 1. Используемый стек

| Цель                    | Технология                           |
|-------------------------|--------------------------------------|
| Язык / типизация        | TypeScript 5                        |
| Сборка                  | Webpack 5, ts-loader, sass-loader   |
| Стили                   | SCSS + PostCSS (autoprefixer)       |
| UI                      | HTML 5, семантические теги, CSS Grid|
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
| EventEmitter  | src/components/base/events.ts       | Регистрирует/снимает слушателей, рассылает события, передавая данные.        |
| Model<T>      | src/components/base/Model.ts        | Абстрактная модель-обёртка поверх данных типа T. Предоставляет emitChanges.  |
| Component<P>  | src/components/base/component.ts    | Базовый класс представления: хранит ссылку на DOM, управляет элементами.     |
| Api           | src/components/base/api.ts          | Инкапсулирует HTTP-запросы (fetch). Методы для GET/POST запросов.            |
| WebLarekAPI   | src/components/api/weblarekAPI.ts   | Специализированный API клиент: getProductList, getProduct, orderProducts.    |

### 3.2 Модели данных

| Класс        | Описание                                                                           |
|--------------|------------------------------------------------------------------------------------|
| CatalogModel | Держит массив товаров, полученных из API. Предоставляет getProduct(id) для поиска.|
| BasketModel  | Хранит Map товаров в корзине, считает итоговую сумму и количество.                |
| OrderModel   | Содержит данные заказа (доставка, контакты), валидирует формы, создает IOrder.    |

#### 3.2.1 CatalogModel — каталог товаров

**Назначение:** единственный источник информации о товарах каталога и выбранном товаре для предпросмотра.

**Наследование:** реализует ICatalogModel

**Конструктор:** `(events: IEvents)`
- `events` — экземпляр брокера событий для взаимодействия с другими слоями.

**Поля:**
- `_products: IProduct[]` — актуальный список товаров

**Методы:**
- `setProducts(products: ApiProduct[]): void` — сохраняет массив товаров и эмитит `catalog:changed`
- `getProducts(): Promise<IProduct[]>` — возвращает массив товаров
- `getProduct(id: string): IProduct | undefined` — ищет товар по id

#### 3.2.2 BasketModel — корзина покупателя

**Назначение:** управляет набором выбранных товаров и предоставляет агрегированные данные.

**Наследование:** extends Model<IBasketState>

**Конструктор:** `(events: IEvents)`

**Поля:**
- `_items: Map<string, IBasketItem>` — коллекция позиций в корзине, ключ — id товара

**Методы:**
- `add(product: IProduct): void` — добавляет товар в корзину и эмитит `basket:changed`
- `remove(id: string): void` — убирает товар и эмитит `basket:changed`
- `clear(): void` — очищает корзину
- `getItems(): IBasketItem[]` — массив позиций корзины
- `getCount(): number` — количество товаров
- `getTotal(): number` — суммарная стоимость
- `contains(id: string): boolean` — проверка наличия товара

#### 3.2.3 OrderModel — оформление заказа

**Назначение:** хранит данные форм оплаты и контактов, выполняет валидацию, формирует финальный объект IOrder.

**Наследование:** extends Model<IOrderState>

**Конструктор:** `(events: IEvents)`

**Поля:**
- `_form: IOrderForm & IContactsForm` — промежуточные данные пользователя
- `validationErrors: FormErrors` — объект текущих ошибок валидации

**Геттеры:**
- `order: IOrder` — актуальный объект заказа

**Методы:**
- `updateField(field: string, value: string): void` — обновляет поле заказа и проводит валидацию
- `resetOrder(): void` — сбрасывает данные заказа
- `getOrderData(): IOrder` — возвращает финальный объект для API

### 3.3 Представления (View-компоненты)

| Компонент     | Файл                                 | Функция                                                          |
|---------------|--------------------------------------|------------------------------------------------------------------|
| Card          | src/components/views/Card.ts         | Карточка товара. Отображает инфо, кнопку «Купить» / «Убрать».    |
| Basket        | src/components/views/Basket.ts       | Список товаров в корзине + сумма + кнопка «Оформить».           |
| Modal         | src/components/views/Modal.ts        | Универсальное модальное окно с анимацией и оверлеем.            |
| Form          | src/components/views/Form.ts         | Общая логика форм: сбор данных, валидация, блокировка кнопок.    |
| OrderForm     | src/components/views/OrderForm.ts    | Шаг 1: выбор оплаты + ввод адреса.                              |
| ContactsForm  | src/components/views/ContactsForm.ts | Шаг 2: почта + телефон.                                         |
| Success       | src/components/views/Success.ts      | Модалка успешной покупки.                                        |
| Page          | src/components/views/Page.ts         | Шапка + основной контейнер. Отображает счётчик корзины.         |

#### 3.3.1 Card — карточка товара

**Наследование:** extends Component<ICard>

**Конструктор:** `(container: HTMLElement, actions?: ICardActions)`

**Сохраняемые элементы:**
- `_title` — заголовок товара (h2)
- `_image` — картинка (img)
- `_price` — цена (span)
- `_category` — категория (span)
- `_description` — описание (p)
- `_button` — «В корзину» / «Убрать из корзины» (button)

**Методы:** свойства устанавливаются через метод `render(data)`, который принимает объект с полями id, title, image, price, category, description, button.

#### 3.3.2 Basket — список корзины

**Наследование:** extends Component<IBasketView>

**Конструктор:** `(container: HTMLElement, events: IEvents)`

**Сохраняемые элементы:**
- `_list` — контейнер для позиций корзины (ul)
- `_total` — сумма заказа (span)
- `_button` — кнопка «Оформить» (button)

**Методы/сетторы:** items, total, disabled.

#### 3.3.3 Modal — всплывающее окно

**Наследование:** extends Component<IModalData>

**Конструктор:** `(container: HTMLElement, events: IEvents)`

**Сохраняемые элементы:**
- `_closeButton` — крестик закрытия (button)
- `_content` — область контента (div)

**Методы:** content, open, close, render.

#### 3.3.4 Form (базовый класс)

**Наследование:** extends Component<IForm>

**Конструктор:** `(container: HTMLFormElement, events: IEvents)`

**Сохраняемые элементы:**
- `_submit` — кнопка отправки формы (button)
- `_errors` — блок ошибок валидации (div)

**Методы:** onInputChange, valid, errors, render.

#### 3.3.5 OrderForm — выбор оплаты и адреса

**Наследование:** extends Form<IOrderForm>

**Конструктор:** `(container: HTMLFormElement, events: IEvents)`

**Сохраняемые элементы:**
- `_payment` — кнопки способов оплаты (button[])
- `_address` — поле адреса (input)

**Методы:** address, payment, render.

#### 3.3.6 ContactsForm — контактные данные

**Наследование:** extends Form<IContactsForm>

**Конструктор:** `(container: HTMLFormElement, events: IEvents)`

**Сохраняемые элементы:**
- `_email` — поле email (input)
- `_phone` — поле телефона (input)

**Методы:** email, phone.

#### 3.3.7 Success — окно успешной оплаты

**Наследование:** extends Component<ISuccess>

**Конструктор:** `(container: HTMLElement, events: IEvents)`

**Сохраняемые элементы:**
- `_close` — кнопка закрытия (button)
- `_total` — сумма заказа (span)

**Методы:** total.

#### 3.3.8 Page — обёртка страницы

**Наследование:** extends Component<IPage>

**Конструктор:** `(container: HTMLElement, events: IEvents)`

**Сохраняемые элементы:**
- `_counter` — счётчик товаров в корзине (span)
- `_catalog` — грид каталога (div)
- `_wrapper` — обёртка контента (div)
- `_basket` — иконка/кнопка корзины (button)

**Методы/сетторы:** counter, catalog, locked.

### 3.4 Взаимодействие компонентов

1. Пользователь кликает по Card → Card через коллбэк вызывает `catalogModel.setPreview(item)`
2. CatalogModel эмитит `preview:changed`, Presenter ловит событие, создаёт превью товара
3. «В корзину» → через коллбэк вызывается `basketModel.add(item)`, который эмитит `basket:changed`
4. Page подписан на `basket:changed` и обновляет счётчик
5. OrderForm и ContactsForm передают данные в `OrderModel.setField()`
6. OrderModel валидирует данные и эмитит `formErrors:change`
7. OrderModel собирает финальный объект и отдаёт Presenter → `WebLarekAPI.orderProducts()`

## 4. Данные и типы

Все типы объявлены в `src/types/`.

| Интерфейс         | Назначение                                    |
|-------------------|-----------------------------------------------|
| IProduct          | Объект товара из API                          |
| IProductView      | Данные, требуемые компоненту Card             |
| IBasketItem       | Товар в корзине                               |
| IOrderForm        | Данные формы заказа (оплата, адрес)           |
| IContactsForm     | Данные формы контактов (email, телефон)       |
| IOrder            | Финальный объект, отправляемый POST /order    |
| AppEvent          | Перечисление всех событий приложения          |

### Ключевые интерфейсы

```typescript
// Товар
interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: ProductCategory;
}

// Заказ
interface IOrder {
  payment?: PaymentMethod;
  email?: string;
  phone?: string;
  address?: string;
  items: IBasketItem[];
  total: number;
}

// События
enum AppEvent {
  ProductSelected = 'product:selected',
  BasketChanged = 'basket:changed',
  OrderSubmitted = 'order:submitted',
  ModalOpened = 'modal:opened'
}
```

Включена опция `noImplicitAny` для строгой типизации.

## 5. Процессы в приложении

1. **Загрузка каталога** — при инициализации Presenter вызывает `WebLarekAPI.getProductList()`, передаёт данные в `CatalogModel.setProducts()`, которая эмитит `catalog:changed`

2. **Добавление в корзину** — BasketModel изменяет Map, Basket и Page перерисовываются по событию `basket:changed`

3. **Оформление** — две формы наследуют Form, обмен данными через `OrderModel.updateField()` с автоматической валидацией

4. **Оплата** — OrderModel генерирует IOrder, API возвращает id + total, открывается Success

Каждый шаг реализован через события; прямых ссылок Model ↔ View нет.

## 6. Структура репозитория

```
src/
├── components/               # базовые абстракции и api-клиент
│   ├── base/                # Component, Model, events, api
│   ├── api/                 # WebLarekAPI
│   ├── models/              # бизнес-логика (Catalog, Basket, Order)
│   └── views/               # UI-компоненты (только отрисовка)
├── types/                   # декларации TS-типов
├── utils/                   # утилиты и константы
├── scss/                    # стили + переменные + миксины
└── index.ts                 # точка входа / Presenter
```

## Заключение

Проект реализует интернет-магазин с использованием современной архитектуры MVP и событийно-ориентированного подхода. Код структурирован, типизирован и легко расширяем благодаря четкому разделению ответственности между компонентами.



