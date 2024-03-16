import { Round } from '../../types';
import { BaseComponent } from '../BaseComponent';
import { div } from '../tags';
import styles from './MainGamePage.module.scss';

export default class GameBoard extends BaseComponent {
  private round: Round;

  private sentenceLines: BaseComponent[] = [];

  public currentSentenceNumber: number = 0;

  constructor(round: Round) {
    super({ className: styles.gameGameBoard });
    this.round = round;
    this.createLines(this.round.words.length);
  }

  public createLines(roundsNumber: number) {
    for (let i = 0; i < roundsNumber; i += 1) {
      const sentenceLine = div({ className: styles.gameLine });
      this.sentenceLines.push(sentenceLine);
      this.append(sentenceLine);
    }
  }

  public getSentenceLine() {
    return this.sentenceLines[this.currentSentenceNumber];
  }
}
