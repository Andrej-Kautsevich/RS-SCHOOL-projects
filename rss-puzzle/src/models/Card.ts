import { BaseComponent } from '../components/BaseComponent';
import styles from '../components/MainGamePage/MainGamePage.module.scss';

export default class Card extends BaseComponent {
  private word: string;

  constructor(word: string, width: number) {
    super({ classNames: [styles.gameCard], txt: word });
    this.word = word;
    this.setCardWidth(width);
  }

  public getCard() {
    return this.getNode();
  }

  public getWord() {
    return this.word;
  }

  private setCardWidth(width: number) {
    this.getNode().style.width = `${width}%`;
  }
}
