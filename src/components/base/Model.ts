import { IEvents } from './events';

/**
 * Базовая модель, чтобы можно было отличить модель от простых объектов с данными
 */
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // Сообщить всем что модель поменялась
    emitChanges(event: string, payload?: object) {
        // Состав данных, которые будут переданы в событии
        this.events.emit(event, payload ?? {});
    }
}
