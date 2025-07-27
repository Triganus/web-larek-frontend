import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { IBasketView, IBasket } from '../../types';

export class Basket extends Component<IBasket> implements IBasketView {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(this.createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    protected createElement<T extends HTMLElement>(tagName: keyof HTMLElementTagNameMap, props?: Partial<T>): T {
        const element = document.createElement(tagName) as T;
        if (props) {
            Object.assign(element, props);
        }
        return element;
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    updateCounter(count: number): void {
        this.setElementDisabled(this._button, count === 0);
    }

    render(basket: IBasket): HTMLElement {
        this.total = basket.total;
        this.updateCounter(basket.count);
        return this.container;
    }
}
