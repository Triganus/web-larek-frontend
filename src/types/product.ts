// Типы для работы с товарами
import { ApiProduct, ProductCategory } from './api';

// Интерфейс модели товара
export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: ProductCategory;
}

// Интерфейс для отображения товара на экране
export interface IProductView {
    id: string;
    title: string;
    description?: string;
    price: string; // отформатированная цена
    image: string;
    category: string;
    button?: {
        text: string;
        disabled: boolean;
    };
}

// Интерфейс каталога товаров
export interface ICatalog {
    items: IProduct[];
    total: number;
    loading: boolean;
}

// Интерфейс модели каталога
export interface ICatalogModel {
    products: IProduct[];
    getProducts(): Promise<IProduct[]>;
    getProduct(id: string): IProduct | undefined;
    setProducts(products: ApiProduct[]): void;
}

// Интерфейс представления каталога
export interface ICatalogView {
    render(catalog: ICatalog): HTMLElement;
}

// Интерфейс карточки товара
export interface ICardView {
    render(product: IProductView): HTMLElement;
    setDisabled(disabled: boolean): void;
}

// Типы карточек товара
export type CardType = 'gallery' | 'preview' | 'basket';

// Интерфейс для данных товара в корзине
export interface IBasketProductData extends IProductView {
    index: number;
}
