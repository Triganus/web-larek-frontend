import './scss/styles.scss';

// Импорт базовых абстракций (остаются как архитектурная основа)
import { EventEmitter } from './components/base/events';
import { Component } from './components/base/component';
import { Model } from './components/base/Model';
import { Api } from './components/base/api';

// Импорт типов для демонстрации архитектуры
import { 
    IProduct, 
    IBasket, 
    IOrder, 
    AppEvent,
    ICatalogModel,
    IBasketModel,
    IOrderModel 
} from './types';

// Точка входа приложения
// В будущих спринтах здесь будет реализован Presenter,
// который свяжет модели и представления через EventEmitter

console.log('Веб-ларёк: Архитектура и типы готовы к реализации!');

// Демонстрация использования базовых абстракций
const events = new EventEmitter();

// Здесь будут инициализированы:
// - API клиент для работы с сервером
// - Модели данных (Catalog, Basket, Order)  
// - Компоненты представления (Card, Modal, Form и др.)
// - Настройка взаимодействия через события
