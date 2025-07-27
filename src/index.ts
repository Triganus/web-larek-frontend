import './scss/styles.scss';

// Импорт базовых классов
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/api/weblarekAPI';

// Импорт моделей
import { CatalogModel } from './components/models/Catalog';
import { BasketModel } from './components/models/Basket';
import { OrderModel } from './components/models/Order';

// Импорт представлений
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Card } from './components/views/Card';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';

// Получаем API endpoints из настроек
const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// Инициализация событийной системы
const events = new EventEmitter();

// Инициализация API
const api = new WebLarekAPI(CDN_URL, API_URL);

// Инициализация моделей
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
// const orderModel = new OrderModel(events); // Пока не используется

// Получаем элементы DOM
const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

// Шаблоны для карточек и других элементов
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Инициализация представлений
const basket = new Basket(basketTemplate.content.querySelector('.basket')!.cloneNode(true) as HTMLElement, events);
// const orderForm = new OrderForm(orderTemplate.content.querySelector('.form')!.cloneNode(true) as HTMLFormElement, events);
// const contactsForm = new ContactsForm(contactsTemplate.content.querySelector('.form')!.cloneNode(true) as HTMLFormElement, events);
// const success = new Success(successTemplate.content.querySelector('.order-success')!.cloneNode(true) as HTMLElement, events);

// Загрузка товаров при инициализации
api.getProductList()
    .then(products => {
        catalogModel.setProducts(products);
    })
    .catch(console.error);

// Обработчики событий
events.on('catalog:changed', () => {
    const cards = catalogModel.products.map(product => {
        const cardElement = cardCatalogTemplate.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
        const card = new Card(cardElement, events, 'gallery');
        return card.render({
            id: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            price: product.price ? String(product.price) : null
        });
    });
    page.catalog = cards;
});

events.on('card:select', ({ card }: { card: Card }) => {
    const product = catalogModel.getProduct(card.id);
    if (product) {
        const cardElement = cardPreviewTemplate.content.querySelector('.card')!.cloneNode(true) as HTMLElement;
        const previewCard = new Card(cardElement, events, 'preview');
        const cardContent = previewCard.render({
            id: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            price: product.price ? String(product.price) : null,
            description: product.description,
            button: {
                text: basketModel.contains(product.id) ? 'Убрать' : 'В корзину',
                disabled: false
            }
        });
        modal.render({ content: cardContent });
    }
});

events.on('basket:open', () => {
    modal.render({ content: basket.render({
        items: basketModel.getItems(),
        total: basketModel.getTotal(),
        count: basketModel.getCount()
    })});
});

events.on('basket:changed', () => {
    page.counter = basketModel.getCount();
});

// events.on('order:open', () => {
//     modal.render({ content: orderForm.container });
// });

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

console.log('Веб-ларёк инициализирован');
