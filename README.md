# Веб-ларёк

## Краткое описание

Веб-приложение для онлайн-покупок. Реализовано на TypeScript с использованием архитектурного паттерна **MVP (Model-View-Presenter)**. Все бизнес-сущности и взаимодействия строго типизированы.

---

## Установка и запуск

```bash
npm install
npm run start
# или
yarn
yarn start
```

Сборка:
```bash
npm run build
# или
yarn build
```

---

## Архитектура

### Используемый паттерн

В проекте реализована **событийная архитектура** с элементами паттерна **Model-View**:
- **Model** — бизнес-логика и данные (товары, корзина, заказ).
- **View** — отображение и взаимодействие с DOM.
- **EventEmitter** — центральная событийная система для связи компонентов.

Вместо презентеров используется брокер событий, что обеспечивает слабую связанность компонентов и высокую расширяемость системы.

---

## Структура проекта

```
src/
├── components/
│   ├── base/         // Базовые абстракции: EventEmitter, Api, Component, Model
│   ├── api/          // API клиенты: WebLarekAPI
│   ├── models/       // Классы моделей: CatalogModel, BasketModel, OrderModel
│   └── views/        // Классы View-компонентов: Page, Modal, Card, Form и др.
├── types/            // TS-типизации разделенные по доменам
├── utils/            // Вспомогательные функции и константы
├── scss/             // Стили
└── index.ts          // Точка входа приложения
```

---

## Базовые классы

### EventEmitter
**Назначение**: Центральная событийная система приложения  
**Конструктор**: `constructor()`  
**Поля**:
- `_events: Map<EventName, Set<Subscriber>>` - карта событий и подписчиков

**Методы**:
- `on<T>(event: EventName, callback: (data: T) => void): void` - подписка на событие
- `off(eventName: EventName, callback: Subscriber): void` - отписка от события  
- `emit<T>(eventName: string, data?: T): void` - эмиссия события
- `trigger<T>(eventName: string, context?: Partial<T>): (data: T) => void` - создание триггер-функции
- `onAll(callback: (event: EmitterEvent) => void): void` - подписка на все события
- `offAll(): void` - сброс всех подписчиков

### Api
**Назначение**: Базовый класс для работы с REST API  
**Конструктор**: `constructor(baseUrl: string, options: RequestInit = {})`  
**Поля**:
- `readonly baseUrl: string` - базовый URL API
- `protected options: RequestInit` - опции запросов

**Методы**:
- `get(uri: string): Promise<object>` - GET запрос
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - POST/PUT/DELETE запрос
- `protected handleResponse(response: Response): Promise<object>` - обработка ответа

### Component<T>
**Назначение**: Базовый класс для всех UI компонентов  
**Конструктор**: `constructor(container: HTMLElement)`  
**Поля**:
- `readonly container: HTMLElement` - корневой DOM элемент

**Методы**:
- `render(data?: Partial<T>): HTMLElement` - рендеринг компонента
- `protected setText(element: HTMLElement, value: unknown): void` - установка текста
- `protected setElementDisabled(element: HTMLElement, state: boolean): void` - блокировка элемента
- `protected setHidden(element: HTMLElement): void` - скрытие элемента
- `protected setVisible(element: HTMLElement): void` - показ элемента
- `protected setImage(element: HTMLImageElement, src: string, alt?: string): void` - установка изображения
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - переключение CSS класса

### Model<T>
**Назначение**: Базовый класс для моделей данных  
**Конструктор**: `constructor(data: Partial<T>, events: IEvents)`  
**Поля**:
- `protected events: IEvents` - событийная система

**Методы**:
- `emitChanges(event: string, payload?: object): void` - эмиссия изменений

---

## API классы

### WebLarekAPI
**Назначение**: Специализированный API клиент для работы с сервером WebLarek  
**Конструктор**: `constructor(cdn: string, baseUrl: string, options?: RequestInit)`  
**Поля**:
- `readonly cdn: string` - URL CDN для ресурсов
- Наследует поля от Api

