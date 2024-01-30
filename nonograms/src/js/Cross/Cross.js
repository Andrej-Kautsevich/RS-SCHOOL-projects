import { countRowHints, countColumnHints } from './CrossHints';

export default class Cross {
  constructor(template) {
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
        elem.className = 'cross__ceil cross__ceil_left';

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
    console.log(hints);
    const maxCeilsCount = Math.max(...hints.map((arr) => arr.length));

    for (let i = 0; i < hints.length; i++) {
      const column = document.createElement('div');
      column.className = 'cross__row-top';

      for (let j = 0; j < maxCeilsCount; j++) {
        const elem = document.createElement('div');
        elem.className = 'cross__ceil cross__ceil_top';

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

  getCross() {
    return this.cross;
  }
}
