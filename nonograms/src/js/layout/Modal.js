function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.classList.add(...className.split(' '));
  if (textContent) element.append(textContent);
  return element;
}

export default class Modal {
  constructor() {
    this.modal = '';
    this.modalContent = '';
    this.modalCloseBtn = '';
    this.overlay = '';
  }

  buildModal(content) {
    // Overlay
    this.overlay = createElement('div', 'overlay');
    this.overlay.addEventListener('click', (e) => this.closeModal(e));

    // modal
    this.modal = createElement('div', 'modal');

    // content
    this.modalContent = createElement('div', 'modal__content', content);
    this.modal.append(this.modalContent);
    this.overlay.append(this.modal);

    // return this.overlay;
    this.openModal();
  }

  openModal() {
    document.body.append(this.overlay);
  }

  closeModal(e) {
    if (!e) {
      this.overlay.remove();
    } else if (e.target === this.overlay || e.currentTarget === this.modalCloseBtn) {
      this.overlay.remove();
    }
  }
}
