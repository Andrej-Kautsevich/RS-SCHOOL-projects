import getProductMarkup from './menu-markup.js';

const res = await fetch('src/products.json');
const data = await res.json();

const menuItemsContainer = document.querySelector('.menu__items');
const menuAddBtn = document.querySelector('.menu__add-button')

const DESKTOP_WIDTH = 1024;

let currentItems = [];
let currentCategory = 'coffee';
let isDesktop = true;

function getItems(category) {
  currentItems = data.filter((item) => item.category === category);
}

getItems(currentCategory);

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

//switching categories

const tabsBtn = document.querySelectorAll('[data-category]');

tabsBtn.forEach((tabBtn) => {
  tabBtn.addEventListener('click', (e) => {
    currentCategory = e.target.dataset['category'];

    tabsBtn.forEach((tabBtn) => { tabBtn.classList.remove('tabs-button_active') });
    tabBtn.classList.add('tabs-button_active');

    //remove current items
    changeTab(menuItemsContainer, () => {
      getItems(currentCategory);
      setVisibleItemsCount();
      renderItems(0, visibleItemsCount);
    });
  })
})

// Fade out tab animation
let fadeOut;
const changeTab = (tab, callback) => {
  const fadeOutKeyFrames = new KeyframeEffect(
    tab,
    [
      { opacity: 1 },
      { opacity: 0 },
    ],
    {
      duration: 500,
      easing: 'ease-out',
    },
  );
  fadeOut = new Animation(fadeOutKeyFrames);

  fadeOut.onfinish = () => {
    tab.innerHTML = '';
    callback();
  }

  fadeOut.play();
}

//open modal tab

function createModalCard(item) {
  const productCard = document.createElement('div');
  productCard.innerHTML = getProductCardMarkup(item);
  menuItemsContainer.appendChild(productCard);
}