import { BaseComponent } from '../../BaseComponent';
import { button, span } from '../../tags';
import styles from '../MainGamePage.module.scss';
import gameButtonStyles from './GameButton.module.scss';
import buttonStyles from '../../../styles/button.module.scss';
import iconStyles from '../../../styles/icons.module.scss';
import { Observer } from '../../../utils/Observer';

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
      span({ className: gameButtonStyles.gameButtonText, txt: 'Continue' }),
      span({ classNames: [gameButtonStyles.gameButtonIcon, iconStyles.icon, iconStyles.iconContinue] }),
    );
    this.continueButton.getNode().addEventListener('click', () => {
      this.observer.notify();
      this.continueButton.setAttribute('disabled', 'true');
    });
    this.appendChildren([this.continueButton]);
  }

  public getContinueButton() {
    return this.continueButton;
  }
}
