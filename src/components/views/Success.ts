import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ISuccessView, IOrderResult } from '../../types';

export class Success extends Component<IOrderResult> implements ISuccessView {
    protected _total: HTMLElement;
    protected _close: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._total = container.querySelector('.order-success__description') as HTMLElement;
        this._close = container.querySelector('.order-success__close') as HTMLButtonElement;

        if (this._close) {
            this._close.addEventListener('click', () => {
                this.events.emit('order:success');
            });
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }

    render(result: IOrderResult): HTMLElement {
        this.total = result.total;
        return this.container;
    }
}
