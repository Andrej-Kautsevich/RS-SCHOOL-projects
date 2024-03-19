import { BaseComponent } from '../../../BaseComponent';
import { button, span } from '../../../tags';
import styles from './backgroundHint.module.scss';
import iconStyles from '../../../../styles/icons.module.scss';
import { Observer } from '../../../../utils/Observer';
import { user } from '../../../../models/User';

export default class BackgroundHint extends BaseComponent {
  private hintButton: BaseComponent<HTMLButtonElement>;

  public backgroundHintActive: boolean = true;

  public backgroundHintObserver = new Observer<boolean>();

  constructor() {
    super({ classNames: [styles.backgroundHint] });

    this.hintButton = button(
      { classNames: [styles.backgroundHint__button] },
      span({ classNames: [iconStyles.icon, iconStyles.icon_image] }),
    );
    this.hintButton.addListener('click', this.toggleHint.bind(this));

    this.appendChildren([this.hintButton]);

    if (!user.getSettings()?.backgroundHint) {
      this.backgroundHintActive = true;
      this.toggleHint();
    }
  }

  private toggleHint() {
    this.backgroundHintActive = !this.backgroundHintActive;
    this.hintButton.toggleClass(styles.backgroundHint__button_disable);
    this.backgroundHintObserver.notify(this.backgroundHintActive);
    user.setSettings('backgroundHint', this.backgroundHintActive);
  }
}
