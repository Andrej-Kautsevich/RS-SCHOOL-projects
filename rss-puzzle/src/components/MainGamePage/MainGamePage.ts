import Card from '../../models/Card';
import { sentenceService } from '../../services/SentenceService';
import { Round, RoundSentence, SentenceStatistics } from '../../types';
import { BaseComponent } from '../BaseComponent';
import { div, p } from '../tags';
import GameBoard from './GameBoard/GameBoard';
import GameButtons from './GameButtons/GameButtons';
import GameUIManager from './GameUIManager/GameUIManager';
import styles from './MainGamePage.module.scss';
import cardStyles from '../../models/card.module.scss';
import AUTO_COMPLETE_DELAY from './types/constants';
import { getSentencesFromRound } from './utils';
import Toolbar from './Toolbar/Toolbar';
import ButtonName from './GameButtons/types';
import { statisticsPageObserver } from '../../utils/Observer';
import { localStorageService } from '../../services/LocalStorageService';

export default class MainGamePage extends BaseComponent {
  private toolbar: Toolbar;

  private gameBoard: GameBoard;

  private sources: BaseComponent;

  private gameButtons: GameButtons;

  private gameUIManager: GameUIManager;

  private roundInfo: BaseComponent = div({ classNames: [styles.game__roundInfo] });

  private words: string[][] = [];

  private cards: Card[][] = [];

  private round!: Round;

  private rounds: Round[] = [];

  private roundSentences: RoundSentence[] = [];

  public currentRoundSentence: number = 0;

  public currentRoundCount: number = 0;

  public currentLevelCount: number = 0;

  private isHintUsed = false;

  private image = new Image();

  constructor() {
    super({ className: styles.game });
    this.gameBoard = new GameBoard();

    this.gameButtons = new GameButtons();
    this.gameButtons.observer.subscribe({ update: this.checkSentenceWords.bind(this) });
    this.gameButtons.competeObserver.subscribe({ update: this.handleCompleteButton.bind(this) });

    this.toolbar = new Toolbar();
    this.toolbar.backgroundHint.backgroundHintObserver.subscribe({ update: this.toggleBackground.bind(this) });
    this.toolbar.switcher.levelsObserver.subscribe({ update: this.startNewLevel.bind(this) });
    this.toolbar.switcher.roundsObserver.subscribe({ update: this.startNewRound.bind(this) });

    this.sources = div({ className: styles.gameSources });
    this.gameUIManager = new GameUIManager(this.sources);

    statisticsPageObserver.subscribe({
      update: () => {
        this.gameButtons.transformButton(ButtonName.continue, ButtonName.check);
        this.gameButtons.completeButton.removeAttribute('disabled');
        this.gameButtons.transformButton(ButtonName.statistics, ButtonName.complete);
        this.startNextRound.bind(this);
      },
    });

    this.appendChildren([this.toolbar, this.gameBoard, this.sources, this.gameButtons]);

    this.startNewLevel();
  }

  private toggleBackground() {
    this.cards[this.currentRoundSentence].forEach((card) => {
      card.toggleViability(this.toolbar.backgroundHint.backgroundHintActive);
    });
  }

  public setWords() {
    this.words = [];
    this.roundSentences.forEach((sentence) => {
      this.words.push(sentence.textExample.split(' '));
    });
  }

