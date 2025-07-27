import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { IPageView } from '../../types';

export class Page extends Component<IPageView> implements IPageView {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._counter = container.querySelector('.header__basket-counter') as HTMLElement;
        this._catalog = container.querySelector('.gallery') as HTMLElement;
        this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;
        this._basket = container.querySelector('.header__basket') as HTMLButtonElement;

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }

    render(): HTMLElement {
        return this.container;
    }
}
