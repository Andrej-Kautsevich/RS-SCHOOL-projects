import { BaseComponent } from '../../BaseComponent';
import { button, span } from '../../tags';
import styles from '../MainGamePage.module.scss';
import gameButtonStyles from './GameButton.module.scss';
import buttonStyles from '../../../styles/button.module.scss';
import iconStyles from '../../../styles/icons.module.scss';
import { Observer } from '../../../utils/Observer';
import ButtonState from './types';

export default class GameButtons extends BaseComponent {
  private continueButton: BaseComponent<HTMLButtonElement>;

  public observer = new Observer<void>();

  constructor() {
    super({ className: styles.gameButtons });
    this.continueButton = button(
      {
        classNames: [buttonStyles.button, buttonStyles.buttonHasIcon, gameButtonStyles.gameButton],
        disabled: true,
      },
      span({ className: gameButtonStyles.gameButtonText, txt: ButtonState.check }),
      span({ classNames: [gameButtonStyles.gameButtonIcon, iconStyles.icon, iconStyles.iconCheck] }),
    );
    this.continueButton.getNode().addEventListener('click', () => {
      this.observer.notify();
    });
    this.appendChildren([this.continueButton]);
  }

  public getContinueButton() {
    return this.continueButton;
  }

  public transformButton(state: ButtonState) {
    const iconStyle = `icon${state}`;

    this.continueButton.destroyChildren();
    this.continueButton.appendChildren([
      span({ className: gameButtonStyles.gameButtonText, txt: state }),
      span({ classNames: [gameButtonStyles.gameButtonIcon, iconStyles.icon, iconStyles[iconStyle]] }),
    ]);

    if (state === ButtonState.continue) {
      this.continueButton.toggleClass(gameButtonStyles.gameButtonChecked);
    } else {
      this.continueButton.toggleClass(gameButtonStyles.gameButtonChecked, false);
    }
  }
}
