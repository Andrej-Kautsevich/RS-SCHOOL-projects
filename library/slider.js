let position = 0;

const slidesPerView = 3;
const spaceBetweenSlides = 25; //gap between slides
const container = document.querySelector('.slider__container');
const track = document.querySelector('.slider__items');
const btnNext = document.querySelector('.slider__btn-next');
const items = document.querySelectorAll('.slider__item');
const itemsCount = document.querySelectorAll('.slider__items').length;

//set the width of each slide depending on the size of the container
const setItemWidth = () => {
  let itemWidth = (container.clientWidth - (spaceBetweenSlides * (slidesPerView - 1))) / slidesPerView;
  items.forEach((item) => {
    item.style.minWidth = `${itemWidth}px`;
  })
  track.style.width = itemWidth * itemsCount + (spaceBetweenSlides * (itemsCount - 1)) + 'px';
}

setItemWidth();

const paginationButtons = document.querySelectorAll('.slider__pagination-button');

//switching slides by pagination buttons
paginationButtons.forEach((elements, index) => {
  elements.addEventListener('click', function () {
    position = (document.querySelector('.slider__item').offsetWidth + spaceBetweenSlides) * index;
    setPosition();
  });
});


const setPosition = () => {
  track.style.transform = `translateX(-${position}px)`
}







window.addEventListener('resize', setItemWidth);
