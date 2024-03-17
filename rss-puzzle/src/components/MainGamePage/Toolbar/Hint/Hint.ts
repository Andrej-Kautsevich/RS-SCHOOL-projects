import { BaseComponent } from '../../../BaseComponent';
import { button, span } from '../../../tags';
import styles from './hint.module.scss';
import iconStyles from '../../../../styles/icons.module.scss';

export default class Hint extends BaseComponent {
  private hintButton: BaseComponent<HTMLButtonElement>;

  private hintLine: BaseComponent<HTMLSpanElement>;

  constructor() {
    super({ classNames: [styles.hint] });

    this.hintButton = button(
      { classNames: [styles.hint__button] },
      span({ classNames: [iconStyles.icon, iconStyles.icon_hint] }),
    );
    this.hintLine = span({ classNames: [styles.hint__line] });

    this.appendChildren([this.hintButton, this.hintLine]);
  }

  public addHint(hint: string) {
    this.hintLine.setTextContent(hint);
  }
}
