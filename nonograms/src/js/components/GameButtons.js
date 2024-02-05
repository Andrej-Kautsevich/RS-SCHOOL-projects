// import Cross from "../Cross/Cross";
import ScoreModal from '../layout/ScoreModal';
import NewGameModal from '../layout/NewGameModal';
import templates from '../templates';

import { createElement, createButton, createMenuItem } from './createNodeElement';

export default class GameButtons {
  constructor(cross, modal) {
    this.cross = cross;
    this.modal = modal;
    // this.winModal = winModal;
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

    const newGame = createMenuItem('navigation__item', 'Start New Game', () => {
      const newGameModal = new NewGameModal(templates, this.cross);
      newGameModal.renderModal();
    });
    const scoreTable = createMenuItem('navigation__item', 'Score table', () => {
      const scoreModal = new ScoreModal(this.cross.getLastScores());
      scoreModal.renderModal();
    });
    const random = createMenuItem('navigation__item', 'Random game', () => {
      const template = this.cross.getTemplate();
      this.cross.startNewGame(template);
    });
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
