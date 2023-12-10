const container = document.querySelector('.coffee-slider__container');
const track = document.querySelector('.coffee-slider__items');
const btnPrev = document.getElementById('coffee-slider-prev');
const btnNext = document.getElementById('coffee-slider-next');

//progress bar
const progressBars = document.querySelectorAll('.progress-bar__line');
const progressBarsActive = document.querySelectorAll('.progress-bar__line_active');

const itemsCount = document.querySelectorAll('.coffee-slider__item').length;
const itemWidth = 100 / itemsCount;

let slideIndex = 0;

const INTERVAL = 7000;
const PROGRESS_BAR_INTERVAL = 500;
let progress = 0;

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

  clearProgress();
  clearInterval(scrollInterval);
  progress = 0;
  value = 0;
  let position = slideIndex * itemWidth;
  track.style.transform = `translateX(-${position}%)`;
  startInterval();
}

function animateProgressBar(slide) {
  progress += PROGRESS_BAR_INTERVAL;
  value = (progress / INTERVAL) * 100;

  if (progress > INTERVAL) {
    moveItems('right');
  }
  progressBarsActive[slide].style.width = `${value}%`
}

function clearProgress() {
  progressBarsActive.forEach((el) => {
    el.style.width = `0%`
  })
}

let isScrollPaused = false;

function startInterval() {
  scrollInterval = setInterval(() => {
    if (!isScrollPaused) {
      animateProgressBar(slideIndex);
    }
  }, PROGRESS_BAR_INTERVAL)
}

container.addEventListener('mouseenter', () => {
  console.log('mouse in');
  isScrollPaused = true;
})

container.addEventListener('mouseleave', () => {
  console.log('mouse out');
  isScrollPaused = false;
})

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    moveItems('right');
  }
  if (e.key === 'ArrowLeft') {
    moveItems('left');
  }
})

let startX = 0;
let endX = 0;
const TOUCH_THRESHOLD = 100;

container.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isScrollPaused = true;
  startX = e.touches[0].clientX;
})

container.addEventListener('touchend', (e) => {
  e.preventDefault();
  isScrollPaused = false;
  endX = e.changedTouches[0].clientX;

  const diff = startX - endX;
  if (Math.abs(diff) > TOUCH_THRESHOLD) {
    if (diff > 0) {
      moveItems('right');
    } else {
      moveItems('left');
    }
  }
})

startInterval();