import Modal from './Modal';

import { createElement, createButton } from '../components/createNodeElement';

export default class NewGameModal extends Modal {
  constructor(templates, cross) {
    super();
    this.templates = templates;
    this.cross = cross;
  }

  generateContent() {
    const content = createElement('div', 'new-game');

    const tabs = createElement('div', 'new-game__buttons');

    ['easy', 'medium', 'hard'].forEach((level) => {
      const tab = createButton('button new-game__button', level, () => {
        this.showTemplates(tab, level);
      });
      tabs.appendChild(tab);
    });

    content.appendChild(tabs);
    this.tabContainer = createElement('div', 'new-game__tab');
    content.appendChild(this.tabContainer);
    console.log(tabs);
    this.showTemplates(tabs.querySelector('.new-game__button'), 'easy');

    return content;
  }

  showTemplates(btn, level) {
    // Удалить класс 'active' со всех кнопок
    const buttons = document.querySelectorAll('.new-game__button');
    buttons.forEach((button) => {
      button.classList.remove('new-game__button_active');
    });
    btn.classList.add('new-game__button_active');

    this.tabContainer.innerHTML = '';
    this.templates.filter((template) => template.level === level).forEach((template) => {
      const templateButton = createButton('button button_action', `${template.name}`, (e) => {
        localStorage.setItem('templateID', template.id);
        this.cross.startNewGame(template.template);
        super.closeModal(e);
      });

      this.tabContainer.appendChild(templateButton);
    });
  }

  renderModal() {
    const content = this.generateContent();
    super.buildModal(content);
  }
}
