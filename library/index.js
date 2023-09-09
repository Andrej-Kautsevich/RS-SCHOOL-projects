const menuBtn = document.querySelector('.header__menu-btn');
const menuBurger = document.querySelector('.header__menu');
const body = document.body;
const userBtn = document.querySelector('.header__menu-icon');
const dropMenu = document.querySelector('.drop-menu');
const modals = document.querySelectorAll('.modal__content')
const modalOverlay = document.querySelector('.modal__overlay');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');


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

//User registration
function serializeRegistrationForm(formNode) {
  const { elements } = formNode;

  const userArray = Array.from(elements)
    .filter((item) => !!item.dataset.user)
    .map((element) => {
      const data = element.dataset.user;
      const { value } = element;
      return { data, value };
    })

  const userRegister = userArray.reduce((obj, item) => {
    obj[item.data] = item.value;
    return obj;
  }, {});

  userRegister['isRegistered'] = 'true';
  userRegister['isAuthorized'] = 'true';
  userRegister['cardNumber'] = generateCardNumber();
  userRegister['visits'] = 1;
  userRegister['booksNumber'] = 0;
  localStorage.setItem("user", JSON.stringify(userRegister));
}

function generateCardNumber() {
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += Math.floor(Math.random() * 16).toString(16).toUpperCase();
  }
  return result;
}

//Handle registration submit button
registerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  serializeRegistrationForm(registerForm);
  location.reload();
})

const userData = localStorage.getItem('user');
const userObject = JSON.parse(userData);

// After registration 

//change profile icon and drop menu
if (userObject['isRegistered'] === 'true' && userObject['isAuthorized'] === 'true') {
  userBtn.innerHTML = userObject['firstName'][0].toUpperCase() + userObject['lastName'][0].toUpperCase();
  userBtn.classList.add('header__menu-icon_authorized');
  userBtn.setAttribute('title', `${userObject['firstName']} ${userObject['lastName']}`)
  dropMenu.innerHTML = `
    <li class="drop-menu__title">${userObject['cardNumber']}</li>
    <li class="drop-menu__item" data-modal-Btn="profile">My Profile</li>
    <li class="drop-menu__item" data-modal-Btn="logout">Log Out</li>
  `
  dropMenu.classList.add('drop-menu_authorized')
}

//Logout
const logoutBtns = document.querySelectorAll('[data-modal-btn="logout"]');

logoutBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    userObject['isAuthorized'] = 'false';
    localStorage.setItem("user", JSON.stringify(userObject));
    location.reload();
  })
})

//User login
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  checkLoginForm(loginForm);
})

function checkLoginForm(formNode) {

  const email = formNode.querySelector('[data-user="userLogin"]')
  const password = formNode.querySelector('[data-user="password"]')

  const localEmail = userObject['email'];
  const localCardNumber = userObject['cardNumber'];
  const localPassword = userObject['password'];

  //Check login and password
  if ((email.value === localEmail && password.value === localPassword) ||
    (email.value === localCardNumber && password.value === localPassword)
  ) {
    userObject['isAuthorized'] = 'true';
    userObject['visits'] = userObject['visits'] + 1;
    localStorage.setItem("user", JSON.stringify(userObject));
    location.reload();
  } else {
    //user is not exist
    // console.log('not match!');
  }
}

//Update profile statistics
if (userObject['isRegistered'] === 'true' && userObject['isAuthorized'] === 'true') {
  document.querySelector('.profile-visits-number').innerHTML = userObject['visits'];
  document.querySelector('.profile-books-number').innerHTML = userObject['booksNumber'];
}







//Open modal window
const modalBtns = document.querySelectorAll('[data-modal-Btn]'); //Buttons in modal window

modalBtns.forEach((btn) => {
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
  if (e.target.classList.contains('modal__overlay')) {
    const modalActive = document.querySelector('.modal__active')
    modalActive.classList.remove('modal__active');
    modalOverlay.classList.remove('modal__overlay_active');
  }
})






//Copy card number
const copyTextBtn = document.querySelector('.profile-card-number__copy-button');
const textToCopy = document.querySelector('.profile-card-number');
const tooltip = document.querySelector('.profile-card-number_tooltip');

copyTextBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(textToCopy.textContent)
    .then(() => {
      tooltip.classList.toggle('visible');
      setTimeout(() => {
        tooltip.classList.toggle('visible')
      }, 1500);
    })
});

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

