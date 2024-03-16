import { BaseComponent } from '../components/BaseComponent';
import GameBoard from '../components/MainGamePage/GameBoard';
import styles from '../components/MainGamePage/MainGamePage.module.scss';

export default class Card extends BaseComponent {
  private gameBoard: GameBoard;

  private sources: BaseComponent;

  constructor(word: string, width: number, gameBoard: GameBoard, sources: BaseComponent) {
    super({ classNames: [styles.gameCard], txt: word });
    this.gameBoard = gameBoard;
    this.sources = sources;
    this.setCardWidth(width);
    this.addListener('click', this.moveCard.bind(this));
  }

  public getCard() {
    return this.getNode();
  }

  public moveCard() {
    const gameBoardLine = this.gameBoard.getSentenceLine();
    gameBoardLine.append(this.getCard());
  }

  private setCardWidth(width: number) {
    this.getNode().style.width = `${width}%`;
  }
}
