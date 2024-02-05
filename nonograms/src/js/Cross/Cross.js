import { countRowHints, countColumnHints } from './CrossHints';
import templates from '../templates';

export default class Cross {
  constructor(/* template */ timer) {
    if (localStorage.getItem('scores')) {
      this.lastScores = JSON.parse(localStorage.getItem('scores'));
    } else this.lastScores = [];
    this.timer = timer;
    this.isTimerActive = false;
    // this.template = template; // Шаблон области
    this.template = null;
    this.cross = null; // Создание области
  }

  getTemplate() {
    const currentTemplateID = localStorage.getItem('templateID');
    let templateID;

    do {
      templateID = JSON.stringify(Math.floor(Math.random() * templates.length));
    } while (currentTemplateID === templateID);

    this.template = templates[templateID].template;
    localStorage.setItem('templateID', templateID);

    return this.template;
  }

  createCross() {
    const cross = document.querySelector('.cross');

    const crossArea = this.createArea();
    const crossTop = this.createTopHints();
    const crossBottom = document.createElement('div');
    crossBottom.className = 'cross__bottom';

    const crossLeft = this.createLeftHint();
    crossBottom.append(crossLeft, crossArea);

    cross.append(crossTop, crossBottom);

    return cross;
  }

  createArea() {
    // this.template = this.getTemplate();
    const area = document.createElement('div');
    area.className = 'cross__area';

    for (let i = 0; i < this.template.length; i++) {
      const row = document.createElement('div');
      row.className = 'cross__row';

      for (let j = 0; j < this.template[i].length; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__ceil';
        this.bindEvents(elem);
        row.appendChild(elem);
      }

      area.appendChild(row);
    }

    return area;
  }

  createLeftHint() {
    const crossLeft = document.createElement('div');
    crossLeft.className = 'cross__left';

    const hints = countRowHints(this.template);
    const maxCeilsCount = Math.max(...hints.map((arr) => arr.length));
    for (let i = 0; i < this.template.length; i++) {
      const row = document.createElement('div');
      row.className = 'cross__row cross__row_left';

      for (let j = 0; j < maxCeilsCount; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__left-ceil';

        // add all hints from right to left, then fill with empty ceils
        if (hints[i][j]) {
          elem.textContent = hints[i][j];
          row.append(elem);
        } else row.prepend(elem);
      }

      crossLeft.appendChild(row);
    }
    return crossLeft;
  }

  createTopHints() {
    const crossTop = document.createElement('div');
    crossTop.className = 'cross__top';
    const hints = countColumnHints(this.template);
    const maxCeilsCount = Math.max(...hints.map((arr) => arr.length));

    for (let i = 0; i < hints.length; i++) {
      const column = document.createElement('div');
      column.className = 'cross__top-row';

      for (let j = 0; j < maxCeilsCount; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__top-ceil';

        // add all hints from bottom to top, then fill with empty ceils
        if (hints[i][j]) {
          elem.textContent = hints[i][j];
          column.append(elem);
        } else column.prepend(elem);
      }

      crossTop.appendChild(column);
    }
    return crossTop;
  }

  mouseDownEvent(event, elem) {
    if (!this.isTimerActive) {
      this.timer.startTimer();
      this.isTimerActive = true;
    }

    switch (event.button) {
      case 0:
        elem.classList.remove('cross__ceil_cross');
        elem.classList.toggle('cross__ceil_active');
        break;

      case 2:
        elem.classList.remove('cross__ceil_active');
        elem.classList.toggle('cross__ceil_cross');
        break;
      default:
    }

    if (this.isGameFinished()) {
      this.finishGame('win');
    }
  }

  bindEvents(ceil) {
    ceil.addEventListener('mousedown', (event) => this.mouseDownEvent(event, ceil), false);
    ceil.addEventListener('contextmenu', (event) => event.preventDefault());
  }

  isGameFinished() {
    const crossArea = this.cross.querySelector('.cross__area');
    const rows = crossArea.querySelectorAll('.cross__row');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('.cross__ceil');
      for (let j = 0; j < cells.length; j++) {
        const isActive = cells[j].classList.contains('cross__ceil_active');
        // Check if ceil match template
        if ((isActive && this.template[i][j] !== 1) || (!isActive && this.template[i][j] !== 0)) {
          return false;
        }
      }
    }
    return true; // if all ceils match template
  }

  resetCross() {
    const crossArea = this.cross.querySelector('.cross__area');
    const crossAreaCeils = crossArea.querySelectorAll('.cross__ceil');
    crossAreaCeils.forEach((ceil) => {
      ceil.classList.remove('cross__ceil_active', 'cross__ceil_cross');
    });
    this.timer.setTime(0);
  }

  showSolution() {
    this.resetCross();

    const crossArea = this.cross.querySelector('.cross__area');
    const crossAreaCeils = (crossArea.querySelectorAll('.cross__ceil'));

    const templateArray = this.template.flat();
    for (let i = 0; i < crossAreaCeils.length; i++) {
      const element = crossAreaCeils[i];
      if (templateArray[i] === 1) {
        element.classList.add('cross__ceil_active');
      }
    }
    this.finishGame();
  }

  finishGame(win) {
    if (win === 'win') {
      const time = this.timer.getTime();
      const currentTemplateID = localStorage.getItem('templateID');

      const result = {
        id: currentTemplateID,
        time,
      };

      if (this.lastScores.length > 5) {
        this.lastScores.shift();
      }
      this.lastScores.push(result);
      localStorage.setItem('scores', JSON.stringify(this.lastScores));
    }

    this.timer.stopTimer();
    this.isTimerActive = false;
    console.log('Game over!');
  }

  startNewGame(template) {
    this.template = template;
    console.log('Start new game');
    this.timer.stopTimer();
    this.isTimerActive = false;
    this.timer.setTime(0);
    const crossNode = this.cross;
    crossNode.innerHTML = '';
    this.cross = this.createCross(); // Создание области
  }

  saveGame() {
    const currentCrossHTML = this.cross.innerHTML;
    localStorage.setItem('saved game', currentCrossHTML);

    const currentTemplateID = localStorage.getItem('templateID');
    localStorage.setItem('saved template', currentTemplateID);

    const currentTime = this.timer.getTime();
    localStorage.setItem('saved time', currentTime);

    const continueBtn = document.querySelector('#continue-btn');
    continueBtn.disabled = false;
  }

  continueGame() {
    const savedCrossHTML = localStorage.getItem('saved game');

    if (savedCrossHTML) {
      this.cross.innerHTML = savedCrossHTML;
      const ceils = this.cross.querySelectorAll('.cross__ceil');
      ceils.forEach((ceil) => this.bindEvents(ceil));
      this.timer.setTime(localStorage.getItem('saved time'));
    }
  }

  getLastScores() {
    return this.lastScores;
  }

  getCross() {
    const cross = document.createElement('div');
    cross.className = 'cross';
    this.cross = cross;

    return this.cross;
  }
}
