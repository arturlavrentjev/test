// Получение элемента счетчика корзины и всех карточек продуктов
const cartCount = document.querySelector('.cart-count');
const cards = document.querySelectorAll('.product-card');
// Добавление обработчиков событий для каждой карточки продукта
cards.forEach(card => {
	card.addEventListener('click', event => handleCardClick(event));
});
// Обработчик кликов по карточке продукта
function handleCardClick(event) {
	const target = event.target;
	const counterInput = target.parentNode.querySelector('.counter__input');
	if (target.classList.contains('counter__increase')) {
		updateCounter(counterInput, 1);
	} else if (target.classList.contains('counter__decrease')) {
		updateCounter(counterInput, -1);
	} else if (target.className === 'product-card__add-to-cart') {
		const cardId = target.parentNode.getAttribute('id');
		const count = counterInput.value;
		fetchProductData(cardId, count);
	} else if (
		target.className === 'product-card__add-to-cart modal__content-add-to-cart'
	) {
		addToCart();
	}
}
// Обновление значения счетчика
function updateCounter(input, increment) {
	const currentValue = parseInt(input.value, 10);
	const newValue = Math.max(currentValue + increment, 0);
	input.value = newValue;
	input.setAttribute('value', newValue);
}
// Запрос данных продукта и открытие модального окна
function fetchProductData(cardId, count) {
	fetch(location.href)
		.then(response => response.text())
		.then(data => parseHtmlAndOpenModal(data, cardId, count));
}
// Парсинг HTML и открытие модального окна с информацией о продукте
function parseHtmlAndOpenModal(data, id, count) {
	const parser = new DOMParser();
	const htmlDocument = parser.parseFromString(data, 'text/html');
	const foundCard = htmlDocument.getElementById(id);

	if (foundCard) {
		const modalContent = prepareModalContent(foundCard, count);
		openModal(modalContent);
	}
}
// Подготовка содержимого модального окна
function prepareModalContent(card, count) {
	const cloneCard = card.cloneNode(true);
	cloneCard.classList.add('modal__content-text');
	const description = cloneCard.querySelector('.product-card__description');
	const addToCartBtn = cloneCard.querySelector('.product-card__add-to-cart');
	// addToCartBtn.className = 'modal__content-add-to-cart';
	const counterInput = cloneCard.querySelector('.counter__input');
	counterInput.value = count;
	addToCartBtn.textContent = 'Добавить в корзину';
	addToCartBtn.classList.add('modal__content-add-to-cart');
	description.removeAttribute('hidden');
	cloneCard.append(description, addToCartBtn);
	return cloneCard;
}
// Создание и открытие модального окна
function openModal(content) {
	const modal = createModal();
	const modalContent = modal.querySelector('.modal__content');
	modalContent.append(content);
	modal.classList.add('open');
	document.body.classList.add('no-scroll');
}
// Создание модального окна
function createModal() {
	const modal = document.createElement('div');
	modal.classList.add('modal');
	const modalContent = document.createElement('div');
	modalContent.classList.add('modal__content');
	modal.append(modalContent);

	// Добавление кнопки закрытия
	const closeModalBtn = document.createElement('button');
	closeModalBtn.textContent = 'x';
	closeModalBtn.classList.add('close');
	modalContent.append(closeModalBtn);

	// Обработчики событий для модального окна
	modal.addEventListener('click', event => handleCardClick(event));
	modal.addEventListener('click', event => {
		if (event.target === closeModalBtn || event.target === modal) {
			closeModal(modal);
		}
	});
	document.body.append(modal);
	return modal;
}
// Закрытие модального окна
function closeModal(modal) {
	modal.classList.remove('open');
	document.body.classList.remove('no-scroll');
	modal.remove();
}
// Добавление товара в корзину
function addToCart() {
	const count = parseInt(localStorage.getItem('cartCount'), 10) || 0;
	const newCount = count + 1;
	cartCount.textContent = newCount;
	localStorage.setItem('cartCount', newCount);
}
// Инициализация счетчика корзины при загрузке страницы
window.addEventListener('load', () => {
	cartCount.textContent = localStorage.getItem('cartCount');
});