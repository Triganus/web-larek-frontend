// Типы для API запросов и ответов
export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Типы данных, приходящие с API
export interface ApiProduct {
    id: string;
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: ProductCategory;
}

export interface ApiOrderRequest {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; // ID товаров
}

export interface ApiOrderResponse {
    id: string;
    total: number;
}

export interface ApiError {
    error: string;
    message?: string;
}

// Интерфейс базового API клиента
export interface IApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс специализированного API клиента для приложения
export interface IWebLarekAPI {
    getProductList(): Promise<ApiProduct[]>;
    getProduct(id: string): Promise<ApiProduct>;
    orderProducts(order: ApiOrderRequest): Promise<ApiOrderResponse>;
}

// Вспомогательные типы
export type ProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
export type PaymentMethod = 'online' | 'cash';
