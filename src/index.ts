import './scss/styles.scss';

// Импорт базовой абстракции для демонстрации событийной архитектуры
import { EventEmitter } from './components/base/events';

// Точка входа приложения
// В будущих спринтах здесь будет реализован Presenter,
// который свяжет модели и представления через EventEmitter

console.log('Веб-ларёк: Архитектура и типы готовы к реализации!');

// Демонстрация использования событийной системы
const events = new EventEmitter();
console.log('EventEmitter инициализирован:', events.constructor.name);

// Здесь будут инициализированы:
// - API клиент для работы с сервером (extends Api)
// - Модели данных (extends Model): Catalog, Basket, Order  
// - Компоненты представления (extends Component): Card, Modal, Form и др.
// - Настройка взаимодействия через события
