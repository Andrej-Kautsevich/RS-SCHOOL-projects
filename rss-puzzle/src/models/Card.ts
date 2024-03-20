import { BaseComponent } from '../components/BaseComponent';
import styles from '../components/MainGamePage/MainGamePage.module.scss';
import { div, span } from '../components/tags';
import cardStyles from './card.module.scss';

export default class Card extends BaseComponent {
  private word: string;

  private imgWrapper: BaseComponent<HTMLDivElement>;

  private offsetX: number;

  private offsetY: number;

  private sizeX: number;

  private sizeY: number;

  constructor(
    word: string,
    width: number,
    image: string,
    offsetX: number,
    offsetY: number,
    sizeX: number,
    sizeY: number,
  ) {
    super(
      { classNames: [styles.game__card, cardStyles.card] },
      span({ classNames: [cardStyles.card__text], txt: word }),
    );

    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    this.imgWrapper = div({ className: cardStyles.card__image });
    this.imgWrapper.getNode().style.backgroundImage = `url(${image})`;
    this.imgWrapper.getNode().style.backgroundSize = `${this.sizeX}px ${this.sizeY}px`;
    this.imgWrapper.getNode().style.backgroundPosition = `${this.offsetX}px ${this.offsetY}px`;

    this.append(this.imgWrapper);

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

  public toggleViability(isVisible: boolean) {
    this.imgWrapper.toggleClass(cardStyles.card_notVisible, !isVisible);
  }
}
