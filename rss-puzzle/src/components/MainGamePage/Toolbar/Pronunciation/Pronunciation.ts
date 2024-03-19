import { BaseComponent } from '../../../BaseComponent';
import { button, input, label, span } from '../../../tags';
import styles from './pronunciation.module.scss';
import iconStyles from '../../../../styles/icons.module.scss';
import { user } from '../../../../models/User';

export default class Pronunciation extends BaseComponent {
  public hintButton: BaseComponent<HTMLButtonElement>;

  private hintIcon: BaseComponent<HTMLSpanElement>;

  private hintToggleButton: BaseComponent<HTMLInputElement>;

  public hint: HTMLAudioElement | null = null;

  public pronunciationHintActive: boolean = true;

  constructor() {
    super({ classNames: [styles.pronunciation] });

    this.hintIcon = span({ classNames: [iconStyles.icon, iconStyles.icon_sound] });
    this.hintButton = button(
      {
        classNames: [styles.pronunciation__button, styles.pronunciation__button_visible],
        onclick: () => this.playAudio(),
      },
      this.hintIcon,
    );

    this.hintToggleButton = input({
      classNames: [styles.pronunciation__toggleButton],
      type: 'checkbox',
      id: 'pronunciation',
      name: 'pronunciation',
      checked: true,
      onclick: () => this.toggleHint(),
    });

    this.appendChildren([
      this.hintButton,
      this.hintToggleButton,
      label({ className: styles.pronunciation__label, htmlFor: 'pronunciation', txt: 'Show pronunciation hint' }),
    ]);

    if (!user.getSettings()?.pronunciationHint) {
      this.hintToggleButton.getNode().checked = false;
      this.toggleHint();
    }
  }

  public addAudio(audioSrc: string) {
    this.hint = new Audio(`./${audioSrc}`);
    this.hint.onplay = () => this.hintIcon.toggleClass(iconStyles.icon_pulsate);
    this.hint.onended = () => this.hintIcon.toggleClass(iconStyles.icon_pulsate);
  }

  private playAudio() {
    if (this.hint) {
      this.hint.play();
    }
  }

  private toggleHint() {
    this.pronunciationHintActive = !this.pronunciationHintActive;
    user.setSettings('pronunciationHint', this.pronunciationHintActive);
    this.showHint();
  }

  public showHint() {
    this.hintButton.toggleClass(styles.pronunciation__button_visible);
  }
}
