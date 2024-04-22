import { BaseComponent } from '../../../utils/BaseComponent';
import { div, span } from '../../../utils/tags';
import LoginFormModel from '../loginForm/model/LoginFormModel';
import ERROR_ANIMATION from '../types';
import styles from './loginPageView.module.scss';

export default class LoginPageView {
  private page: BaseComponent;

  private errorWrapper: BaseComponent;

  private errorMessage: BaseComponent<HTMLSpanElement>;

  constructor(loginForm: LoginFormModel) {
    this.page = div({ classNames: [styles.loginPage] });
    this.errorMessage = span({ className: styles.error__text });
    this.errorWrapper = div({ className: styles.error }, this.errorMessage);

    this.page.appendChildren([loginForm.getForm(), this.errorWrapper]);
  }

  public getPage() {
    return this.page.getNode();
  }

  public showError(error: string) {
    this.errorMessage.setTextContent(error);
    this.errorWrapper.getNode().animate(ERROR_ANIMATION.keyFrames, { duration: ERROR_ANIMATION.duration });
  }
}
