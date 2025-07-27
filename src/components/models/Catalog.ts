import { IEvents } from '../base/events';
import { ICatalogModel, IProduct, ApiProduct } from '../../types';

export class CatalogModel implements ICatalogModel {
    protected _products: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    async getProducts(): Promise<IProduct[]> {
        return this._products;
    }

    getProduct(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    setProducts(products: ApiProduct[]): void {
        this._products = products.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category
        }));
        this.events.emit('catalog:changed', { products: this._products });
    }

    get products(): IProduct[] {
        return this._products;
    }
}
