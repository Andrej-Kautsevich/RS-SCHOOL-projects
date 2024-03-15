import { BaseComponent } from '../BaseComponent';
import { h, p } from '../tags';
import styles from './StartScreen.module.scss';

export default class StartScreen extends BaseComponent {
  constructor() {
    super({ className: styles.start });

    this.appendChildren([
      h(1, { className: styles.startTitle, txt: 'RSS Puzzle' }),
      h(2, { className: styles.startGreeting, txt: 'Hello!' }),
      p({
        className: styles.startDescription,
        txt: 'RSS Puzzle is an interactive mini-game aimed at enhancing English language skills. Assemble sentences to reveal parts of an artwork puzzle. Toggle hints for enhanced gameplay experience',
      }),
    ]);
  }
}
