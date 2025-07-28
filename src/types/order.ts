// Типы для работы с заказами
import { PaymentMethod } from './api';
import { IBasketItem } from './basket';

// Интерфейс данных заказа
export interface IOrder {
    payment?: PaymentMethod;
    email?: string;
    phone?: string;
    address?: string;
    items: IBasketItem[];
    total: number;
}

// Частичный тип для внутреннего состояния заказа (без items и total)
export interface IOrderData {
    payment?: PaymentMethod;
    email?: string;
    phone?: string;
    address?: string;
}

// Интерфейс модели заказа
export interface IOrderModel {
    order: IOrderData;
    setPayment(payment: PaymentMethod): void;
    setEmail(email: string): void;
    setPhone(phone: string): void;
    setAddress(address: string): void;
    validateOrder(): boolean;
    validateContacts(): boolean;
    clear(): void;
    getOrderData(items: IBasketItem[], total: number): IOrder;
}

// Интерфейс формы заказа (адрес и способ оплаты)
export interface IOrderForm {
    payment: PaymentMethod | null;
    address: string;
}

// Интерфейс формы контактов
export interface IContactsForm {
    email: string;
    phone: string;
}

// Интерфейс результата заказа
export interface IOrderResult {
    id: string;
    total: number;
}

// Интерфейс представления успешного заказа
export interface ISuccessView {
    render(result: IOrderResult): HTMLElement;
}

// События заказа
export interface OrderChangeEvent {
    order: IOrder;
    isValid: boolean;
    errors: string[];
}

export interface OrderSubmitEvent {
    order: IOrder;
}

export interface OrderSuccessEvent {
    result: IOrderResult;
}

// Типы ошибок валидации
export type OrderErrors = Partial<Record<keyof IOrder, string>>;
export type ContactsErrors = Partial<Record<keyof IContactsForm, string>>;
