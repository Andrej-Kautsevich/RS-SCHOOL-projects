import getProductMarkup from './menu-markup.js';
import getModalMarkup from './modal-markup.js';

const res = await fetch('src/products.json');
const data = await res.json();

const menuItemsContainer = document.querySelector('.menu__items');
const menuAddBtn = document.querySelector('.menu__add-button');
const modalContent = document.querySelector('.modal__content');
const modalOverlay = document.querySelector('.modal__overlay');

const DESKTOP_WIDTH = 1024;
const TRANSITION_DURATION = 500;

let currentItems = [];
let currentCategory = 'coffee';
let isDesktop = true;

function getItems(category) {
  currentItems = data.filter((item) => item.category === category);
}

getItems(currentCategory);

function createItem(item, index) {
  const product = document.createElement('div');
  product.innerHTML = getProductMarkup(currentCategory, item, index);
  menuItemsContainer.appendChild(product);
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
    if (tabBtn.classList.contains('tabs-button_active')) { return }
    currentCategory = e.target.closest('[data-category]').dataset['category'];

    tabsBtn.forEach((tabBtn) => { tabBtn.classList.remove('tabs-button_active') });
    tabBtn.classList.add('tabs-button_active');

    //remove current items
    fadeOutAnimation(menuItemsContainer, () => {
      menuItemsContainer.innerHTML = '';
      getItems(currentCategory);
      setVisibleItemsCount();
      renderItems(0, visibleItemsCount);
    });
  })
})

// Fade out tab animation
const fadeOutAnimation = (element, callback) => {
  const fadeOutKeyFrames = new KeyframeEffect(
    element,
    [
      { opacity: 1 },
      { opacity: 0 },
    ],
    {
      duration: 500,
      easing: 'ease-out',
    },
  );
  const fadeOut = new Animation(fadeOutKeyFrames);

  fadeOut.onfinish = () => {
    if (callback) callback();
  }

  fadeOut.play();
}

//open modal tab
let isModalOpen = false;

function createModalCard(item, index) {
  const productCard = document.createElement('div');
  productCard.innerHTML = getModalMarkup(item, index);
  modalContent.appendChild(productCard);
  modalContent.querySelector('.menu__modal-close').addEventListener('click', closeModal);
  modalContent.classList.add('modal__content_active');

  const sizeBtns = productCard.querySelectorAll('[data-size]');
  const additivesBtns = productCard.querySelectorAll('[data-additives]');

  let price = parseFloat(item.price);
  let sizePrice = parseFloat(Object.values(item.sizes)[0]['add-price']);

  sizeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const sizeIndex = btn.getAttribute('data-size');
      sizePrice = parseFloat(item.sizes[sizeIndex]['add-price']);
      updatePrice(price, sizePrice);

      sizeBtns.forEach((btn) => {
        btn.classList.remove('tabs-button_active');
      })
      btn.classList.add('tabs-button_active');
    })
  })

  additivesBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const additivesIndex = btn.getAttribute('data-additives');
      if (btn.classList.contains('tabs-button_active')) {
        price -= parseFloat(item.additives[additivesIndex]['add-price']);
        btn.classList.remove('tabs-button_active')
      } else {
        price += parseFloat(item.additives[additivesIndex]['add-price']);
        btn.classList.add('tabs-button_active');
      }
      updatePrice(price, sizePrice);
    })
  })
}

function updatePrice(price, sizePrice) {
  let total = price + sizePrice;
  const priceText = modalContent.querySelector('.card__total-price');
  priceText.textContent = `$${total.toFixed(2)}`
}

document.addEventListener('click', (e) => {
  const product = e.target.closest('.menu__item')

  //open modal
  if (product && !isModalOpen) {
    const itemIndex = Number(product.getAttribute('data-item-index'))
    const item = currentItems[itemIndex];
    createModalCard(item, itemIndex);
    modalOverlay.classList.add('modal__overlay_visible');
    isModalOpen = true;
    handleScroll();
  }
})

//close modal
modalOverlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal__overlay') && isModalOpen) {
    closeModal();
  }
})

function closeModal() {
  modalContent.classList.remove('modal__content_active');

  fadeOutAnimation(modalContent, () => {
    modalOverlay.classList.remove('modal__overlay_visible');
    modalContent.innerHTML = '';
    handleScroll();
  })

  fadeOutAnimation(modalOverlay)
  isModalOpen = false;
}

// remove vertical scroll bar when noscroll applied
function handleScroll() {
  document.body.classList.toggle('noscroll')
  if (document.body.classList.contains('noscroll')) {
    const marginRight = calcScroll() + 'px';
    document.body.style.marginRight = marginRight;
  } else {
    document.body.style.marginRight = '0px';
  }
}

//calc width of the vertical scroll bar
function calcScroll() {
  let div = document.createElement('div');

  div.style.width = '50px';
  div.style.height = '50px';
  div.style.overflowY = 'scroll';
  div.style.visibility = 'hidden';

  document.body.appendChild(div);
  let scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();

  return scrollWidth;
}