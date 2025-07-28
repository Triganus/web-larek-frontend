import { Model } from '../Model';
import { IEvents } from '../events';
import { 
    IOrder, 
    IOrderModel, 
    IBasketItem, 
    PaymentMethod 
} from '../../../types';

export class OrderModel extends Model<IOrder> implements IOrderModel {
    order: IOrder = {
        items: [],
        total: 0
    };

    constructor(events: IEvents) {
        super({items: [], total: 0}, events);
    }

    setPayment(payment: PaymentMethod): void {
        this.order.payment = payment;
        this.emitChanges('order:changed', this.order);
    }

    setEmail(email: string): void {
        this.order.email = email;
        this.emitChanges('order:changed', this.order);
    }

    setPhone(phone: string): void {
        this.order.phone = phone;
        this.emitChanges('order:changed', this.order);
    }

    setAddress(address: string): void {
        this.order.address = address;
        this.emitChanges('order:changed', this.order);
    }

    setItems(items: IBasketItem[]): void {
        this.order.items = items;
        this.order.total = items.reduce(
            (total, item) => total + (item.product.price || 0) * item.quantity, 
            0
        );
        this.emitChanges('order:changed', this.order);
    }

    validateOrder(): boolean {
        return !!(this.order.payment && this.order.address?.trim());
    }

    validateContacts(): boolean {
        return !!(this.order.email?.trim() && this.order.phone?.trim());
    }

    clear(): void {
        this.order = {
            items: [],
            total: 0
        };
        this.emitChanges('order:changed', this.order);
    }

    getOrderData(): IOrder {
        return { ...this.order };
    }

    getErrors(): string[] {
        const errors: string[] = [];
        
        if (!this.order.payment) {
            errors.push('Необходимо выбрать способ оплаты');
        }
        
        if (!this.order.address?.trim()) {
            errors.push('Необходимо указать адрес доставки');
        }
        
        if (!this.order.email?.trim()) {
            errors.push('Необходимо указать email');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email)) {
            errors.push('Некорректный формат email');
        }
        
        if (!this.order.phone?.trim()) {
            errors.push('Необходимо указать телефон');
        }
        
        return errors;
    }
}
