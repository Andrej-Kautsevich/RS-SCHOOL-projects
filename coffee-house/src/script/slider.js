const container = document.querySelector('.coffee-slider__container');
const track = document.querySelector('.coffee-slider__items');
const btnPrev = document.getElementById('coffee-slider-prev');
const btnNext = document.getElementById('coffee-slider-next');

const itemsCount = document.querySelectorAll('.coffee-slider__item').length;
const itemWidth = 100 / itemsCount;

let slideIndex = 0;

btnNext.addEventListener('click', () => {
  moveItems('right')
});
btnPrev.addEventListener('click', () => {
  moveItems('left')
});

function moveItems(direction) {
  if (direction === 'right') { slideIndex += 1; };
  if (direction === 'left') { slideIndex -= 1; };

  if (slideIndex >= itemsCount) { slideIndex = 0 };
  if (slideIndex < 0) { slideIndex = itemsCount - 1 };

  let position = slideIndex * itemWidth;
  track.style.transform = `translateX(-${position}%)`;
}

let isScrollPaused = false;
window.setInterval(() => {
  if (!isScrollPaused) {
    moveItems('right')
  }
}, 3000)

container.addEventListener('mouseenter', () => {
  console.log('mouse in');
  isScrollPaused = true;
})

container.addEventListener('mouseleave', () => {
  console.log('mouse out');
  isScrollPaused = false;
})