import { BaseComponent } from '../../../BaseComponent';
import { button, span } from '../../../tags';
import styles from './pronunciation.module.scss';
import iconStyles from '../../../../styles/icons.module.scss';

export default class Pronunciation extends BaseComponent {
  private hintButton: BaseComponent<HTMLButtonElement>;

  private hintIcon: BaseComponent<HTMLSpanElement>;

  public hint: HTMLAudioElement | null = null;

  constructor() {
    super({ classNames: [styles.pronunciation] });

    this.hintIcon = span({ classNames: [iconStyles.icon, iconStyles.icon_sound] });
    this.hintButton = button(
      { classNames: [styles.pronunciation__button], onclick: () => this.playAudio() },
      this.hintIcon,
    );

    this.appendChildren([this.hintButton]);
  }

  public addAudio(audioSrc: string) {
    this.hint = new Audio(`/${audioSrc}`);
    this.hint.onplay = () => this.hintIcon.toggleClass(iconStyles.icon_pulsate);
    this.hint.onended = () => this.hintIcon.toggleClass(iconStyles.icon_pulsate);
  }

  private playAudio() {
    if (this.hint) {
      this.hint.play();
    }
  }
}