**Методы**:
- `getProductList(): Promise<ApiProduct[]>` - получение списка товаров
- `getProduct(id: string): Promise<ApiProduct>` - получение товара по ID
- `orderProducts(order: ApiOrderRequest): Promise<ApiOrderResponse>` - оформление заказа

---

## Модели данных

### CatalogModel
**Назначение**: Управление каталогом товаров  
**Конструктор**: `constructor(events: IEvents)`  
**Поля**:
- `protected _products: IProduct[]` - массив товаров
- `protected events: IEvents` - событийная система

**Методы**:
- `getProducts(): Promise<IProduct[]>` - получение всех товаров
- `getProduct(id: string): IProduct | undefined` - получение товара по ID
- `setProducts(products: ApiProduct[]): void` - установка списка товаров
- `get products(): IProduct[]` - геттер для товаров

**События**:
- Эмитит `catalog:changed` при изменении каталога

### BasketModel
**Назначение**: Управление корзиной покупок  
**Конструктор**: `constructor(events: IEvents)`  
**Поля**:
- `protected _items: Map<string, IBasketItem>` - карта товаров в корзине
- `protected events: IEvents` - событийная система

**Методы**:
- `add(product: IProduct): void` - добавление товара
- `remove(productId: string): void` - удаление товара
- `clear(): void` - очистка корзины
- `getTotal(): number` - получение общей суммы
- `getCount(): number` - получение количества товаров
- `getItems(): IBasketItem[]` - получение всех элементов
- `contains(productId: string): boolean` - проверка наличия товара
- `get items(): Map<string, IBasketItem>` - геттер для карты товаров

**События**:
- Эмитит `basket:changed` при изменении корзины

### OrderModel
**Назначение**: Управление данными заказа  
**Конструктор**: `constructor(events: IEvents)`  
**Поля**:
- `protected _order: IOrder` - данные заказа
- `protected events: IEvents` - событийная система

**Методы**:
- `setPayment(payment: PaymentMethod): void` - установка способа оплаты
- `setEmail(email: string): void` - установка email
- `setPhone(phone: string): void` - установка телефона
- `setAddress(address: string): void` - установка адреса
- `setItems(items: IBasketItem[]): void` - установка товаров
- `validateOrder(): boolean` - валидация данных заказа
- `validateContacts(): boolean` - валидация контактных данных
- `clear(): void` - очистка заказа
- `getOrderData(): IOrder` - получение данных заказа
- `get order(): IOrder` - геттер для заказа

**События**:
- Эмитит `order:changed` при изменении заказа
- Эмитит `form:errors` при ошибках валидации

---

## View компоненты

### Page
**Назначение**: Главная страница приложения  
**Конструктор**: `constructor(container: HTMLElement, events: IEvents)`  
**Поля**:
- `protected _counter: HTMLElement` - счетчик корзины
- `protected _catalog: HTMLElement` - каталог товаров
- `protected _wrapper: HTMLElement` - обертка страницы
- `protected _basket: HTMLButtonElement` - кнопка корзины
- `protected events: IEvents` - событийная система

**Методы**:
- `set counter(value: number)` - установка счетчика
- `set catalog(items: HTMLElement[])` - установка каталога
- `set locked(value: boolean)` - блокировка прокрутки
- `render(): HTMLElement` - рендеринг страницы

**События**:
- Эмитит `basket:open` при клике на корзину

### Modal
**Назначение**: Модальное окно  
**Конструктор**: `constructor(container: HTMLElement, events: IEvents)`  
**Поля**:
- `protected _content: HTMLElement` - контент модального окна
- `protected _closeButton: HTMLButtonElement` - кнопка закрытия
- `protected events: IEvents` - событийная система

**Методы**:
- `open(content: HTMLElement): void` - открытие модального окна
- `close(): void` - закрытие модального окна
- `render(data: { content: HTMLElement }): HTMLElement` - рендеринг
- `set content(value: HTMLElement | null)` - установка контента
- `get content(): HTMLElement | null` - получение контента

**События**:
- Эмитит `modal:open` при открытии
- Эмитит `modal:close` при закрытии

