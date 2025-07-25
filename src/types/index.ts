// Типы данных, приходящие с API
export interface ApiProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface ApiOrder {
  id: string;
  items: ApiProduct[];
  total: number;
  status: OrderStatus;
}

// Типы для отображения на экране (ViewModel)
export interface CardView {
  id: string;
  title: string;
  price: string; // форматированная строка
  image: string;
  category: string;
  description?: string;
}

export interface BasketView {
  items: CardView[];
  total: string; // форматированная строка
}

// Интерфейс API-клиента
export interface IApiClient {
  getProducts(): Promise<ApiProduct[]>;
  getProduct(id: string): Promise<ApiProduct>;
  createOrder(order: ApiOrder): Promise<ApiOrder>;
  // ... другие методы по необходимости
}

// Интерфейсы моделей
export interface IProductModel {
  getAll(): Promise<ApiProduct[]>;
  getById(id: string): Promise<ApiProduct>;
}

export interface IOrderModel {
  getCurrentOrder(): ApiOrder;
  addItem(product: ApiProduct): void;
  removeItem(productId: string): void;
  clear(): void;
}

// Интерфейсы отображений (View)
export interface ICardView {
  render(data: CardView): HTMLElement;
}

export interface IBasketView {
  render(data: BasketView): HTMLElement;
}

export interface IModalView {
  open(content: HTMLElement): void;
  close(): void;
}

// Интерфейсы базовых классов
export interface IEventEmitter {
  on<T>(event: AppEvent, callback: (data: T) => void): void;
  emit<T>(event: AppEvent, data?: T): void;
  off<T>(event: AppEvent, callback: (data: T) => void): void;
}

// Перечисления событий и их интерфейсы
export enum AppEvent {
  ProductAdded = 'product:added',
  ProductRemoved = 'product:removed',
  OrderSubmitted = 'order:submitted',
  ModalOpened = 'modal:opened',
  ModalClosed = 'modal:closed',
  // ... другие события
}

// Примеры payload для событий
export interface ProductAddedPayload {
  product: ApiProduct;
}

export interface OrderSubmittedPayload {
  order: ApiOrder;
}

// Вспомогательные типы
export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type ProductCategory = 'soft' | 'hard' | 'other' | 'additional' | string;
