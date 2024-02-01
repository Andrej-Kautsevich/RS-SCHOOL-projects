// import Cross from "../Cross/Cross";

function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.classList.add(...className.split(' '));
  if (textContent) element.textContent = textContent;
  return element;
}

function createButton(className, textContent, clickHandler) {
  const button = createElement('button', className, textContent);
  button.addEventListener('click', clickHandler);
  return button;
}

function createMenuItem(itemClass, textContent, clickHandler, link) {
  const item = createElement('li', itemClass);
  let button;
  if (link) {
    button = createElement('a', 'button button_link', textContent);
    button.setAttribute('href', link);
    button.setAttribute('target', '_blank');
  } else {
    button = createElement('button', 'button', textContent);
    button.addEventListener('click', clickHandler);
  }
  item.append(button);
  return item;
}

export default class GameButtons {
  constructor(cross) {
    this.cross = cross;
    this.gameButtons = this.createGameButtons();
    this.menuBar = this.createMenuBar();
  }

  createGameButtons() {
    const gameButtons = createElement('div', 'game-buttons');

    const solutionBtn = createButton('button game-buttons__button', 'Solution', () => this.cross.showSolution());
    const resetBtn = createButton('button game-buttons__button', 'Reset', () => this.cross.resetCross());

    const saveBtn = createElement('button', 'button game-buttons__button', 'Save');
    const continueBtn = createElement('button', 'button game-buttons__button', 'Continue');

    gameButtons.append(solutionBtn, saveBtn, continueBtn, resetBtn);

    return gameButtons;
  }

  createMenuBar() {
    const menuBar = createElement('aside', 'menu-bar');
    const menuBarItems = createElement('ul', 'menu-bar__navigation navigation');

    const newGame = createMenuItem('navigation__item', 'Start New Game', () => this.cross.startNewGame());
    const scoreTable = createMenuItem('navigation__item', 'Score table');
    const random = createMenuItem('navigation__item', 'Random game', () => this.cross.startNewGame());
    const rules = createMenuItem('navigation__item', 'How to solve?', null, 'https://nonograms-katana.fandom.com/wiki/Tips_for_solving');

    menuBarItems.append(newGame, scoreTable, random, rules);
    menuBar.append(menuBarItems);

    return menuBar;
  }

  getGameButtons() {
    return this.gameButtons;
  }

  getMenuBar() {
    return this.menuBar;
  }
}
