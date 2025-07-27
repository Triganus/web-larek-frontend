import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrderForm, PaymentMethod } from '../../types';

export class OrderForm extends Form<IOrderForm> {
    protected _payment: HTMLButtonElement[];
    protected _address: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._payment = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        this._address = container.querySelector('input[name="address"]') as HTMLInputElement;

        this._payment.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as PaymentMethod;
                this.payment = payment;
                this.onInputChange('payment' as keyof IOrderForm, payment);
            });
        });
    }

    set payment(value: PaymentMethod | null) {
        this._payment.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this._address.value = value;
    }

    get address(): string {
        return this._address.value;
    }
}
