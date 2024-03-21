import { BaseComponent } from '../../BaseComponent';
import { button, span } from '../../tags';
import styles from '../MainGamePage.module.scss';
import gameButtonStyles from './GameButton.module.scss';
import buttonStyles from '../../../styles/button.module.scss';
import iconStyles from '../../../styles/icons.module.scss';
import { Observer } from '../../../utils/Observer';
import ButtonName, { GameButton } from './types';
import ANIMATION_DURATION from './types/constants';
import { router } from '../../../services/RouterService';
import { PagesId } from '../../../types';
import { localStorageService } from '../../../services/LocalStorageService';

export default class GameButtons extends BaseComponent {
  public buttons: Record<ButtonName, GameButton>;

  public checkButton: GameButton;

  public continueButton: GameButton;

  public completeButton: GameButton;

  public statisticsButton: GameButton;

  public observer = new Observer<void>();

  public competeObserver = new Observer<void>();

  constructor() {
    super({ classNames: [styles.gameButtons, gameButtonStyles.buttons] });
    this.buttons = {
      [ButtonName.check]: (this.checkButton = button(
        {
          classNames: [
            buttonStyles.button,
            buttonStyles.buttonHasIcon,
            gameButtonStyles.buttons__check,
            gameButtonStyles.gameButton,
          ],
          disabled: true,
          onclick: () => this.observer.notify(),
        },
        span({ className: gameButtonStyles.gameButtonText, txt: 'Check' }),
        span({ classNames: [gameButtonStyles.gameButtonIcon, iconStyles.icon, iconStyles.iconCheck] }),
      )),

      [ButtonName.continue]: (this.continueButton = button(
        {
          classNames: [
            buttonStyles.button,
            buttonStyles.buttonHasIcon,
            gameButtonStyles.buttons__continue,
            gameButtonStyles.gameButton,
            gameButtonStyles.gameButtonHidden,
          ],
          onclick: () => this.observer.notify(),
        },
        span({ className: gameButtonStyles.gameButtonText, txt: 'Continue' }),
        span({ classNames: [gameButtonStyles.gameButtonIcon, iconStyles.icon, iconStyles.iconContinue] }),
      )),

      [ButtonName.complete]: (this.completeButton = button({
        classNames: [buttonStyles.button, gameButtonStyles.buttons__complete, gameButtonStyles.gameButtonComplete],
        txt: 'Complete',
        onclick: () => {
          this.competeObserver.notify();
        },
      })),

      [ButtonName.statistics]: (this.statisticsButton = button({
        classNames: [
          buttonStyles.button,
          gameButtonStyles.buttons__statistics,
          gameButtonStyles.gameButtonStatistics,
          gameButtonStyles.gameButtonHidden,
        ],
        txt: 'Results',
        onclick: () => {
          localStorageService.getData('userStatistics');
          router.navigateTo(PagesId.statistics);
        },
      })),
    };

    this.appendChildren([this.buttons.Check, this.buttons.Complete]);
  }

  public transformButton(from: ButtonName, to: ButtonName) {
    this.buttons[from].toggleClass(gameButtonStyles.gameButtonHidden);
    setTimeout(() => {
      this.buttons[from].getNode().remove();
      this.append(this.buttons[to]);
      setTimeout(() => {
        this.buttons[to].toggleClass(gameButtonStyles.gameButtonHidden);
      }, 20);
    }, ANIMATION_DURATION);
  }
}
