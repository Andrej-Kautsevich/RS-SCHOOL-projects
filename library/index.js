const menuBtn = document.querySelector('.header__menu-btn');
const menuBurger = document.querySelector('.header__menu');
const body = document.body;
const userBtn = document.querySelector('.header__menu-icon');
const dropMenu = document.querySelector('.drop-menu');
const modals = document.querySelectorAll('.modal__content')
const modalOverlay = document.querySelector('.modal__overlay');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const buyForm = document.getElementById('buy-form');
const buyBtn = document.querySelectorAll('.favorites__item-button');

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
  //check valid email input
  const emailInput = formNode.querySelector('[data-user="email"]');
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/.test(emailInput.value)) {
    spanError(emailInput, 'Incorrect email!')
    return false;
  }

  //check valid password input
  const passwordInput = formNode.querySelector('[data-user="password"]')
  if (!/^.{8,}$/.test(passwordInput.value)) {
    spanError(passwordInput, 'Password must contain be at least 8 characters');
    return false;
  }

  //create user
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

  if (localStorage.getItem('user') && userObject['email'] === userRegister['email']) {
    const email = formNode.querySelector('[data-user="email"]')
    spanError(email, 'This user is already registered!')
    return;
  }

  userRegister['isRegistered'] = 'true';
  userRegister['isAuthorized'] = 'true';
  userRegister['cardNumber'] = generateCardNumber();
  userRegister['visits'] = 1;
  userRegister['hasLibraryCard'] = 'false';
  userRegister['booksCount'] = 0;
  userRegister['rentBooks'] = [];
  localStorage.setItem("user", JSON.stringify(userRegister));
  location.reload();
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
})

const userData = localStorage.getItem('user');
const userObject = JSON.parse(userData);

// After registration 

if (localStorage.getItem('user') && userObject['isRegistered'] === 'true' && userObject['isAuthorized'] === 'true') {
  //change profile icon and drop menu
  userBtn.innerHTML = userObject['firstName'][0].toUpperCase() + userObject['lastName'][0].toUpperCase();
  userBtn.classList.add('header__menu-icon_authorized');
  userBtn.setAttribute('title', `${userObject['firstName']} ${userObject['lastName']}`)
  dropMenu.innerHTML = `
    <li class="drop-menu__title">${userObject['cardNumber']}</li>
    <li class="drop-menu__item" data-modal-Btn="profile">My Profile</li>
    <li class="drop-menu__item" data-modal-Btn="logout">Log Out</li>
  `
  dropMenu.classList.add('drop-menu_authorized')

  //change modal profile initials and name
  document.querySelector('.modal__profile-initials').innerHTML = userObject['firstName'][0].toUpperCase() + userObject['lastName'][0].toUpperCase();
  document.querySelector('.modal__profile-name').innerHTML = `${userObject['firstName']} ${userObject['lastName']}`;

  //Library card after login in account
  const cardInfo = document.querySelector('.card__info');
  const cardReaderNameInput = document.getElementById('card-reader-name');
  const cardNumberInput = document.getElementById('card-number');

  cardReaderNameInput.disabled = true;
  cardReaderNameInput.setAttribute('value', `${userObject['firstName']} ${userObject['lastName']}`)

  cardNumberInput.disabled = true;
  cardNumberInput.setAttribute('value', `${userObject['cardNumber']}`);

  document.querySelector('.card__title').textContent = 'Your Library card';
  document.querySelector('.login__title').textContent = 'Visit your profile';
  document.querySelector('.login__text').textContent = 'With a digital library card you get free access to the Library’s wide array of digital resources including e-books, databases, educational resources, and more.';
  document.querySelector('.login__buttons').innerHTML = `
    <button class="button login__button" data-modal-btn="profile">Profile</button>
  `

  cardInfo.innerHTML = `
    <div class="card__info-stats">
      <span>Visits</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 10C13.2614 10 15.5 7.76143 15.5 5C15.5 2.23857 13.2614 0 10.5 0C7.73857 0 5.5 2.23857 5.5 5C5.5 7.76143 7.73857 10 10.5 10ZM17.5711 13.9289C19.4464 15.8043 20.5 18.3478 20.5 21H10.5H0.5C0.5 18.3478 1.55357 15.8043 3.42894 13.9289C5.30429 12.0536 7.84784 11 10.5 11C13.1522 11 15.6957 12.0536 17.5711 13.9289Z" fill="#BB945F"/>
      </svg>
      <span class="profile-visits-number">23</span>
    </div>
    <div class="card__info-stats">
      <span>Bonuses</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
        <path d="M10 0L12.2249 3.31001L15.8779 2.00532L15.8249 6.05634L19.5106 7.25532L17.2 10.5L19.5106 13.7447L15.8249 14.9437L15.8779 18.9947L12.2249 17.69L10 21L7.77508 17.69L4.12215 18.9947L4.17508 14.9437L0.489435 13.7447L2.8 10.5L0.489435 7.25532L4.17508 6.05634L4.12215 2.00532L7.77508 3.31001L10 0Z" fill="#BB945F"/>
      </svg>
      <span class="profile-bonuses-number">0</span>
    </div>
    <div class="card__info-stats">
      <span>Books</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
        <rect width="20" height="21" fill="#BB945F"/>
        <rect x="2" width="1" height="19" fill="#826844"/>
        <rect x="1" width="1" height="21" fill="white"/>
      </svg>
      <span class="profile-books-number">2</span>
    </div>
  `
}

