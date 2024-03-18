import { BaseComponent } from '../../../BaseComponent';
import { button, span } from '../../../tags';
import styles from './pronunciation.module.scss';
import iconStyles from '../../../../styles/icons.module.scss';

export default class Pronunciation extends BaseComponent {
  private hintButton: BaseComponent<HTMLButtonElement>;

  public hint: HTMLAudioElement | null = null;

  constructor() {
    super({ classNames: [styles.pronunciation] });

    this.hintButton = button(
      { classNames: [styles.pronunciation__button], onclick: () => this.playAudio() },
      span({ classNames: [iconStyles.icon, iconStyles.icon_sound] }),
    );

    this.appendChildren([this.hintButton]);
  }

  public addAudio(audioSrc: string) {
    this.hint = new Audio(`/${audioSrc}`);
  }

  private playAudio() {
    if (this.hint) {
      this.hint.play();
    }
  }
}
