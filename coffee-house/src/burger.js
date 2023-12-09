const burgerBtn = document.querySelector('.header__hamburger-btn');
const menuBurger = document.querySelector('.header__navigation');

burgerBtn.addEventListener('click', () => {
  burgerBtn.classList.toggle('hamburger-btn_active');
  menuBurger.classList.toggle('header__navigation_open');

  // remove vertical scroll bar when noscroll applied
  document.body.classList.toggle('noscroll')
  if (document.body.classList.contains('noscroll')) {
    const marginRight = calcScroll() + 'px';
    document.body.style.marginRight = marginRight;
  } else {
    document.body.style.marginRight = '0px';
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