const menuBtn = document.querySelector('.header__menu-btn');
const menuBurger = document.querySelector('.header__menu');
const body = document.body;
const userBtn = document.querySelector('.header__menu-icon');
const dropMenu = document.querySelector('.drop-menu');
const modals = document.querySelectorAll('.modal__content')

//open burger menu
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('header__menu-btn_active');
  menuBurger.classList.toggle('header__menu_open');
  body.classList.toggle('noscroll')
  // remove vertical scroll bar when noscroll applied
  if (body.classList.contains('noscroll')) {
    const marginRight = calcScroll() + 'px';
    body.style.marginRight = marginRight;
  } else {
    body.style.marginRight = '0px';
  }
});

//close menu
document.addEventListener('click', (event) => {
  if (
    !menuBtn.contains(event.target) &&
    menuBurger.classList.contains('header__menu_open')
  ) {
    menuBtn.classList.remove('header__menu-btn_active');
    menuBurger.classList.remove('header__menu_open');
    body.classList.remove('noscroll');
    body.style.marginRight = '0px';
  }
  if (
    !userBtn.contains(event.target) &&
    dropMenu.classList.contains('drop-menu_open')
  ) {
    dropMenu.classList.remove('drop-menu_open');
  }
});

//User drop menu
userBtn.addEventListener('click', () => {
  dropMenu.classList.toggle('drop-menu_open')
});


//Open modal window
const modalBtn = document.querySelectorAll('[data-modal-Btn]');
const modalOverlay = document.querySelector('.modal__overlay');

modalBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.modalBtn;
    const modalActive = document.querySelector('.modal__' + target);
    modalActive.classList.add('modal__active');
    modalOverlay.classList.add('modal__overlay_active');
  })
})

//close modal window
const modalBtnsClose = document.querySelectorAll('.modal__btn-close');

modalBtnsClose.forEach((btn) => {
  btn.addEventListener('click', () => {
    const modalActive = document.querySelector('.modal__active')
    modalActive.classList.remove('modal__active');
    modalOverlay.classList.remove('modal__overlay_active');
  })
})

modalOverlay.addEventListener('click', (e) => {
  console.log(e);
  if (!e.target.classList.contains('modal__content')) {
    const modalActive = document.querySelector('.modal__active')
    modalActive.classList.remove('modal__active');
    modalOverlay.classList.remove('modal__overlay_active');
  }
})







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

