let position = 0;
let slidesPerView;
let itemWidth;
let slideIndex = 0;

//TODO: get gap from css property
const spaceBetweenSlides = 25; //gap between slides

const container = document.querySelector('.slider__container');
const track = document.querySelector('.slider__items');
const btnNext = document.querySelector('.slider__btn-next');
const items = document.querySelectorAll('.slider__item');
const itemsCount = document.querySelectorAll('.slider__item').length;
const paginationButtons = document.querySelectorAll('.slider__pagination-button');
const btnLeft = document.querySelector('.slider__btn-prev');
const btnRight = document.querySelector('.slider__btn-next');


//number of slides per view
function updateSlidesPerView() {
  if (window.matchMedia('(max-width: 1024px)').matches) {
    slidesPerView = 1;
  } else if (window.matchMedia('(max-width: 1260px)').matches) {
    slidesPerView = 2;
  } else {
    slidesPerView = 3;
  }
}


//set the width of each slide depending on the size of the container
const setItemWidth = () => {
  itemWidth = (container.clientWidth - (spaceBetweenSlides * (slidesPerView - 1))) / slidesPerView;
  items.forEach((item) => {
    item.style.minWidth = `${itemWidth}px`;
  })
}


//switching slides by pagination buttons
paginationButtons.forEach((elements, index) => {
  elements.addEventListener('click', function () {
    slideIndex = index;
    position = (document.querySelector('.slider__item').offsetWidth + spaceBetweenSlides) * index;
    setPosition();
    checkBtn();
  });
});

btnLeft.addEventListener('click', () => {
  position -= (document.querySelector('.slider__item').offsetWidth + spaceBetweenSlides);
  slideIndex--;

  setPosition();
  checkBtn();
})

btnRight.addEventListener('click', () => {
  position += (document.querySelector('.slider__item').offsetWidth + spaceBetweenSlides);
  slideIndex++;

  setPosition();
  checkBtn();
})

const setPosition = () => {
  track.style.transform = `translateX(-${position}px)`;
}

//disable Buttons
const checkBtn = () => {
  btnLeft.disabled = position === 0;
  btnRight.disabled = position >= ((itemsCount - 1) * itemWidth);
  paginationButtons[slideIndex].checked = true;
  console.log(slideIndex);
  console.log(`position ${position}`);
}

checkBtn();

window.addEventListener('DOMContentLoaded', updateSlidesPerView,);
window.addEventListener('DOMContentLoaded', setItemWidth);

window.addEventListener('resize', updateSlidesPerView);
window.addEventListener('resize', setItemWidth);
