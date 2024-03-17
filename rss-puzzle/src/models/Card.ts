import { BaseComponent } from '../components/BaseComponent';
import styles from '../components/MainGamePage/MainGamePage.module.scss';
import { img, span } from '../components/tags';
import cardStyles from './card.module.scss';

export default class Card extends BaseComponent {
  private word: string;

  constructor(word: string, width: number, image: string) {
    super(
      { classNames: [styles.game__card, cardStyles.card] },
      img(image, { className: cardStyles.card__image }),
      span({ classNames: [cardStyles.card__text], txt: word }),
    );
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
