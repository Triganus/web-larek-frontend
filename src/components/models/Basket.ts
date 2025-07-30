import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { 
    IBasket, 
    IBasketModel, 
    IBasketItem, 
    IProduct 
} from '../../types';

export class BasketModel extends Model<IBasket> implements IBasketModel {
    items = new Map<string, IBasketItem>();

    constructor(events: IEvents) {
        super({items: [], total: 0, count: 0}, events);
    }

    add(product: IProduct): void {
        if (product.price === null) {
            return; // Бесценные товары нельзя добавить в корзину
        }

        // Согласно брифу, не должно быть более одного товара каждого вида
        if (this.items.has(product.id)) {
            return; // Товар уже в корзине, не добавляем повторно
        }

        this.items.set(product.id, {
            product,
            quantity: 1
        });
        
        this.emitChanges('basket:changed', {
            items: this.getItems(),
            total: this.getTotal(),
            count: this.getCount()
        });
    }

    remove(productId: string): void {
        if (this.items.has(productId)) {
            this.items.delete(productId);
            this.emitChanges('basket:changed', {
                items: this.getItems(),
                total: this.getTotal(),
                count: this.getCount()
            });
        }
    }

    clear(): void {
        this.items.clear();
        this.emitChanges('basket:changed', {
            items: [],
            total: 0,
            count: 0
        });
    }

    getTotal(): number {
        return Array.from(this.items.values()).reduce(
            (total, item) => total + (item.product.price || 0), 
            0
        );
    }

    getCount(): number {
        return this.items.size; // Просто количество уникальных товаров
    }

    getItems(): IBasketItem[] {
        return Array.from(this.items.values());
    }

    contains(productId: string): boolean {
        return this.items.has(productId);
    }
}
