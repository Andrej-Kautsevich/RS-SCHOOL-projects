import { countRowHints, countColumnHints } from './CrossHints';

export default class Cross {
  constructor(template, timer) {
    this.timer = timer;
    this.isTimerActive = false;
    this.template = template; // Шаблон области
    this.cross = this.createCross(); // Создание области
  }

  createCross() {
    const cross = document.createElement('div');
    cross.className = 'cross';

    const crossTop = this.createTopHints();
    const crossBottom = document.createElement('div');
    crossBottom.className = 'cross__bottom';

    const crossArea = this.createArea();
    const crossLeft = this.createLeftHint();

    crossBottom.append(crossLeft, crossArea);
    cross.append(crossTop, crossBottom);

    return cross;
  }

  createArea() {
    const area = document.createElement('div');
    area.className = 'cross__area';

    for (let i = 0; i < this.template.length; i++) {
      const row = document.createElement('div');
      row.className = 'cross__row';

      for (let j = 0; j < this.template[i].length; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__ceil';
        elem.addEventListener('mousedown', (event) => this.mouseDownEvent(event, elem), false);
        elem.addEventListener('contextmenu', (event) => event.preventDefault());
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
      this.finishGame();
    }
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
    // console.log(crossArea);
    const crossAreaCeils = crossArea.querySelectorAll('.cross__ceil');
    crossAreaCeils.forEach((ceil) => {
      ceil.classList.remove('cross__ceil_active', 'cross__ceil_cross');
    });
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

  // eslint-disable-next-line class-methods-use-this
  finishGame() {
    console.log('Game over!');
  }

  getCross() {
    return this.cross;
  }
}
