import { IEvents } from '../base/events';
import { IOrderModel, IOrder, IBasketItem, PaymentMethod } from '../../types';

export class OrderModel implements IOrderModel {
    protected _order: IOrder;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this._order = {
            items: [],
            total: 0
        };
    }

    setPayment(payment: PaymentMethod): void {
        this._order.payment = payment;
        this.events.emit('order:changed', { order: this._order });
    }

    setEmail(email: string): void {
        this._order.email = email;
        this.events.emit('order:changed', { order: this._order });
    }

    setPhone(phone: string): void {
        this._order.phone = phone;
        this.events.emit('order:changed', { order: this._order });
    }

    setAddress(address: string): void {
        this._order.address = address;
        this.events.emit('order:changed', { order: this._order });
    }

    setItems(items: IBasketItem[]): void {
        this._order.items = items;
        this._order.total = items.reduce((total, item) => {
            return total + (item.product.price || 0) * item.quantity;
        }, 0);
        this.events.emit('order:changed', { order: this._order });
    }

    validateOrder(): boolean {
        const errors: string[] = [];
        
        if (!this._order.payment) {
            errors.push('Выберите способ оплаты');
        }
        
        if (!this._order.address || this._order.address.trim().length === 0) {
            errors.push('Укажите адрес доставки');
        }
        
        if (errors.length > 0) {
            this.events.emit('form:errors', { errors });
            return false;
        }
        
        return true;
    }

    validateContacts(): boolean {
        const errors: string[] = [];
        
        if (!this._order.email || !this.isValidEmail(this._order.email)) {
            errors.push('Укажите корректный email');
        }
        
        if (!this._order.phone || this._order.phone.trim().length === 0) {
            errors.push('Укажите номер телефона');
        }
        
        if (errors.length > 0) {
            this.events.emit('form:errors', { errors });
            return false;
        }
        
        return true;
    }

    private isValidEmail(email: string): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    clear(): void {
        this._order = {
            items: [],
            total: 0
        };
        this.events.emit('order:changed', { order: this._order });
    }

    getOrderData(): IOrder {
        return { ...this._order };
    }

    get order(): IOrder {
        return this._order;
    }
}
