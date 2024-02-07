// import Cross from "../Cross/Cross";
import ScoreModal from '../layout/ScoreModal';
import NewGameModal from '../layout/NewGameModal';
import nonograms from '../nonograms';

import { createElement, createButton, createMenuItem } from './createNodeElement';

export default class GameButtons {
  constructor(cross, modal, theme) {
    this.cross = cross;
    this.modal = modal;
    this.theme = theme;
    this.gameButtons = this.createGameButtons();
    this.menuBar = this.createMenuBar();
  }

  createGameButtons() {
    const gameButtons = createElement('div', 'game-buttons');

    const solutionBtn = createButton('button game-buttons__button', 'Solution', () => this.cross.showSolution());
    const resetBtn = createButton('button game-buttons__button', 'Reset', () => this.cross.resetCross());

    const saveBtn = createButton('button game-buttons__button', 'Save', () => this.cross.saveGame());
    const continueBtn = createButton('button game-buttons__button', 'Continue', () => this.cross.continueGame());
    continueBtn.id = 'continue-btn';

    if (!localStorage.getItem('saved game')) continueBtn.disabled = true;

    gameButtons.append(solutionBtn, saveBtn, continueBtn, resetBtn);

    return gameButtons;
  }

  createMenuBar() {
    const menuBar = createElement('aside', 'menu-bar');
    const menuBarItems = createElement('ul', 'menu-bar__navigation navigation');

    const newGame = createMenuItem('navigation__item', 'Start New Game', () => {
      const newGameModal = new NewGameModal(nonograms, this.cross);
      newGameModal.renderModal();
    });
    const scoreTable = createMenuItem('navigation__item', 'Score table', () => {
      const scoreModal = new ScoreModal();
      scoreModal.renderModal();
    });
    const random = createMenuItem('navigation__item', 'Random game', () => {
      const template = this.cross.getTemplate();
      this.cross.startNewGame(template);
    });
    const rules = createMenuItem('navigation__item', 'How to solve?', null, 'https://nonograms-katana.fandom.com/wiki/Tips_for_solving');
    const settings = this.createSettings();

    menuBarItems.append(newGame, scoreTable, random, rules);
    menuBar.append(menuBarItems, settings);

    return menuBar;
  }

  createSettings() {
    const themeSpan = createElement('span', 'icon icon_theme-light');
    const theme = createButton('button button_has-icon menu-bar__theme', 'Theme', (e) => {
      this.theme.changeTheme(e);
    });
    theme.prepend(themeSpan);

    const muteSpan = createElement('span', 'icon icon_unmute');
    const mute = createButton('button button_has-icon', 'Mute', (e) => {
      this.cross.muteSound(e);
    });
    mute.prepend(muteSpan);

    const settings = createElement('div', 'menu-bar__settings', theme, mute);
    return settings;
  }

  getGameButtons() {
    return this.gameButtons;
  }

  getMenuBar() {
    return this.menuBar;
  }
}
