# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Вся логика проекта разделена на три ключевых слоя: **Модели (Model)**, **Представления (View)** и **Презентеры (Presenter)**. Взаимодействие между слоями реализовано через централизованный механизм событий (EventEmitter), что обеспечивает слабую связанность и облегчает тестирование.

```
┌─────────┐   пользовательское действие   ┌──────────────┐   изменение данных   ┌────────────┐
│  View   │ ────────────────────────────▶ │  Presenter   │ ──────────────────▶ │   Model    │
└─────────┘ ◀──────────────────────────── └──────────────┘ ◀────────────────── └────────────┘
                отрисовка/обновление            загрузка/модификация
```

### 1. Базовые сущности

| Класс         | Файл                                | Описание                                                                 |
|---------------|-------------------------------------|--------------------------------------------------------------------------|
| EventEmitter  | src/components/base/events.ts       | Управляет подпиской и рассылкой событий между слоями приложения.         |
| Model<T>      | src/components/base/Model.ts        | Абстракция для хранения и управления состоянием, поддерживает события.   |
| Component<P>  | src/components/base/component.ts    | Базовый класс для UI-компонентов, управляет DOM и реакцией на изменения. |
| Api           | src/components/base/api.ts          | Инкапсулирует работу с HTTP API: загрузка товаров, оформление заказа.    |

---

### 2. Модели данных

#### 2.1 Каталог товаров (Catalog)
- **Назначение:** Хранит список товаров и управляет их состоянием.
- **Наследование:** Model<ICatalogState>
- **Файл:** src/components/models/Catalog.ts
- **Методы:**
  - `setProducts(products: IProduct[]): void`
  - `getProducts(): IProduct[]`
  - `getProductById(id: string): IProduct | undefined`

#### 2.2 Корзина (Basket)
- **Назначение:** Управляет содержимым корзины, считает сумму и количество.
- **Наследование:** Model<IBasketState>
- **Файл:** src/components/models/Basket.ts
- **Методы:**
  - `addItem(product: IProduct): void`
  - `removeItem(id: string): void`
  - `getTotal(): number`
  - `getItems(): IBasketItem[]`

#### 2.3 Оформление заказа (Order)
- **Назначение:** Хранит и валидирует данные заказа, формирует итоговый объект для API.
- **Наследование:** Model<IOrderState>
- **Файл:** src/components/models/Order.ts
- **Методы:**
  - `updateField(field: string, value: string): void`
  - `validateOrder(): boolean`
  - `getOrderData(): IOrder`

---

### 3. Представления (View-компонентов)

| Компонент      | Файл                                 | Описание                                                        |
|----------------|--------------------------------------|-----------------------------------------------------------------|
| Card           | src/components/views/Card.ts         | Отображает товар, кнопку «Купить»/«Удалить».                    |
| Basket         | src/components/views/Basket.ts       | Список товаров в корзине, сумма, кнопка «Оформить».             |
| Modal          | src/components/views/Modal.ts        | Универсальное модальное окно с анимацией и закрытием.           |
| Form           | src/components/views/Form.ts         | Общая логика форм: сбор данных, валидация, блокировка кнопок.   |
| OrderForm      | src/components/views/OrderForm.ts    | Шаг 1: выбор оплаты и адрес.                                    |
| ContactsForm   | src/components/views/ContactsForm.ts | Шаг 2: email и телефон.                                         |
| Success        | src/components/views/Success.ts      | Модалка успешной покупки.                                       |
| Page           | src/components/views/Page.ts         | Шапка, основной контейнер, счетчик корзины.                     |

### 4. API

| Класс         | Файл                                | Описание                                                         |
|---------------|-------------------------------------|------------------------------------------------------------------|
| WebLarekAPI   | src/components/api/weblarekAPI.ts   | Специализированный API клиент для работы с сервером WebLarek.    |

### Пример описания компонента

```typescript
class Card extends Component<ICard> {
  constructor(container: HTMLElement, actions?: ICardActions);
  render(data: ICard): void;
}
```

## Заключение

Проект реализует интернет-магазин с использованием современной архитектуры MVP и событийно-ориентированного подхода. Код структурирован, типизирован и легко расширяем благодаря четкому разделению ответственности между компонентами.