//User logout
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
  if (localStorage.getItem('user')) {
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
      localStorage.setItem('user', JSON.stringify(userObject));
      location.reload();
    }
    else {
      //wrong email or password
      if (email.value !== localEmail && email.value !== localCardNumber) {
        spanError(email, 'User not found!')
      };
      //wrong password
      if (email.value === localEmail && password.value !== localPassword) {
        spanError(password, 'wrong password')
      };
      if (email.value === localCardNumber && password.value !== localPassword) {
        spanError(password, 'wrong password')
      };
    }
  }
}

//Show error message
function spanError(input, message) {
  const span = document.createElement('span');

  span.classList.add('modal__input-tooltip');
  span.textContent = message;

  input.parentNode.appendChild(span);
  setTimeout(() => {
    span.remove()
  }, 1500);
}

//Update profile statistics
function updateProfileStatistics() {
  if (localStorage.getItem('user') && userObject['isRegistered'] === 'true' && userObject['isAuthorized'] === 'true') {
    document.querySelectorAll('.profile-visits-number').forEach((element) => {
      element.innerHTML = userObject['visits'];
    })
    document.querySelectorAll('.profile-books-number').forEach((element) => {
      element.innerHTML = userObject['booksCount'];
    })

    const bookList = document.querySelector('.modal__profile-rented-books-list');
    if (userObject['rentBooks'].length !== 0) {

      //remove placeholder
      bookList.firstElementChild.remove();

      for (let i = 0; i < userObject['rentBooks'].length; i++) {
        const item = document.createElement('li');;
        item.textContent = userObject['rentBooks'][i];
        item.classList.add('modal__profile-rented-books-item');
        bookList.append(item);
      }
    }
  }
}

//buy button
buyBtn.forEach((btn) => {
  btn.addEventListener('click', function (event) {

    //not authorized
    if (!localStorage.getItem('user') || userObject['isAuthorized'] === 'false') {
      modalOverlay.classList.add('modal__overlay_active');
      document.querySelector('.modal__login').classList.add('modal__active');
    };

    //is authorized
    if (localStorage.getItem('user') && userObject['isAuthorized'] === 'true' && userObject['hasLibraryCard'] === 'false') {
      //open buyCard modal
      modalOverlay.classList.add('modal__overlay_active');
      document.querySelector('.modal__buy').classList.add('modal__active');
      buyBook(event);
      btn.disabled = 'true';
      btn.innerHTML = 'Own';
    }

    //is authorized and have library card
    if (localStorage.getItem('user') && userObject['isAuthorized'] === 'true' && userObject['hasLibraryCard'] === 'true') {
      buyBook(event);

      //disable button
      btn.disabled = 'true';
      btn.innerHTML = 'Own';
    }
  })
})

//Buy book when have library card
function buyBook(e) {
  const selectedBook = e.target.closest('.favorites__item');
  const bookName = selectedBook.querySelector('.favorites__item-name').textContent;
  const bookAuthor = selectedBook.querySelector('.favorites__item-author').textContent;

  const book = [];

  book.push(bookName, bookAuthor);

  userObject['rentBooks'].push(book);
  userObject['booksCount'] = userObject['booksCount'] + 1;
  localStorage.setItem('user', JSON.stringify(userObject));

  updateProfileStatistics();
}

//Disable buttons for rented books
function checkRentedBook() {
  const rentedBooksByName = [];
  if (localStorage.getItem('user')) {
    userObject['rentBooks'].forEach((element) => {
      for (let i = 0; i < element.length; i++) {
        if (i % 2 === 0) {
          rentedBooksByName.push(element[i]);
        }
      }
    })
  }
  buyBtn.forEach((btn) => {
    const book = btn.closest('.favorites__item');
    const bookName = book.querySelector('.favorites__item-name').textContent;
    if (rentedBooksByName.includes(bookName)) {
      btn.disabled = 'true';
      btn.innerHTML = 'Own';
    }
  })
}

//handle buy library card form
buyForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (validateBuyForm(buyForm)) {
    userObject['hasLibraryCard'] = 'true';
    localStorage.setItem("user", JSON.stringify(userObject));
    modalOverlay.classList.remove('modal__overlay_active');
    document.querySelector('.modal__buy').classList.remove('modal__active');
  }
})

