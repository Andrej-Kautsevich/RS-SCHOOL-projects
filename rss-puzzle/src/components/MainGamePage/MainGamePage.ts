import Card from '../../models/Card';
import { sentenceService } from '../../services/SentenceService';
import { Round, RoundSentence } from '../../types';
import { BaseComponent } from '../BaseComponent';
import { div } from '../tags';
import GameBoard from './GameBoard';
import GameButtons from './GameButtons/GameButtons';
import ButtonState from './GameButtons/types';
import GameUIManager from './GameUIManager/GameUIManager';
import styles from './MainGamePage.module.scss';
import AUTO_COMPLETE_DELAY from './types/constants';
// import AUTO_COMPLETE_DELAY from './types/constants';
import { getSentencesFromRound } from './utils';

export default class MainGamePage extends BaseComponent {
  private gameBoard: GameBoard;

  private sources: BaseComponent;

  private gameButtons: GameButtons;

  private gameUIManager: GameUIManager;

  private words: string[][] = [];

  private cards: Card[][] = [];

  private round!: Round;

  private roundSentences: RoundSentence[] = [];

  public currentRoundSentence: number = 0;

  constructor() {
    super({ className: styles.game });

    this.gameBoard = new GameBoard();
    this.gameButtons = new GameButtons();
    this.gameButtons.observer.subscribe({ update: this.handleCheckButton.bind(this) });
    this.gameButtons.competeObserver.subscribe({ update: this.handleCompleteButton.bind(this) });

    this.sources = div({ className: styles.gameSources });
    this.gameUIManager = new GameUIManager(this.sources);
    this.appendChildren([this.gameBoard, this.sources, this.gameButtons]);

    this.startNewRound();
  }

  public setWords() {
    this.words = [];
    this.roundSentences.forEach((sentence) => {
      this.words.push(sentence.textExample.split(' '));
    });
  }

  public createCards(): void {
    this.cards = [];
    this.words.forEach((wordRound: string[]) => {
      const cardsLine: Card[] = [];
      const totalLength = wordRound.reduce((total, word) => total + word.length, 0);
      wordRound.forEach((word) => {
        const width = (word.length / totalLength) * 100;
        const card = new Card(word, width);
        card.getNode().addEventListener('click', this.moveCardToGameBoard.bind(this, card), { once: true });
        cardsLine.push(card);
      });
      this.cards.push(cardsLine);
    });
  }

  private moveCardToGameBoard = (card: Card) => {
    const gameBoardLine = this.gameBoard.getSentenceLine();
    gameBoardLine.append(card.getNode());
    card.getNode().addEventListener('click', this.moveCardToSources.bind(this, card), { once: true });
    this.gameBoard.addCard(card);
    if (this.isSentenceLineComplete()) {
      this.gameButtons.getContinueButton().removeAttribute('disabled');
    }
    card.getNode().removeEventListener('click', this.moveCardToGameBoard.bind(this, card));
  };

  private moveCardToSources = (card: Card) => {
    this.sources.append(card.getNode());
    card.getNode().addEventListener('click', this.moveCardToGameBoard.bind(this, card), { once: true });
    this.gameBoard.removeCard(card);
    this.gameButtons.getContinueButton().setAttribute('disabled', 'true');
    card.removeClasses([styles.game__card_true, styles.game__card_false]);
  };

  private checkSentenceWords(): boolean {
    let isMatching = true;
    this.gameBoard.currentCards.forEach((card, index) => {
      if (card.getWord() !== this.words[this.currentRoundSentence][index]) {
        card.toggleClass(styles.game__card_true, false);
        card.toggleClass(styles.game__card_false, true);
        isMatching = false;
      } else {
        card.toggleClass(styles.game__card_false, false);
        card.toggleClass(styles.game__card_true, true);
      }
    });
    if (this.isSentenceLineComplete() && isMatching) {
      this.gameButtons.transformButton(ButtonState.continue);
      this.gameButtons.observer.unsubscribeAll();
      this.gameButtons.observer.subscribe({ update: this.handleContinueButton.bind(this) });
    }
    return isMatching;
  }

  private isSentenceLineComplete(): boolean {
    let isComplete = true;
    if (this.gameBoard.currentCards.length !== this.words[this.currentRoundSentence].length) {
      isComplete = false;
    }
    return isComplete;
  }

  private handleCheckButton() {
    this.checkSentenceWords();
  }

  private handleContinueButton() {
    this.currentRoundSentence += 1;

    this.gameButtons.transformButton(ButtonState.check);
    this.gameButtons.getContinueButton().setAttribute('disabled', 'true');
    this.gameButtons.getCompleteButton().removeAttribute('disabled');
    this.gameButtons.observer.unsubscribeAll();
    this.gameButtons.observer.subscribe({ update: this.handleCheckButton.bind(this) });

    this.gameBoard.currentCards.forEach((card) => {
      card.removeClasses([styles.game__card_false, styles.game__card_true]);
    });

    if (this.currentRoundSentence > this.round.words.length - 1) {
      this.round = sentenceService.getRandomRound();
      this.currentRoundSentence = 0;
      this.startNewRound();
      return;
    }
    this.gameUIManager.displayCards(this.cards[this.currentRoundSentence]);
    this.gameBoard.currentCards = [];
    this.gameBoard.currentSentenceNumber = this.currentRoundSentence;
  }

  private async handleCompleteButton() {
    this.gameBoard.currentCards = [];
    this.gameBoard.getSentenceLine().destroyChildren();
    this.gameButtons.getCompleteButton().setAttribute('disabled', 'true');

    const currentRoundCards = this.cards[this.currentRoundSentence].slice();

    const promises = this.words[this.currentRoundSentence].map((word, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const cardIndex = currentRoundCards.findIndex((card: Card) => card.getWord() === word);
          if (cardIndex !== -1) {
            const wordCard = currentRoundCards[cardIndex];
            this.moveCardToGameBoard(wordCard);
            currentRoundCards.splice(cardIndex, 1);
          }
          resolve(null);
        }, AUTO_COMPLETE_DELAY * index);
      });
    });

    await Promise.all(promises);

    this.handleCheckButton();
  }

  private startNewRound() {
    this.round = sentenceService.getRandomRound();
    this.roundSentences = getSentencesFromRound(this.round);
    this.gameBoard.roundSentences = this.roundSentences;
    this.gameBoard.clearBoard();
    this.setWords();
    this.createCards();
    this.gameUIManager.displayCards(this.cards[this.currentRoundSentence]);
  }
}
