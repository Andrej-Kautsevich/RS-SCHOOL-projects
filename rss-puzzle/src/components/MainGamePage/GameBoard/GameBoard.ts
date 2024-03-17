import Card from '../../../models/Card';
import { RoundSentence } from '../../../types';
import { BaseComponent } from '../../BaseComponent';
import { div } from '../../tags';
import styles from '../MainGamePage.module.scss';

export default class GameBoard extends BaseComponent {
  public roundSentences: RoundSentence[] = [];

  private sentenceLines: BaseComponent[] = [];

  public currentCards: Card[] = [];

  public currentSentenceNumber: number = 0;

  constructor() {
    super({ className: styles.gameGameBoard });
    this.createLines(this.roundSentences.length);
  }

  public createLines(roundsNumber: number) {
    for (let i = 0; i < roundsNumber; i += 1) {
      const sentenceLine = div({ className: styles.gameLine });
      this.sentenceLines.push(sentenceLine);
      this.append(sentenceLine);
    }
  }

  public clearBoard() {
    this.destroyChildren();
    this.currentCards = [];
    this.currentSentenceNumber = 0;
    this.sentenceLines = [];
    this.createLines(this.roundSentences.length);
  }

  public getSentenceLine() {
    return this.sentenceLines[this.currentSentenceNumber];
  }

  public addCard(card: Card) {
    this.currentCards.push(card);
  }

  public removeCard(card: Card) {
    const index = this.currentCards.indexOf(card);
    if (index !== -1) {
      this.currentCards.splice(index, 1);
    }
  }
}
