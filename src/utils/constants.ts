export const API_URL = `${process.env.API_ORIGIN || 'https://larek-api.nomoreparties.co'}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN || 'https://larek-api.nomoreparties.co'}/content/weblarek`;

export const settings = {
    
};

// Селекторы шаблонов
export const selectors = {
    cardCatalog: '#card-catalog',
    cardPreview: '#card-preview',
    cardBasket: '#card-basket',
    basket: '#basket',
    order: '#order',
    contacts: '#contacts',
    success: '#success'
};

// Классы для стилизации категорий
export const CategoryClasses: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'другое': 'card__category_other'
};
