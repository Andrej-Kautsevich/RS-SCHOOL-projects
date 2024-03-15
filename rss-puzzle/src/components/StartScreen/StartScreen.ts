import { BaseComponent } from '../BaseComponent';
import { localStorageService } from '../services/LocalStorageService';
import { button, h, p, span } from '../tags';
import styles from './StartScreen.module.scss';
import buttonStyles from '../../styles/button.module.scss';
import iconStyles from '../../styles/icons.module.scss';
import { user } from '../../models/User';
import { router } from '../services/RouterService';
import { PagesId } from '../types';

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
      button(
        {
          classNames: [styles.start__button, buttonStyles.button, buttonStyles.buttonHasIcon],
          onclick() {
            user.deleteUser();
            router.navigateTo(PagesId.login);
          },
        },
        span({ className: styles.startButtonText, txt: 'Log out' }),
        span({ classNames: [styles.startButtonIcon, iconStyles.icon, iconStyles.iconLogout] }),
      ),
    ]);
  }

  public updateUserName() {
    const firstName = localStorageService.getData('login')?.firstName;
    const surname = localStorageService.getData('login')?.surname;
    const greeting = `Hello, ${firstName} ${surname}`;
    this.userGreeting.setTextContent(greeting);
  }
}
