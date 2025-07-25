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

В проекте реализован паттерн **MVP (Model-View-Presenter)**:
- **Model** — бизнес-логика и данные (товары, корзина, заказ).
- **View** — отображение и взаимодействие с DOM.
- **Presenter** — посредник между Model и View, управляет логикой приложения.

Взаимодействие между слоями реализовано через событийную систему (EventEmitter).

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

### Product

```typescript
class Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;

  constructor(params: { id: string; title: string; description: string; price: number; image: string; category: string });
  getFormattedPrice(): string;
}
```

### Basket

```typescript
class Basket {
  items: Product[];

  constructor(items?: Product[]);
  addItem(product: Product): void;
  removeItem(productId: string): void;
  clear(): void;
  getTotal(): number;
  getCount(): number;
}
```

### Order

```typescript
class Order {
  id: string;
  items: Product[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';

  constructor(params: { id: string; items: Product[]; total: number; status: 'pending' | 'completed' | 'cancelled' });
  isValid(): boolean;
}
```

---

## Компоненты (View)

| Класс         | Назначение                                   |
|---------------|----------------------------------------------|
| ProductCard   | Отображение товара, кнопка «Купить»          |
| CartView      | Список товаров в корзине, сумма, оформление  |
| ModalWindow   | Модальное окно                               |
| PaymentForm   | Форма оплаты и адреса                        |
| ContactForm   | Форма контактов                              |
| SuccessModal  | Модалка успешной покупки                     |

---

## Презентеры

| Класс             | Назначение                                      |
|-------------------|-------------------------------------------------|
| CatalogPresenter  | Управляет каталогом товаров                     |
| BasketPresenter   | Управляет корзиной                              |
| OrderPresenter    | Управляет процессом оформления заказа           |

---

## Взаимодействие слоёв

- **View** реагирует на действия пользователя и вызывает методы **Presenter**.
- **Presenter** обновляет **Model** и подписан на её события.
- **Model** хранит данные и бизнес-логику, эмитит события при изменениях.
- **Presenter** обновляет **View** при изменениях в **Model**.

---

## Типы данных

- Все типы и интерфейсы объявлены в `src/types`.
- Используются строгие типы, дженерики, объединения.
- Не используется `any`, не дублируются типы, не ослабляется контроль типов.

**Пример интерфейса:**
```typescript
interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}
```

---

## Принципы и лучшие практики

- Каждый класс отвечает только за свою часть логики (Single Responsibility).
- Взаимодействие между слоями — только через события или передачу экземпляров.
- Повторяющийся код вынесен в утилиты.
- Запросы к API инкапсулированы в отдельном классе.
- Все DOM-элементы, с которыми работает класс, сохраняются в поля класса.


---

## Дополнительно


