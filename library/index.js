const menuBtn = document.querySelector('.header__menu-btn');
const menuBurger = document.querySelector('.header__menu');

menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('header__menu-btn_active');
  menuBurger.classList.toggle('header__menu_open');
});
