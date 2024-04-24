import Observer from '../../../core/observer/Observer';
import ObserverEvents from '../../../core/observer/types';
import Router from '../../../core/router/Router';
import StorageService from '../../../core/sessionStorage/SessionStorageService';
import { AppError, User } from '../../../core/socket/types';
import { setCurrentUser } from '../../../core/store/actions';
import storeModel from '../../../core/store/StoreModel';
import isFromServerMessage from '../../../utils/isFromServerMessage';
import PAGES from '../../types';
import LoginFormModel from '../loginForm/model/LoginFormModel';
import LoginPageView from '../view/LoginPageView';

export default class LoginPageModel {
  private view: LoginPageView;

  private loginForm: LoginFormModel;

  private router: Router;

  private observer = Observer.getInstance();

  private sessionStorageService = StorageService.getInstance();

  constructor(router: Router) {
    this.router = router;
    this.loginForm = new LoginFormModel();
    this.view = new LoginPageView(this.loginForm);

    this.setUserLoginHandler();
  }

  public openPage(root: HTMLElement) {
    const user = this.sessionStorageService.getData('user');
    if (user) {
      this.router.navigateTo(PAGES.MAIN);
    } else {
      root.append(this.getPage());
    }
  }

  public getPage() {
    return this.view.getPage();
  }

  private setUserLoginHandler() {
    this.observer.subscribe(ObserverEvents.loginResponse, (message) => {
      const serverMessage = isFromServerMessage(message);
      if (serverMessage) {
        if (serverMessage.type === AppError.ERROR) {
          this.showErrorMessage(serverMessage.payload?.error ?? 'Server error, please try later');
          return;
        }

        if (serverMessage.payload?.user) {
          this.handleSuccessLogin(serverMessage.payload.user);
        }
      }
    });
  }

  private showErrorMessage(message: string) {
    this.view.showError(message);
  }

  private handleSuccessLogin(user: User) {
    this.router.navigateTo(PAGES.MAIN);
    storeModel.dispatch(setCurrentUser(user));
  }
}
