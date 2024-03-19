import { BaseComponent } from '../../../BaseComponent';
import { button, span } from '../../../tags';
import styles from './backgroundHint.module.scss';
import iconStyles from '../../../../styles/icons.module.scss';
import { Observer } from '../../../../utils/Observer';

export default class BackgroundHint extends BaseComponent {
  private hintButton: BaseComponent<HTMLButtonElement>;

  public backgroundHintActive: boolean = false;

  public backgroundHintObserver = new Observer<boolean>();

  constructor() {
    super({ classNames: [styles.backgroundHint] });

    this.hintButton = button(
      { classNames: [styles.backgroundHint__button, styles.backgroundHint__button_disable] },
      span({ classNames: [iconStyles.icon, iconStyles.icon_image] }),
    );
    this.hintButton.addListener('click', this.toggleHint.bind(this));

    this.appendChildren([this.hintButton]);
  }

  private toggleHint() {
    this.backgroundHintActive = !this.backgroundHintActive;
    this.hintButton.toggleClass(styles.backgroundHint__button_disable);
    this.backgroundHintObserver.notify(this.backgroundHintActive);
  }
}
