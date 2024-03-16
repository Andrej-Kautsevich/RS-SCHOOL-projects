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
    this.addListener('click', this.moveCardToGameBoard.bind(this));
  }

  public getCard() {
    return this.getNode();
  }

  private moveCardToGameBoard() {
    const gameBoardLine = this.gameBoard.getSentenceLine();
    gameBoardLine.append(this.getCard());
    this.removeListener('click', this.moveCardToGameBoard);
    this.addListener('click', this.moveCardToSources.bind(this));
  }

  private moveCardToSources() {
    this.sources.append(this.getCard());
    this.removeListener('click', this.moveCardToSources);
    this.addListener('click', this.moveCardToGameBoard.bind(this));
  }

  private setCardWidth(width: number) {
    this.getNode().style.width = `${width}%`;
  }
}