  public createCards(): void {
    this.cards = [];
    const gameBoardWidth = this.gameBoard.getNode().clientWidth;
    const gameBoardHeight = this.gameBoard.getNode().clientHeight;
    this.words.forEach((wordRound: string[], index) => {
      let offsetX = 0;
      const offsetY = -(gameBoardHeight / this.words.length) * index;
      const cardsLine: Card[] = [];
      const totalLength = wordRound.reduce((total, word) => total + word.length, 0);
      wordRound.forEach((word, idx) => {
        const width = (word.length / totalLength) * 100;

        const card = new Card(word, width, this.image.src, offsetX, offsetY, gameBoardWidth, gameBoardHeight);
        offsetX -= (gameBoardWidth * width) / 100;
        if (idx === 0) {
          card.applyModification('first');
        }
        if (idx === wordRound.length - 1) {
          card.applyModification('last');
        }
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
      this.gameButtons.buttons.Check.removeAttribute('disabled');
    }
    card.getNode().removeEventListener('click', this.moveCardToGameBoard.bind(this, card));
  };

  private moveCardToSources = (card: Card) => {
    this.sources.append(card.getNode());
    card.getNode().addEventListener('click', this.moveCardToGameBoard.bind(this, card), { once: true });
    this.gameBoard.removeCard(card);
    this.gameButtons.buttons.Check.setAttribute('disabled', 'true');
    card.removeClasses([cardStyles.card_true, cardStyles.card_false]);
  };

  private checkSentenceWords() {
    let isMatching = true;
    this.gameBoard.currentCards.forEach((card, index) => {
      if (card.getWord() !== this.words[this.currentRoundSentence][index]) {
        card.toggleClass(cardStyles.card_true, false);
        card.toggleClass(cardStyles.card_false, true);
        isMatching = false;
      } else {
        card.toggleClass(cardStyles.card_false, false);
        card.toggleClass(cardStyles.card_true, true);
      }
    });

    // End of sentence
    if (this.isSentenceLineComplete() && isMatching) {
      this.updateStatistics();

      this.gameBoard.currentCards.forEach((card) => {
        card.toggleViability(true);
      });
      this.gameButtons.transformButton(ButtonName.check, ButtonName.continue);
      this.gameButtons.buttons.Complete.setAttribute('disabled', 'true');
      this.gameButtons.observer.unsubscribeAll();
      this.gameButtons.observer.subscribe({ update: this.handleContinueButton.bind(this) });

      if (!this.toolbar.pronunciation.pronunciationHintActive) {
        this.toolbar.pronunciation.showHint();
      }

      // End of round
      if (this.currentRoundSentence === this.roundSentences.length - 1) {
        this.cards.forEach((cards) => {
          cards.forEach((card) => {
            card.toggleClass(cardStyles.card_completed);
          });
        });
        this.gameButtons.transformButton(ButtonName.complete, ButtonName.statistics);
        this.showRoundInfo();
      }
    }
  }

  private updateStatistics() {
    const statistics = localStorageService.getData('userStatistics') || [];

    const data: SentenceStatistics = {
      isHintUsed: this.isHintUsed,
      textExample: this.roundSentences[this.currentRoundSentence].textExample,
      audioExample: this.roundSentences[this.currentRoundSentence].audioExample,
    };

    statistics.push(data);
    localStorageService.saveData('userStatistics', statistics);
  }

  private isSentenceLineComplete(): boolean {
    let isComplete = true;
    if (this.gameBoard.currentCards.length !== this.words[this.currentRoundSentence].length) {
      isComplete = false;
    }
    return isComplete;
  }

  private handleContinueButton() {
    this.currentRoundSentence += 1;

    this.gameButtons.transformButton(ButtonName.continue, ButtonName.check);
    // this.gameButtons.buttons.Continue.setAttribute('disabled', 'true');
    this.gameButtons.buttons.Complete.removeAttribute('disabled');
    this.gameButtons.observer.unsubscribeAll();
    this.gameButtons.observer.subscribe({ update: this.checkSentenceWords.bind(this) });

    if (!this.toolbar.pronunciation.pronunciationHintActive) {
      this.toolbar.pronunciation.showHint();
    }

    if (this.currentRoundSentence > this.round.words.length - 1) {
      this.gameButtons.transformButton(ButtonName.statistics, ButtonName.complete);
      this.startNextRound();
      return;
    }
    this.startNewSentence();
  }

  private async handleCompleteButton() {
    this.isHintUsed = true;
    this.gameBoard.currentCards = [];
    this.gameBoard.getSentenceLine().destroyChildren();
    this.gameButtons.buttons.Complete.setAttribute('disabled', 'true');

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
    this.gameButtons.buttons.Check.setAttribute('disabled', 'true');

    this.checkSentenceWords();
  }

  private showRoundInfo() {
    this.roundInfo.appendChildren([
      p({ className: styles.game__roundInfoText, txt: `Name: ${this.round.levelData.name}` }),
      p({ className: styles.game__roundInfoText, txt: `Author: ${this.round.levelData.author}` }),
      p({ className: styles.game__roundInfoText, txt: `Year: ${this.round.levelData.year}` }),
    ]);

    this.append(this.roundInfo);
  }

  private startNewSentence() {
    this.isHintUsed = false;
    this.gameBoard.currentCards.forEach((card) => {
      card.removeClasses([cardStyles.card_false, cardStyles.card_true]);
    });

    // set Hints
    this.toolbar.hint.addHint(this.round.words[this.currentRoundSentence].textExampleTranslate);
    this.toolbar.pronunciation.addAudio(this.round.words[this.currentRoundSentence].audioExample);

    this.gameUIManager.displayCards(
      this.cards[this.currentRoundSentence],
      this.toolbar.backgroundHint.backgroundHintActive,
    );
    this.gameBoard.currentCards = [];
    this.gameBoard.currentSentenceNumber = this.currentRoundSentence;
  }

  public startNewRound(round: number = 0) {
    localStorageService.removeData('userStatistics');
    this.roundInfo.destroy();
    this.currentRoundCount = round;
    if (round >= this.rounds.length) {
      this.toolbar.switcher.checkLevelComplete(sentenceService.currentLevel);
      this.rounds = sentenceService.getNextLevelRounds();
      this.startNewLevel(sentenceService.currentLevel);
    }
    this.sources.destroyChildren();
    this.currentRoundSentence = 0;
    this.round = this.rounds[this.currentRoundCount];
    this.roundSentences = getSentencesFromRound(this.round);
    this.gameBoard.roundSentences = this.roundSentences;
    this.gameBoard.clearBoard();
    this.toolbar.switcher.selectRound(this.currentRoundCount);
    this.image.src = `./images/${this.round.levelData.imageSrc}`;
    this.image.onload = () => {
      this.setWords();
      this.createCards();
      this.startNewSentence();
      localStorageService.saveData('artMiniature', this.image.src);
    };
  }

  private startNextRound() {
    this.toolbar.switcher.checkRoundComplete(this.currentRoundCount);
    this.currentRoundCount += 1;
    this.startNewRound(this.currentRoundCount);
  }

  public startNewLevel(level: number = 0) {
    sentenceService.setWordCollectionLevel(level);
    this.rounds = sentenceService.getRounds(level);
    this.currentRoundCount = 0;
    this.toolbar.switcher.selectLevel(level);
    this.toolbar.switcher.renderRoundOptions(this.rounds.length);
    this.startNewRound(0);
  }
}
