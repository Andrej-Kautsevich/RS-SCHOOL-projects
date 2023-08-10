console.log('Вёрстка соответствует макету. Ширина экрана 768px +26\nНи на одном из разрешений до 640px включ11☺☺ительно не появляется горизонтальная полоса прокрутки. Весь контент страницы при этом сохраняется: не обрезается и не удаляется +12\nНа ширине экрана 768рх реализовано адаптивное меню +12\n')


const menuBtn = document.querySelector('.header__menu-btn');
const menuBurger = document.querySelector('.header__menu');
const body = document.body;

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
});


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