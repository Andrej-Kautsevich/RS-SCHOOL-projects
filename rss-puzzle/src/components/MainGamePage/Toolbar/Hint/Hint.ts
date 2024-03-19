import { BaseComponent } from '../../../BaseComponent';
import { button, span } from '../../../tags';
import styles from './hint.module.scss';
import iconStyles from '../../../../styles/icons.module.scss';
import { user } from '../../../../models/User';

export default class Hint extends BaseComponent {
  private hintButton: BaseComponent<HTMLButtonElement>;

  private hintLine: BaseComponent<HTMLSpanElement>;

  public translateHintActive: boolean = true;

  constructor() {
    super({ classNames: [styles.hint] });

    this.hintButton = button(
      { classNames: [styles.hint__button, styles.hint__button_active] },
      span({ classNames: [iconStyles.icon, iconStyles.icon_hint] }),
    );
    this.hintButton.addListener('click', this.toggleHint.bind(this));
    this.hintLine = span({ classNames: [styles.hint__line] });

    this.appendChildren([this.hintButton, this.hintLine]);

    if (!user.getSettings()?.translateHint) {
      this.toggleHint();
    }
  }

  public addHint(hint: string) {
    this.hintLine.setTextContent(hint);
  }

  private toggleHint() {
    this.hintButton.toggleClass(styles.hint__button_active);
    this.translateHintActive = !this.translateHintActive;
    user.setSettings('translateHint', this.translateHintActive);
  }
}
