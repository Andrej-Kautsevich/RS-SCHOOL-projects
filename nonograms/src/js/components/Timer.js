export default class Timer {
  constructor() {
    this.time = 0;
    this.timer = this.createTimer();
  }

  createTimer() {
    const timer = document.createElement('div');
    timer.classList.add('timer');

    const timeString = `${Math.floor(this.time / 60)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;

    timer.innerHTML = timeString;

    return timer;
  }

  startTimer() {
    // eslint-disable-next-line no-unused-vars
    const timeInterval = setInterval(() => {
      this.stepTimer();
    }, 1000);
  }

  stepTimer() {
    const timer = document.querySelector('.timer');

    this.time++;
    const timeString = `${Math.floor(this.time / 60)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;
    timer.innerHTML = timeString;
  }

  getTimer() {
    return this.timer;
  }
}
