import { BaseComponent } from '../../BaseComponent';
import Hint from './Hint/Hint';
import styles from './toolbar.module.scss';

export default class Toolbar extends BaseComponent {
  public hint: Hint;

  constructor() {
    super({ className: styles.toolbar });
    this.hint = new Hint();

    this.appendChildren([this.hint]);
  }
}
