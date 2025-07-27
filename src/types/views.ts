// Типы для представлений (Views)
import { IEvents } from './events';

// Базовый интерфейс компонента
export interface IComponent {
    container: HTMLElement;
    render(data?: any): HTMLElement;
}

// Интерфейс модального окна
export interface IModalView {
    content: HTMLElement | null;
    open(content: HTMLElement): void;
    close(): void;
    render(data: { content: HTMLElement }): HTMLElement;
}

// Интерфейс базовой формы
export interface IFormView<T = any> {
    valid: boolean;
    errors: string[];
    render(data: Partial<T>): HTMLElement;
    validate(): boolean;
    clear(): void;
}

// Интерфейс главной страницы
export interface IPageView {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
    render(): HTMLElement;
}

// Данные для представлений
export interface FormState {
    valid: boolean;
    errors: string[];
}

export interface ModalData {
    content: HTMLElement;
}

export interface PageData {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

// Интерфейс для презентеров (если используется MVP)
export interface IPresenter {
    events: IEvents;
    init(): void;
}

// Универсальный тип для обработчиков событий в представлениях
export type EventHandler<T = any> = (data?: T) => void;

// Интерфейс для компонентов с событиями
export interface IEventComponent extends IComponent {
    events: IEvents;
}