### Card
**Назначение**: Карточка товара  
**Конструктор**: `constructor(container: HTMLElement, events: IEvents, type: CardType = 'gallery')`  
**Поля**:
- `protected _title: HTMLElement` - название товара
- `protected _image?: HTMLImageElement` - изображение
- `protected _description?: HTMLElement` - описание
- `protected _price: HTMLElement` - цена
- `protected _category?: HTMLElement` - категория
- `protected _button?: HTMLButtonElement` - кнопка действия
- `protected _index?: HTMLElement` - индекс в корзине
- `protected events: IEvents` - событийная система
- `protected type: CardType` - тип карточки

**Методы**:
- `render(product: IProductView): HTMLElement` - рендеринг карточки
- `setDisabled(disabled: boolean): void` - блокировка кнопки
- Геттеры и сеттеры для всех свойств: `id`, `title`, `image`, `price`, `category`, `description`, `index`

**События**:
- Эмитит `card:select` при выборе карточки

### Form<T>
**Назначение**: Базовый класс для форм  
**Конструктор**: `constructor(container: HTMLFormElement, events: IEvents)`  
**Поля**:
- `protected _submit: HTMLButtonElement` - кнопка отправки
- `protected _errors: HTMLElement` - область ошибок
- `protected events: IEvents` - событийная система

**Методы**:
- `render(state: Partial<T> & IFormView): HTMLElement` - рендеринг формы
- `validate(): boolean` - валидация формы
- `clear(): void` - очистка формы
- `protected onInputChange(field: keyof T, value: string): void` - обработка изменений
- `set valid(value: boolean)` - установка валидности
- `set errors(value: string[])` - установка ошибок

**События**:
- Эмитит `{form-name}:change` при изменении полей
- Эмитит `{form-name}:submit` при отправке

### OrderForm
**Назначение**: Форма заказа (способ оплаты и адрес)  
**Конструктор**: `constructor(container: HTMLFormElement, events: IEvents)`  
**Поля**:
- `protected _payment: HTMLButtonElement[]` - кнопки способов оплаты
- `protected _address: HTMLInputElement` - поле адреса
- Наследует поля от Form

**Методы**:
- `set payment(value: PaymentMethod | null)` - установка способа оплаты
- `set address(value: string)` - установка адреса
- `get address(): string` - получение адреса
- Наследует методы от Form

### ContactsForm
**Назначение**: Форма контактов  
**Конструктор**: `constructor(container: HTMLFormElement, events: IEvents)`  
**Поля**:
- `protected _email: HTMLInputElement` - поле email
- `protected _phone: HTMLInputElement` - поле телефона
- Наследует поля от Form

**Методы**:
- `set email(value: string)` - установка email
- `get email(): string` - получение email
- `set phone(value: string)` - установка телефона
- `get phone(): string` - получение телефона
- Наследует методы от Form

### Basket
**Назначение**: Отображение корзины  
**Конструктор**: `constructor(container: HTMLElement, events: IEvents)`  
**Поля**:
- `protected _list: HTMLElement` - список товаров
- `protected _total: HTMLElement` - общая сумма
- `protected _button: HTMLButtonElement` - кнопка оформления
- `protected events: IEvents` - событийная система

**Методы**:
- `render(basket: IBasket): HTMLElement` - рендеринг корзины
- `updateCounter(count: number): void` - обновление счетчика
- `set items(items: HTMLElement[])` - установка списка товаров
- `set total(value: number)` - установка общей суммы

**События**:
- Эмитит `order:open` при клике на оформление

### Success
**Назначение**: Страница успешного заказа  
**Конструктор**: `constructor(container: HTMLElement, events: IEvents)`  
**Поля**:
- `protected _total: HTMLElement` - сумма заказа
- `protected _close: HTMLButtonElement` - кнопка закрытия
- `protected events: IEvents` - событийная система

**Методы**:
- `render(result: IOrderResult): HTMLElement` - рендеринг страницы
- `set total(value: number)` - установка суммы

**События**:
- Эмитит `order:success` при закрытии

---

## Типы данных

