import { BaseComponent } from '../../../utils/BaseComponent';
import { button, div, span } from '../../../utils/tags';
import LoginFormModel from '../loginForm/model/LoginFormModel';
import ERROR_ANIMATION from '../types';
import styles from './loginPageView.module.scss';
import buttonStyles from '../../../styles/button.module.scss';

export default class LoginPageView {
  private page: BaseComponent;

  private errorWrapper: BaseComponent;

  private errorMessage: BaseComponent<HTMLSpanElement>;

  public aboutPageButton: BaseComponent<HTMLButtonElement>;

  constructor(loginForm: LoginFormModel) {
    this.page = div({ classNames: [styles.loginPage] });
    this.errorMessage = span({ className: styles.error__text });
    this.errorWrapper = div({ className: styles.error }, this.errorMessage);
    this.aboutPageButton = this.createAboutPageButton();

    this.page.appendChildren([loginForm.getForm(), this.aboutPageButton, this.errorWrapper]);
  }

  public getPage() {
    return this.page.getNode();
  }

  private createAboutPageButton() {
    this.aboutPageButton = button({ classNames: [buttonStyles.button, styles.button], txt: 'About' });
    return this.aboutPageButton;
  }

  public showError(error: string) {
    this.errorMessage.setTextContent(error);
    this.errorWrapper.getNode().animate(ERROR_ANIMATION.keyFrames, { duration: ERROR_ANIMATION.duration });
  }
}
