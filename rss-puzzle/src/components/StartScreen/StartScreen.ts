import { BaseComponent } from '../BaseComponent';
import { localStorageService } from '../services/LocalStorageService';
import { h, p } from '../tags';
import styles from './StartScreen.module.scss';

export default class StartScreen extends BaseComponent {
  private userGreeting: BaseComponent<HTMLHeadingElement>;

  constructor() {
    super({ className: styles.start });

    this.userGreeting = h(2, { className: styles.startGreeting });
    this.updateUserName();

    this.appendChildren([
      h(1, { className: styles.startTitle, txt: 'RSS Puzzle' }),
      this.userGreeting,
      p({
        className: styles.startDescription,
        txt: 'RSS Puzzle is an interactive mini-game aimed at enhancing English language skills. Assemble sentences to reveal parts of an artwork puzzle. Toggle hints for enhanced gameplay experience',
      }),
    ]);
  }

  public updateUserName() {
    const firstName = localStorageService.getData('login')?.firstName;
    const surname = localStorageService.getData('login')?.surname;
    const greeting = `Hello, ${firstName} ${surname}`;
    this.userGreeting.setTextContent(greeting);
  }
}
