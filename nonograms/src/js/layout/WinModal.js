import Modal from './Modal';
import { createElement, createButton } from '../components/createNodeElement';

export default class WinModal extends Modal {
  generateContent(time, nonogram) {
    const content = createElement('div', 'end-game');
    const modalCLoseIcon = createElement('span', 'icon icon_close');

    const heading = createElement('p', 'end-game__heading', 'Congratulations');
    const timeString = `${Math.floor(time / 60)}\u00A0:\u00A0${`0${Math.floor(time % 60)}`.slice(-2)}`;

    const textContent = createElement('p', 'end-game__text', `You have solved the ${nonogram.name} nonogram in ${timeString}!`);

    const modalCloseBtn = createButton('button button_action button_has-icon modal__close', '', (e) => super.closeModal(e));
    modalCloseBtn.append(modalCLoseIcon);
    content.append(heading, textContent, modalCloseBtn);

    return content;
  }

  renderModal(time, nonogram) {
    const content = this.generateContent(time, nonogram);
    super.buildModal(content);
  }
}
