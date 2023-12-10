import getProductMarkup from './menu-markup.js';

const res = await fetch('src/products.json');
const data = await res.json();

const menuItemsContainer = document.querySelector('.menu__items');

let currentItems = [];
let currentCategory = 'coffee';

function getItems() {
  currentItems = data.filter((item) => item.category === currentCategory);
}

getItems();

console.log(currentItems);

function createItem(item, index) {
  const product = document.createElement('div');
  product.innerHTML = getProductMarkup(currentCategory, item, index);
  menuItemsContainer.appendChild(product)
}

let visibleItemsCount = 4;

function renderItems(itemsCount) {
  currentItems.forEach((item, index) => {
    if (index < itemsCount) { createItem(item, index); }
  })
}


renderItems(visibleItemsCount);