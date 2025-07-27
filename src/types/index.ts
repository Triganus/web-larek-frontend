// Главный файл экспорта всех типов приложения

// API типы
export * from './api';

// Типы событий
export * from './events';

// Типы товаров и каталога
export * from './product';

// Типы корзины
export * from './basket';

// Типы заказов
export * from './order';

// Типы представлений
export * from './views';

// Дополнительные типы для удобства разработки
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;

// Типы для валидации форм
export interface ValidationRule<T = unknown> {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validate?: (value: T) => boolean | string;
}

export type ValidationRules<T> = Partial<Record<keyof T, ValidationRule>>;

// Общие типы для состояния приложения
export interface AppState {
    catalog: {
        products: import('./product').IProduct[];
        loading: boolean;
        error?: string;
    };
    basket: import('./basket').IBasket;
    order: import('./order').IOrder;
    modal: {
        isOpen: boolean;
        content?: HTMLElement;
    };
}
