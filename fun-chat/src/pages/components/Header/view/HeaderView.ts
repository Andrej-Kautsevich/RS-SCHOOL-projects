import { BaseComponent } from '../../../../utils/BaseComponent';
import { button, div, h, header, span } from '../../../../utils/tags';
import styles from './HeaderView.module.scss';
import buttonStyles from '../../../../styles/button.module.scss';

export default class HeaderView {
  private header: BaseComponent;

  private userLogin: BaseComponent<HTMLSpanElement>;

  public logoutButton: BaseComponent<HTMLButtonElement>;

  public aboutPageButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.userLogin = span({ className: styles.header__user });
    const appName = h(1, { className: styles.header__heading, txt: 'Fun Chat' });
    const contentWrapper = div({ className: styles.header__content }, appName, this.userLogin);

    this.logoutButton = this.createLogoutButton();
    this.aboutPageButton = this.createAboutPageButton();

    const buttons = div({ className: styles.header__buttons }, this.logoutButton, this.aboutPageButton);

    this.header = header({ className: styles.header }, contentWrapper, buttons);
  }

  public getHeader() {
    return this.header;
  }

  public setUser(user: string) {
    this.userLogin.setTextContent(`Hello, ${user}!`);
  }

  private createLogoutButton() {
    this.logoutButton = button({ classNames: [buttonStyles.button, styles.button], txt: 'Logout' });
    return this.logoutButton;
  }

  private createAboutPageButton() {
    this.aboutPageButton = button({ classNames: [buttonStyles.button, styles.button], txt: 'About' });
    return this.aboutPageButton;
  }
}
