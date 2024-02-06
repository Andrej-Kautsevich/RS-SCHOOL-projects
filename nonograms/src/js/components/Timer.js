export default class Timer {
  constructor() {
    this.time = 0;
    this.timer = this.createTimer();
    this.isTimerActive = false;
    this.timeInterval = '';
  }

  createTimer() {
    const timer = document.createElement('div');
    timer.classList.add('timer');

    const timeString = `${`0${Math.floor(this.time / 60)}`.slice(-2)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;

    timer.innerHTML = timeString;

    return timer;
  }

  startTimer() {
    if (!this.isTimerActive) {
      this.isTimerActive = true;
      this.timeInterval = setInterval(() => {
        this.stepTimer();
      }, 1000);
    }
  }

  stepTimer() {
    const timer = document.querySelector('.timer');

    this.time++;
    const timeString = `${`0${Math.floor(this.time / 60)}`.slice(-2)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;
    timer.innerHTML = timeString;
  }

  stopTimer() {
    this.isTimerActive = false;
    clearInterval(this.timeInterval);
  }

  setTime(time) {
    this.time = time;

    const timer = document.querySelector('.timer');

    const timeString = `${`0${Math.floor(this.time / 60)}`.slice(-2)} : ${`0${Math.floor(this.time % 60)}`.slice(-2)}`;

    timer.innerHTML = timeString;
  }

  getTime() {
    return this.time;
  }

  getTimer() {
    return this.timer;
  }
}
