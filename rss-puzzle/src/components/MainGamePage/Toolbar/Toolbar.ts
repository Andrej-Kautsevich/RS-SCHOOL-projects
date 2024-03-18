import { BaseComponent } from '../../BaseComponent';
import { div } from '../../tags';
import Hint from './Hint/Hint';
import Pronunciation from './Pronunciation/Pronunciation';
import styles from './toolbar.module.scss';

export default class Toolbar extends BaseComponent {
  public hint: Hint;

  public pronunciation: Pronunciation;

  private tools: BaseComponent;

  constructor() {
    super({ className: styles.toolbar });
    this.hint = new Hint();
    this.pronunciation = new Pronunciation();

    this.tools = div({ className: styles.toolbar__tools });
    this.tools.appendChildren([this.pronunciation]);

    this.appendChildren([this.tools, this.hint]);
  }
}
