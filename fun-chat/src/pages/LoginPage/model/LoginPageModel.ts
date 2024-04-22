import Observer from '../../../core/observer/Observer';
import ObserverEvents from '../../../core/observer/types';
import Router from '../../../core/router/Router';
import { AppError } from '../../../core/socket/types';
import isFromServerMessage from '../../../utils/isFromServerMessage';
import PAGES from '../../types';
import LoginFormModel from '../loginForm/model/LoginFormModel';
import LoginPageView from '../view/LoginPageView';

export default class LoginPageModel {
  private view: LoginPageView;

  private loginForm: LoginFormModel;

  private router: Router;

  private observer = Observer.getInstance();

  constructor(router: Router) {
    this.router = router;
    this.loginForm = new LoginFormModel();
    this.view = new LoginPageView(this.loginForm);

    this.handleUserLogin();
  }

  public getPage() {
    return this.view.getPage();
  }

  private handleUserLogin() {
    this.observer.subscribe(ObserverEvents.loginResponse, (message) => {
      const serverMessage = isFromServerMessage(message);
      if (serverMessage) {
        if (serverMessage.type === AppError.ERROR) {
          this.showErrorMessage(serverMessage.payload.error ?? 'Server error, please try later');
          return;
        }
        this.handleSuccessLogin();
      }
    });
  }

  private showErrorMessage(message: string) {
    this.view.showError(message);
  }

  private handleSuccessLogin() {
    this.router.navigateTo(PAGES.MAIN);
  }
}
