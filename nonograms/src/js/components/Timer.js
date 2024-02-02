export default class Timer {
  constructor() {
    this.time = 0;
    this.timer = this.createTimer();
    this.timeInterval = '';
  }

  createTimer() {
    const timer = document.createElement('div');
    timer.classList.add('timer');

    const timeString = `${Math.floor(this.time / 60)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;

    timer.innerHTML = timeString;

    return timer;
  }

  startTimer() {
    this.timeInterval = setInterval(() => {
      this.stepTimer();
    }, 1000);
  }

  stepTimer() {
    const timer = document.querySelector('.timer');

    this.time++;
    const timeString = `${Math.floor(this.time / 60)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;
    timer.innerHTML = timeString;
  }

  stopTimer() {
    clearInterval(this.timeInterval);
  }

  setTime(time) {
    this.time = time;

    const timer = document.querySelector('.timer');

    const timeString = `${Math.floor(this.time / 60)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;

    timer.innerHTML = timeString;
  }

  getTime() {
    return this.time;
  }

  getTimer() {
    return this.timer;
  }
}
