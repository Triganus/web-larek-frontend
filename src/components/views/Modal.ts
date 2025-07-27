import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { IModalView } from '../../types';

export class Modal extends Component<IModalView> implements IModalView {
    protected _content: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this._content = container.querySelector('.modal__content') as HTMLElement;

        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement | null) {
        this._content.replaceChildren(value);
    }

    get content(): HTMLElement | null {
        return this._content.firstElementChild as HTMLElement;
    }

    open(content: HTMLElement): void {
        this.content = content;
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: { content: HTMLElement }): HTMLElement {
        super.render(data);
        this.open(data.content);
        return this.container;
    }
}
