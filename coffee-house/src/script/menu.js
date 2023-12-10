import getProductMarkup from './menu-markup.js';

const res = await fetch('src/products.json');
const data = await res.json();

const menuItemsContainer = document.querySelector('.menu__items');
const menuAddBtn = document.querySelector('.menu__add-button')

const DESKTOP_WIDTH = 1024;

let currentItems = [];
let currentCategory = 'coffee';
let isDesktop = true;

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

let visibleItemsCount = currentItems.length;

function renderItems(startIndex, endIndex) {
  for (let index = startIndex; index < endIndex; index++) {
    let item = currentItems[index];
    if (item) { createItem(item, index); }
  }

  if (visibleItemsCount >= currentItems.length) {
    menuAddBtn.style.display = 'none';
  }
}

function setVisibleItemsCount() {
  if (window.innerWidth < DESKTOP_WIDTH) {
    isDesktop = false;
    visibleItemsCount = 4;
    if (visibleItemsCount < currentItems.length) {
      menuAddBtn.style.display = 'flex';
    }
  }
}

function loadMoreItems() {
  let startIndex = visibleItemsCount;
  let endIndex = startIndex + 4;
  visibleItemsCount += 4;
  renderItems(startIndex, endIndex);
}

menuAddBtn.addEventListener('click', () => {
  loadMoreItems()
})


setVisibleItemsCount();
renderItems(0, visibleItemsCount);

window.addEventListener('resize', () => {
  //change from desktop to mobile
  if (isDesktop && window.innerWidth < DESKTOP_WIDTH) {
    console.log('change')
    isDesktop = false;
    visibleItemsCount = 4;

    menuItemsContainer.innerHTML = '';
    if (visibleItemsCount < currentItems.length) {
      menuAddBtn.style.display = 'flex';
    }
    renderItems(0, visibleItemsCount);
  }

  //change from mobile to desktop
  if (!isDesktop && window.innerWidth >= DESKTOP_WIDTH) {
    isDesktop = true;
    if (visibleItemsCount < currentItems.length) {
      renderItems(visibleItemsCount, currentItems.length);
    }
    if (visibleItemsCount >= currentItems.length) {
      menuAddBtn.style.display = 'none';
    }
  }
})