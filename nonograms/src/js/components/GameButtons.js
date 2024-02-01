// import Cross from "../Cross/Cross";

function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.classList.add(...className.split(' '));
  if (textContent) element.textContent = textContent;
  return element;
}

export default class GameButtons {
  constructor(cross) {
    this.cross = cross;
    this.gameButtons = this.createGameButtons();
  }

  // eslint-disable-next-line class-methods-use-this
  createGameButtons() {
    const gameButtons = createElement('div', 'game-buttons');

    const solutionBtn = createElement('button', 'button game-buttons__button', 'Solution');
    const saveBtn = createElement('button', 'button game-buttons__button', 'Save');
    const continueBtn = createElement('button', 'button game-buttons__button', 'Continue');
    const resetBtn = createElement('button', 'button game-buttons__button', 'Reset');

    resetBtn.addEventListener('click', () => {
      this.cross.resetCross();
    });

    gameButtons.append(solutionBtn, saveBtn, continueBtn, resetBtn);

    return gameButtons;
  }

  getGameButtons() {
    return this.gameButtons;
  }
}
