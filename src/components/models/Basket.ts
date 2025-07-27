import { IEvents } from '../base/events';
import { IBasketModel, IBasketItem, IProduct } from '../../types';

export class BasketModel implements IBasketModel {
    protected _items: Map<string, IBasketItem> = new Map();
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    add(product: IProduct): void {
        if (this._items.has(product.id)) {
            const item = this._items.get(product.id)!;
            item.quantity += 1;
        } else {
            this._items.set(product.id, {
                product,
                quantity: 1
            });
        }
        this.events.emit('basket:changed', {
            items: this.getItems(),
            total: this.getTotal(),
            count: this.getCount()
        });
    }

    remove(productId: string): void {
        if (this._items.has(productId)) {
            this._items.delete(productId);
            this.events.emit('basket:changed', {
                items: this.getItems(),
                total: this.getTotal(),
                count: this.getCount()
            });
        }
    }

    clear(): void {
        this._items.clear();
        this.events.emit('basket:changed', {
            items: this.getItems(),
            total: this.getTotal(),
            count: this.getCount()
        });
    }

    getTotal(): number {
        return Array.from(this._items.values()).reduce((total, item) => {
            return total + (item.product.price || 0) * item.quantity;
        }, 0);
    }

    getCount(): number {
        return Array.from(this._items.values()).reduce((count, item) => {
            return count + item.quantity;
        }, 0);
    }

    getItems(): IBasketItem[] {
        return Array.from(this._items.values());
    }

    contains(productId: string): boolean {
        return this._items.has(productId);
    }

    get items(): Map<string, IBasketItem> {
        return this._items;
    }
}
