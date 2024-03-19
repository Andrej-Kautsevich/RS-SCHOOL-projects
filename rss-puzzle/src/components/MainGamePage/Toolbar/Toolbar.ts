import { BaseComponent } from '../../BaseComponent';
import { div } from '../../tags';
import BackgroundHint from './BackgroundHint/BackgroundHint';
import Hint from './Hint/Hint';
import LevelSwitch from './LevelSwitch/LevelSwitch';
import Pronunciation from './Pronunciation/Pronunciation';
import styles from './toolbar.module.scss';

export default class Toolbar extends BaseComponent {
  public hint: Hint;

  public pronunciation: Pronunciation;

  public backgroundHint: BackgroundHint;

  private tools: BaseComponent;

  public switcher: LevelSwitch;

  constructor() {
    super({ className: styles.toolbar });
    this.hint = new Hint();
    this.pronunciation = new Pronunciation();
    this.backgroundHint = new BackgroundHint();
    this.switcher = new LevelSwitch();

    this.tools = div({ className: styles.toolbar__tools });
    this.tools.appendChildren([this.pronunciation, this.backgroundHint]);

    this.appendChildren([this.switcher, this.tools, this.hint]);
  }
}