Типы и интерфейсы разделены по файлам в директории `src/types/`:

- `api.ts` — типы для API запросов и ответов
- `events.ts` — типы событийной системы и перечисления событий
- `product.ts` — типы для товаров и каталога
- `basket.ts` — типы для корзины покупок
- `order.ts` — типы для заказов и форм
- `views.ts` — типы для представлений и компонентов
- `index.ts` — общий экспорт всех типов

Используются строгие типы, дженерики, объединения. Не используется `any`, типы не дублируются.

### Ключевые интерфейсы

```typescript
// API типы
interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: ProductCategory;
}

interface ApiOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Модели данных
interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: ProductCategory;
}

interface IBasketItem {
  product: IProduct;
  quantity: number;
}

interface IOrder {
  payment?: PaymentMethod;
  email?: string;
  phone?: string;
  address?: string;
  items: IBasketItem[];
  total: number;
}

// Представления
interface IProductView {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  button?: {
    text: string;
    disabled: boolean;
  };
}

// Типы-ограничения
type ProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
type PaymentMethod = 'online' | 'cash';
type CardType = 'gallery' | 'preview' | 'basket';
```

---

## Событийная система

В основе архитектуры лежит **EventEmitter** — брокер событий для связи компонентов:

### Основные события приложения

```typescript
enum AppEvent {
  // События товаров
  ProductSelected = 'product:selected',
  ProductAddedToBasket = 'product:added-to-basket',
  
  // События корзины
  BasketChanged = 'basket:changed',
  BasketOpened = 'basket:opened',
  
  // События заказа
  OrderSubmitted = 'order:submitted',
  OrderCompleted = 'order:completed',
  
  // События модального окна
  ModalOpened = 'modal:opened',
  ModalClosed = 'modal:closed'
}
```

### Использование событий

```typescript
// Подписка на событие
events.on(AppEvent.ProductAddedToBasket, (data: ProductBasketPayload) => {
  // Обработка добавления товара в корзину
});

// Эмиссия события
events.emit(AppEvent.BasketChanged, {
  items: basketItems,
  total: totalAmount,
  count: itemsCount
});
```

---

## Взаимодействие компонентов

### Поток данных

1. **Инициализация**:
   - Создается EventEmitter
   - Инициализируются все модели с передачей events
   - Создаются все view компоненты с передачей events
   - Настраиваются обработчики событий

2. **Загрузка данных**:
   - WebLarekAPI загружает товары с сервера
   - CatalogModel получает данные и эмитит `catalog:changed`
   - Page слушает событие и обновляет отображение каталога

3. **Взаимодействие пользователя**:
   - Пользователь кликает на карточку → Card эмитит `card:select`
   - Page слушает событие и открывает модальное окно с превью
   - Пользователь добавляет товар → BasketModel эмитит `basket:changed`
   - Page обновляет счетчик в шапке

4. **Оформление заказа**:
   - Пользователь открывает корзину → Basket эмитит `order:open`
   - Открывается форма заказа → OrderForm собирает данные
   - При отправке OrderModel валидирует и отправляет через API
   - При успехе показывается Success компонент

---

## Принципы архитектуры

### Single Responsibility Principle
Каждый класс отвечает только за свою часть логики:
- **Model** — только бизнес-логика и данные
- **View** — только отображение и взаимодействие с пользователем
- **API** — только работа с сервером

### Слабая связанность
- Компоненты не знают друг о друге напрямую
- Взаимодействие только через события
- Легкое тестирование и расширение

### Наследование и композиция
- Базовые классы Component, Model, Api выделяют общую функциональность
- Специализированные классы расширяют базовую функциональность
- Максимальное переиспользование кода

### Типизация
- Строгая типизация всех данных и интерфейсов
- Отсутствие any типов
- Компилятор TypeScript предотвращает ошибки

---

## UML диаграмма

![Архитектура проекта](public/uml-architecture.png)

---

## Заключение

Проект реализован с соблюдением современных принципов разработки и лучших практик TypeScript. Архитектура обеспечивает высокую масштабируемость, тестируемость и поддерживаемость кода.



