import { Api, ApiListResponse } from '../base/api';
import { IWebLarekAPI, ApiProduct, ApiOrderRequest, ApiOrderResponse } from '../../types';

export class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductList(): Promise<ApiProduct[]> {
        return this.get('/product').then((data: ApiListResponse<ApiProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getProduct(id: string): Promise<ApiProduct> {
        return this.get(`/product/${id}`).then((item: ApiProduct) => ({
            ...item,
            image: this.cdn + item.image
        }));
    }

    orderProducts(order: ApiOrderRequest): Promise<ApiOrderResponse> {
        return this.post('/order', order).then((data: ApiOrderResponse) => data);
    }
}
