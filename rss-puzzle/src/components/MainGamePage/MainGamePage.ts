import Card from '../../models/Card';
import { sentenceService } from '../../services/SentenceService';
import { Round } from '../../types';
import { BaseComponent } from '../BaseComponent';
import { div } from '../tags';
import GameBoard from './GameBoard';
import GameUIManager from './GameUIManager/GameUIManager';
import styles from './MainGamePage.module.scss';

export default class MainGamePage extends BaseComponent {
  private gameBoard: GameBoard;

  private sources: BaseComponent;

  private gameUIManager: GameUIManager;

  private words: string[][] = [];

  private cards: Card[][] = [];

  private round: Round;

  constructor() {
    super({ className: styles.game });
    this.round = sentenceService.getRandomRound();

    this.gameBoard = new GameBoard(this.round);
    this.sources = div({ className: styles.gameSources });
    this.appendChildren([this.gameBoard, this.sources]);
    this.gameUIManager = new GameUIManager(this.sources);

    this.init();
  }

  public setWords() {
    const sentences = sentenceService.getSentencesFromRound(this.round);
    sentences.forEach((sentence) => {
      this.words.push(sentence.split(' '));
    });
  }

  public getWords() {
    return this.words;
  }

  public createCards(): void {
    this.words.forEach((wordRound: string[]) => {
      const cardsLine: Card[] = [];
      const totalLength = wordRound.reduce((total, word) => total + word.length, 0);
      wordRound.forEach((word) => {
        const width = (word.length / totalLength) * 100;
        const card = new Card(word, width, this.gameBoard, this.sources);
        cardsLine.push(card);
      });
      this.cards.push(cardsLine);
    });
    // eslint-disable-next-line no-console
    console.log(this.cards);
    // eslint-disable-next-line no-console
    console.log(this.words);
  }

  private init() {
    this.setWords();
    this.createCards();

    this.gameUIManager.displayCards(this.cards[0]);
  }
}
