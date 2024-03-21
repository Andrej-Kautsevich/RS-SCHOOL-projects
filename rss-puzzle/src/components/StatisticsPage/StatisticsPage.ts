import { statisticsPageObserver } from '../../utils/Observer';
import { BaseComponent } from '../BaseComponent';
import { button, div, h, img, span } from '../tags';
import styles from './statisticsPage.module.scss';
import buttonStyles from '../../styles/button.module.scss';
import gameButtonStyles from '../MainGamePage/GameButtons/GameButton.module.scss';
import iconStyles from '../../styles/icons.module.scss';
import { router } from '../../services/RouterService';
import { PagesId, SentenceStatistics } from '../../types';

export default class StatisticsPage extends BaseComponent {
  private continueButton: BaseComponent;

  private sentencesStats: BaseComponent;

  private artMiniature: BaseComponent<HTMLImageElement>;

  private artSrc: string = '';

  private knownSentences: SentenceStatistics[] = [];

  private unknownSentences: SentenceStatistics[] = [];

  constructor() {
    super({ className: styles.statistics }, h(1, { className: styles.statistics__title, txt: 'Game statistics' }));

    this.continueButton = button(
      {
        classNames: [
          buttonStyles.button,
          buttonStyles.buttonHasIcon,
          gameButtonStyles.buttons__continue,
          gameButtonStyles.gameButton,
        ],
        onclick: () => {
          statisticsPageObserver.notify();
          router.navigateTo(PagesId.main);
        },
      },
      span({ className: gameButtonStyles.gameButtonText, txt: 'Continue' }),
      span({ classNames: [gameButtonStyles.gameButtonIcon, iconStyles.icon, iconStyles.iconContinue] }),
    );

    this.sentencesStats = div({ className: styles.statistics__sentences });

    this.artMiniature = img(this.artSrc, { className: styles.statistics__image });

    this.appendChildren([this.artMiniature, this.sentencesStats, this.continueButton]);
  }

  public setSentences(sentences: SentenceStatistics[]) {
    sentences.forEach((sentence) => {
      if (sentence.isHintUsed) {
        this.unknownSentences.push(sentence);
      } else {
        this.knownSentences.push(sentence);
      }
    });
    this.renderStatistics();
  }

  public setArtMiniature(src: string) {
    this.artMiniature.getNode().src = src;
  }

  private renderStatistics() {
    this.sentencesStats.appendChildren([
      div(
        { classNames: [styles.statistics__name, styles.statistics__name_known], txt: 'I know:' },
        ...this.knownSentences.map((sentence) =>
          div(
            { classNames: [styles.statistics__item, styles.statistics__item] },
            button(
              {
                classNames: [styles.soundButton],
                onclick: () => {
                  const hint = new Audio(`./${sentence.audioExample}`);
                  hint.play();
                  // hint.onplay = () => this.toggleClass(styles.soundButtonActive);
                  // hint.onended = () => this.toggleClass(styles.soundButtonActive);
                },
              },
              span({ classNames: [iconStyles.icon, iconStyles.icon_sound] }),
            ),
            span({ className: styles.statistics__text, txt: sentence.textExample }),
          ),
        ),
      ),
      div(
        { classNames: [styles.statistics__name, styles.statistics__name_unknown], txt: "I Don't know:" },
        ...this.unknownSentences.map((sentence) =>
          div(
            { classNames: [styles.statistics__item] },
            button(
              {
                classNames: [styles.soundButton],
                onclick: () => {
                  const hint = new Audio(`./${sentence.audioExample}`);
                  hint.play();
                  // hint.onplay = () => this.toggleClass(styles.soundButtonActive);
                  // hint.onended = () => this.toggleClass(styles.soundButtonActive);
                },
              },
              span({ classNames: [iconStyles.icon, iconStyles.icon_sound] }),
            ),
            span({ className: styles.statistics__text, txt: sentence.textExample }),
          ),
        ),
      ),
    ]);
  }
}