function validateBuyForm(e) {
  const cardNumberInput = document.querySelector('[data-buy="card-number"]');
  const cardMonthInput = document.querySelector('[data-buy="card-month"]');
  const cardYearInput = document.querySelector('[data-buy="card-year"]');
  const cardCvvInput = document.querySelector('[data-buy="card-cvv"]')

  const cardNumber = cardNumberInput.value.replace(/\s+/g, '');
  const cardMonth = cardMonthInput.value;
  const cardYear = cardYearInput.value;
  const cardCvv = cardCvvInput.value;

  //validate bank card number
  if (!/^\d{16}$/.test(cardNumber)) {
    spanError(cardNumberInput, 'Must contain 16 digits')
    return false;
  }

  //validate bank card exp
  if (!/^\d{2}$/.test(cardMonth) || !/^\d{2}$/.test(cardYear)) {
    return false;
  }

  //validate bank card CVV
  if (!/^\d{3}$/.test(cardCvv)) {
    spanError(cardCvvInput, 'CVC must contain 3 digits')
    return false;
  }

  return true;
}

//formate bank card number value
const bankCardNumberInput = document.querySelector('[data-buy="card-number"]');

bankCardNumberInput.addEventListener('input', (event) => {
  let inputValue = event.target.value.replace(/\s/g, '').replace(/[^\d]/g, '');
  let blocks = inputValue.match(/\d{1,4}/g) || [];
  let formattedValue = blocks.join(' ');
  event.target.value = formattedValue;
});

//disable buy button when have empty inputs
const buyInputs = buyForm.querySelectorAll('[data-buy]');
const buySubmitBtn = buyForm.querySelector('[type="submit"]');

function updateBuySubmitBtnState() {
  const areInputsEmpty = Array.from(buyInputs).some(input => input.value.trim() === '');
  buySubmitBtn.disabled = areInputsEmpty;
}

buyInputs.forEach((input) => {
  input.addEventListener('input', updateBuySubmitBtnState);
})

//Open modal window
const modalBtns = document.querySelectorAll('[data-modal-Btn]'); //Buttons in modal window

modalBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (document.querySelector('.modal__active')) {
      document.querySelector('.modal__active').classList.remove('modal__active')
    };
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

//update profile after login
document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('user') && userObject['isAuthorized'] === 'true') {
    updateProfileStatistics();
    checkRentedBook();
  }
});

//check library card
const checkCardForm = document.querySelector('.card__find-form');

checkCardForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const cardReaderNameInput = document.getElementById('card-reader-name');
  const cardNumberInput = document.getElementById('card-number');
  const readerName = `${userObject['firstName']} ${userObject['lastName']}`

  if (cardReaderNameInput.value == readerName && cardNumberInput.value == userObject['cardNumber']) {
    const cardInfo = document.querySelector('.card__info');
    cardInfo.innerHTML = `
      <div class="card__info-stats">
        <span>Visits</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 10C13.2614 10 15.5 7.76143 15.5 5C15.5 2.23857 13.2614 0 10.5 0C7.73857 0 5.5 2.23857 5.5 5C5.5 7.76143 7.73857 10 10.5 10ZM17.5711 13.9289C19.4464 15.8043 20.5 18.3478 20.5 21H10.5H0.5C0.5 18.3478 1.55357 15.8043 3.42894 13.9289C5.30429 12.0536 7.84784 11 10.5 11C13.1522 11 15.6957 12.0536 17.5711 13.9289Z" fill="#BB945F"/>
        </svg>
        <span class="profile-visits-number">23</span>
      </div>
      <div class="card__info-stats">
        <span>Bonuses</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
          <path d="M10 0L12.2249 3.31001L15.8779 2.00532L15.8249 6.05634L19.5106 7.25532L17.2 10.5L19.5106 13.7447L15.8249 14.9437L15.8779 18.9947L12.2249 17.69L10 21L7.77508 17.69L4.12215 18.9947L4.17508 14.9437L0.489435 13.7447L2.8 10.5L0.489435 7.25532L4.17508 6.05634L4.12215 2.00532L7.77508 3.31001L10 0Z" fill="#BB945F"/>
        </svg>
        <span class="profile-bonuses-number">0</span>
      </div>
      <div class="card__info-stats">
        <span>Books</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
          <rect width="20" height="21" fill="#BB945F"/>
          <rect x="2" width="1" height="19" fill="#826844"/>
          <rect x="1" width="1" height="21" fill="white"/>
        </svg>
        <span class="profile-books-number">2</span>
      </div>
     `
    setTimeout(function () {
      cardInfo.innerHTML = `<button class="button card__button" type="submit">Check the card</button>`
      cardReaderNameInput.value = "";
      cardNumberInput.value = "";
    }, 10000)
  } else {
    spanError(cardReaderNameInput, 'The user was not found. Please enter first name then last name')
  }
})