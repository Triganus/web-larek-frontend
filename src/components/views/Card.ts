import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ICardView, IProductView, CardType } from '../../types';

const categoryClasses: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'кнопка': 'card__category_button',
    'дополнительное': 'card__category_additional',
    'другое': 'card__category_other'
};

export class Card extends Component<IProductView> implements ICardView {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;
    protected events: IEvents;
    protected type: CardType;

    constructor(container: HTMLElement, events: IEvents, type: CardType = 'gallery') {
        super(container);
        this.events = events;
        this.type = type;

        this._title = container.querySelector('.card__title') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        this._index = container.querySelector('.basket__item-index') as HTMLElement;

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('card:select', { card: this });
            });
        }

        if (this.type === 'gallery') {
            this.container.addEventListener('click', () => {
                this.events.emit('card:select', { card: this });
            });
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
            this._image.alt = this.title;
        }
    }

    set price(value: string | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this._button.disabled = true;
            }
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
        if (this._category) {
            const className = categoryClasses[value];
            if (className) {
                this._category.className = `card__category ${className}`;
            }
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }

    setDisabled(disabled: boolean): void {
        if (this._button) {
            this._button.disabled = disabled;
        }
    }

    render(product: IProductView): HTMLElement {
        Object.assign(this, product);
        return this.container;
    }
}
