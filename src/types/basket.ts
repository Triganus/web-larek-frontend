// Типы для работы с корзиной
import { IProduct } from './product';

// Интерфейс элемента корзины
export interface IBasketItem {
    product: IProduct;
    quantity: number;
}

// Интерфейс корзины
export interface IBasket {
    items: IBasketItem[];
    total: number;
    count: number;
}

// Интерфейс модели корзины
export interface IBasketModel {
    items: Map<string, IBasketItem>;
    add(product: IProduct): void;
    remove(productId: string): void;
    clear(): void;
    getTotal(): number;
    getCount(): number;
    getItems(): IBasketItem[];
    contains(productId: string): boolean;
}

// Интерфейс представления корзины
export interface IBasketView {
    render(basket: IBasket): HTMLElement;
    updateCounter(count: number): void;
}

// Интерфейс для отображения товара в корзине
export interface IBasketItemView {
    render(item: IBasketItem, index: number): HTMLElement;
}

// События корзины
export interface BasketAddEvent {
    product: IProduct;
}

export interface BasketRemoveEvent {
    productId: string;
}

export interface BasketChangeEvent {
    items: IBasketItem[];
    total: number;
    count: number;
}
