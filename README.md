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
│   ├── base/         // Базовые абстракции: EventEmitter, Api
│   ├── models/       // Классы моделей: Product, Order, Basket
│   ├── presenters/   // Классы презентеров
│   └── views/        // Классы View-компонентов
├── types/            // TS-типизации
├── utils/            // Вспомогательные функции и константы
├── scss/             // Стили
└── index.ts          // Точка входа
```

---

## Модели данных

### Каталог товаров

```typescript
interface ICatalogModel {
  products: IProduct[];
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): IProduct | undefined;
  setProducts(products: ApiProduct[]): void;
}
```

### Корзина

```typescript
interface IBasketModel {
  items: Map<string, IBasketItem>;
  add(product: IProduct): void;
  remove(productId: string): void;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  getItems(): IBasketItem[];
  contains(productId: string): boolean;
}
```

### Заказ

```typescript
interface IOrderModel {
  order: IOrder;
  setPayment(payment: PaymentMethod): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  setAddress(address: string): void;
  validateOrder(): boolean;
  validateContacts(): boolean;
  clear(): void;
  getOrderData(): IOrder;
}
```

---

## Компоненты (View)

| Класс         | Назначение                                   |
|---------------|----------------------------------------------|
| Card          | Отображение товара, кнопка «Купить»          |
| Basket        | Список товаров в корзине, сумма, оформление  |
| Modal         | Модальное окно                               |
| OrderForm     | Форма оплаты и адреса                        |
| ContactsForm  | Форма контактов                              |
| Success       | Модалка успешной покупки                     |
| Page          | Главная страница с каталогом                 |

---

## Презентеры

**Презентеры в данной архитектуре заменены событийной системой:**

- Взаимодействие между компонентами происходит через события (EventEmitter)
- Каждый компонент подписывается на необходимые события
- При изменениях компоненты эмитят соответствующие события
- Это обеспечивает слабую связанность между компонентами

---

## Взаимодействие слоёв

Архитектура использует **событийную модель взаимодействия** вместо классических презентеров:

- **Model** хранит данные и бизнес-логику, эмитит события при изменениях.
- **View** отображает данные и реагирует на действия пользователя, эмитит события.
- **EventEmitter** связывает все компоненты через систему событий.
- Компоненты слабо связаны — каждый знает только о событиях, но не о других компонентах.

**Пример потока событий:**
1. Пользователь кликает "Купить" → View эмитит `ProductAddedToBasket`
2. BasketModel слушает событие → добавляет товар → эмитит `BasketChanged`
3. BasketView слушает `BasketChanged` → обновляет отображение счетчика
4. PageView слушает `BasketChanged` → обновляет счетчик в шапке

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

**Примеры ключевых интерфейсов:**

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

// Модели данных
interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: ProductCategory;
}

// Представления
interface IProductView {
  id: string;
  title: string;
  price: string; // отформатированная цена
  image: string;
  category: string;
  button?: {
    text: string;
    disabled: boolean;
  };
}

// События
enum AppEvent {
  ProductSelected = 'product:selected',
  BasketChanged = 'basket:changed',
  OrderSubmitted = 'order:submitted'
}
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

## Принципы и лучшие практики

- Каждый класс отвечает только за свою часть логики (Single Responsibility).
- Взаимодействие между слоями — только через события или передачу экземпляров.
- Повторяющийся код вынесен в утилиты.
- Запросы к API инкапсулированы в отдельном классе.
- Все DOM-элементы, с которыми работает класс, сохраняются в поля класса.


---



