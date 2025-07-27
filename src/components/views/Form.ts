import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { IFormView } from '../../types';

export class Form<T> extends Component<IFormView> implements IFormView<T> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;

        this._submit = container.querySelector('button[type=submit]') as HTMLButtonElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;

        this.container.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            const formName = (this.container as HTMLFormElement).name || 'form';
            this.events.emit(`${formName}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        const formName = (this.container as HTMLFormElement).name || 'form';
        this.events.emit(`${formName}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.setElementDisabled(this._submit, !value);
    }

    set errors(value: string[]) {
        this.setText(this._errors, value.join('; '));
    }

    render(state: Partial<T> & IFormView): HTMLElement {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }

    validate(): boolean {
        // Переопределяется в наследниках
        return true;
    }

    clear(): void {
        const form = this.container as HTMLFormElement;
        form.reset();
    }
}
