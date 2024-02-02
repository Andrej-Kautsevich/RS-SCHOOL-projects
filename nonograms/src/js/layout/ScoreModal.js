import Modal from './Modal';
import { createButton } from '../components/createNodeElement';

export default class ScoreModal extends Modal {
  constructor(content) {
    super();
    this.content = content;
  }

  generateContent() {
    const scoreTableModal = document.createElement('div');
    const text = this.content;
    scoreTableModal.innerText = text;

    const modalCLoseIcon = document.createElement('span');
    modalCLoseIcon.classList.add('icon', 'icon_close');

    this.modalCloseBtn = createButton('button button_action button_has-icon modal__close', null, (e) => this.closeModal(e));
    this.modalCloseBtn.append(modalCLoseIcon);
    scoreTableModal.append(this.modalCloseBtn);

    return scoreTableModal;
  }

  renderModal() {
    const content = this.generateContent();
    super.buildModal(content);
  }
}
