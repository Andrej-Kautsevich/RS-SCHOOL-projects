import WinModal from '../layout/WinModal';
import { countRowHints, countColumnHints } from './CrossHints';
import nonograms from '../nonograms';

import leftClickSound from '../../assets/left-click.mp3';
import rightClickSound from '../../assets/right-click.mp3';
import gongSound from '../../assets/gong.mp3';

export default class Cross {
  constructor(/* template */ timer) {
    if (localStorage.getItem('scores')) {
      this.lastScores = JSON.parse(localStorage.getItem('scores'));
    } else this.lastScores = [];
    this.timer = timer;
    // this.template = template; // Шаблон области
    this.nonogram = null;
    this.cross = null; // Создание области
    this.winModal = new WinModal();
    this.leftClickSound = new Audio(leftClickSound);
    this.rightClickSound = new Audio(rightClickSound);
    this.gongSound = new Audio(gongSound);
    this.hasSound = true;
    this.mouseIsDown = false;
    this.ceilState = null; // clicked ceil state
  }

  /*   template() {
      const templateArray = [];
      const area = document.querySelector('.cross__area');
      const areaRows = area.querySelectorAll('.cross__row');
      areaRows.forEach((row) => {
        const array = [];
        const ceils = row.querySelectorAll('.cross__ceil');
        for (let i = 0; i < ceils.length; i++) {
          if (ceils[i].classList.contains('cross__ceil_active')) {
            array.push(1);
          } else array.push(0);
        }
        templateArray.push(array);
      });
      console.log(templateArray);
    }
   */
  getTemplate() {
    const currentNonogramID = localStorage.getItem('nonogramID');
    let nonogramID;

    do {
      nonogramID = JSON.stringify(Math.floor(Math.random() * nonograms.length));
    } while (currentNonogramID === nonogramID);

    this.nonogram = nonograms[nonogramID];
    localStorage.setItem('nonogramID', nonogramID);

    return this.nonogram;
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
    area.onmouseleave = () => this.mouseUpEvent();

    for (let i = 0; i < this.nonogram.template.length; i++) {
      const row = document.createElement('div');
      row.className = 'cross__row';

      for (let j = 0; j < this.nonogram.template[i].length; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__ceil cross__ceil_center';
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

    const hints = countRowHints(this.nonogram.template);
    const maxCeilsCount = Math.max(...hints.map((arr) => arr.length));
    for (let i = 0; i < this.nonogram.template.length; i++) {
      const row = document.createElement('div');
      row.className = 'cross__row cross__row_left';

      for (let j = 0; j < maxCeilsCount; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__ceil cross__ceil_left';
        this.bindHintClickEvents(elem);

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
    const hints = countColumnHints(this.nonogram.template);
    const maxCeilsCount = Math.max(...hints.map((arr) => arr.length));

    for (let i = 0; i < hints.length; i++) {
      const column = document.createElement('div');
      column.className = 'cross__top-row';

      for (let j = 0; j < maxCeilsCount; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__ceil cross__ceil_top';
        this.bindHintClickEvents(elem);

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
    this.timer.startTimer();

    switch (event.button) {
      case 0:
        if (elem.classList.contains('cross__ceil_active')) {
          this.ceilState = 'empty';
        } else {
          this.ceilState = 'active';
        }

        elem.classList.remove('cross__ceil_cross');
        elem.classList.toggle('cross__ceil_active');
        if (this.hasSound) this.leftClickSound.play();
        break;

      case 2:
        if (elem.classList.contains('cross__ceil_cross')) {
          this.ceilState = 'empty';
        } else {
          this.ceilState = 'cross';
        }

        elem.classList.remove('cross__ceil_active');
        elem.classList.toggle('cross__ceil_cross');
        if (this.hasSound) this.rightClickSound.play();
        break;
      default:
    }

    this.mouseIsDown = true;
  }

  mouseOverEvent(elem) {
    if (!this.mouseIsDown) return;
    switch (this.ceilState) {
      case 'active':
        if (elem.classList.contains('cross__ceil_active')) break;
        elem.classList.remove('cross__ceil_cross');
        elem.classList.add('cross__ceil_active');
        break;
      case 'cross':
        if (elem.classList.contains('cross__ceil_cross')) break;
        elem.classList.remove('cross__ceil_active');
        elem.classList.add('cross__ceil_cross');
        break;
      default:
        elem.classList.remove('cross__ceil_active', 'cross__ceil_cross');
    }
  }

  mouseUpEvent() {
    this.mouseIsDown = false;
    this.ceilState = null;

    if (this.isGameFinished()) {
      this.finishGame('win');
    }
  }

  bindHintClickEvents(elem) {
    const ceil = elem;
    ceil.onmousedown = () => {
      if (this.hasSound) this.rightClickSound.play();
      elem.classList.toggle('cross__ceil_cross');
    };
    ceil.oncontextmenu = (event) => event.preventDefault();
  }

  bindEvents(elem) {
    const ceil = elem;
    ceil.onmousedown = (event) => this.mouseDownEvent(event, ceil);
    ceil.onmouseover = () => this.mouseOverEvent(ceil);
    ceil.onmouseup = () => this.mouseUpEvent();
    ceil.oncontextmenu = (event) => event.preventDefault();
  }

  // eslint-disable-next-line class-methods-use-this
  removeEvents(elem) {
    const ceil = elem;
    ceil.onmousedown = null;
    ceil.onmouseover = null;
    ceil.onmouseup = null;
    ceil.oncontextmenu = null;
  }

  isGameFinished() {
    const crossArea = this.cross.querySelector('.cross__area');
    const rows = crossArea.querySelectorAll('.cross__row');
    for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('.cross__ceil');
      for (let j = 0; j < cells.length; j++) {
        const isActive = cells[j].classList.contains('cross__ceil_active');
        // Check if ceil match template
        if ((isActive && this.nonogram.template[i][j] !== 1)
          || (!isActive && this.nonogram.template[i][j] !== 0)) {
          return false;
        }
      }
    }
    return true; // if all ceils match template
  }

  resetCross() {
    this.startNewGame(this.nonogram);
  }

  showSolution() {
    this.resetCross();

    const crossArea = this.cross.querySelector('.cross__area');
    const crossAreaCeils = (crossArea.querySelectorAll('.cross__ceil'));

    const templateArray = this.nonogram.template.flat();
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
      const result = {
        nonogramID: this.nonogram.id,
        name: this.nonogram.name,
        level: this.nonogram.level,
        time: this.timer.getTime(),
      };

      if (this.lastScores.length > 4) {
        this.lastScores.shift();
      }
      this.lastScores.push(result);
      localStorage.setItem('scores', JSON.stringify(this.lastScores));
      this.timer.stopTimer();
      this.winModal.renderModal(this.timer.getTime(), this.nonogram);
      if (this.hasSound) this.gongSound.play();
    }
    const ceils = this.cross.querySelectorAll('.cross__ceil');
    ceils.forEach((ceil) => this.removeEvents(ceil));

    const area = document.querySelector('.cross__area');
    area.onmouseleave = null;
  }

  startNewGame(nonogram) {
    this.nonogram = nonogram;
    localStorage.setItem('nonogramID', this.nonogram.id);
    console.log('Start new game');
    this.timer.stopTimer();
    this.timer.setTime(0);
    const crossNode = this.cross;
    crossNode.innerHTML = '';
    this.cross = this.createCross(); // Создание области
  }

  saveGame() {
    const currentCrossHTML = this.cross.innerHTML;
    localStorage.setItem('saved game', currentCrossHTML);

    localStorage.setItem('saved nonogram', this.nonogram.id);

    const currentTime = this.timer.getTime();
    localStorage.setItem('saved time', currentTime);

    const continueBtn = document.querySelector('#continue-btn');
    continueBtn.disabled = false;
  }

  continueGame() {
    const savedCrossHTML = localStorage.getItem('saved game');

    if (savedCrossHTML) {
      const nonogramID = localStorage.getItem('saved nonogram');
      this.nonogram = nonograms[nonogramID];
      localStorage.setItem('nonogramID', nonogramID);
      this.cross.innerHTML = savedCrossHTML;
      const ceils = this.cross.querySelectorAll('.cross__ceil');
      ceils.forEach((ceil) => this.bindEvents(ceil));

      this.timer.stopTimer();
      this.timer.setTime(localStorage.getItem('saved time'));
    }
  }

  muteSound(e) {
    const icon = e.currentTarget.querySelector('.icon');
    if (this.hasSound) {
      if (icon) {
        icon.classList.remove('icon_unmute');
        icon.classList.add('icon_mute');
      }
      this.hasSound = false;
    } else if (!this.hasSound) {
      if (icon) {
        icon.classList.remove('icon_mute');
        icon.classList.add('icon_unmute');
      }
      this.hasSound = true;
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
