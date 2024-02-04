import Modal from './Modal';
import { createElement, createButton, createScoreTableItem } from '../components/createNodeElement';

export default class ScoreModal extends Modal {
  constructor(scores) {
    super();
    this.scores = scores;
  }

  generateContent() {
    const scoreTableModal = createElement('div', 'score-table');
    const modalCLoseIcon = createElement('span', 'icon icon_close');
    const heading = createElement('p', 'score-table__heading', 'Score table');

    const scores = this.generateScoreTable();

    const modalCloseBtn = createButton('button button_action button_has-icon modal__close', null, (e) => super.closeModal(e));
    modalCloseBtn.append(modalCLoseIcon);
    scoreTableModal.append(heading, scores, modalCloseBtn);

    return scoreTableModal;
  }

  generateScoreTable() {
    const table = createElement('table', 'score-table__scores');
    const tableHead = createElement('thead');
    const tableHeadRow = createScoreTableItem('score-table', '№', 'Name', 'Time');
    tableHead.append(tableHeadRow);

    const tableBody = createElement('tbody');

    for (let i = 0; i < this.scores.length; i++) {
      console.log(this.scores[i].time);
      const score = createScoreTableItem('score-table', i, JSON.parse(this.scores[i].id), JSON.parse(this.scores[i].time));
      tableBody.appendChild(score);
    }

    table.append(tableHead, tableBody);
    return table;
  }

  renderModal() {
    console.log(this.scores);
    const table = this.generateContent();
    super.buildModal(table);
  }
}
