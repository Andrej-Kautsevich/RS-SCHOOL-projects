import Observer from '../../core/observer/Observer';
import ObserverEvents from '../../core/observer/types';
import Router from '../../core/router/Router';
import StorageService from '../../core/sessionStorage/SessionStorageService';
import { loginUser } from '../../core/socket/actions/user-actions';
import WebSocketService from '../../core/socket/model/WebSocketService';
import AboutPageModel from '../../pages/AboutPage/model/AboutPageModel';
import ConnectionWaiterModel from '../../pages/components/Connection-waiter/model/ConnectionWaiterModel';
import LoginPageModel from '../../pages/LoginPage/model/LoginPageModel';
import MainPageModel from '../../pages/MainPage/model/MainPageModel';
import PAGES from '../../pages/types';
import AppView from '../view/AppView';

export default class AppModel {
  private view: AppView;

  private root: HTMLElement;

  private waiter: ConnectionWaiterModel;

  private router: Router = new Router();

  private observer = Observer.getInstance();

  private sessionStorageService = StorageService.getInstance();

  private socket = WebSocketService.getInstance();

  constructor() {
    this.view = new AppView();
    this.root = this.getHTML();
    this.waiter = new ConnectionWaiterModel(this.root);
    this.setConnectionWaiter();
    this.initPages();
    console.log(
      'Привет, если есть возможность, можешь проверить позже, активно дорабатываю всё что не успел. Можешь связаться со мной в Discord (@prakapro), затягивать не буду',
    );
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }

  private initPages() {
    const loginPage = new LoginPageModel(this.router);
    const mainPage = new MainPageModel(this.router);
    const aboutPage = new AboutPageModel();

    const routes = [
      {
        path: PAGES.LOGIN,
        callback: () => {
          this.root.innerHTML = '';
          loginPage.openPage(this.root);
        },
      },
      {
        path: PAGES.MAIN,
        callback: () => {
          this.root.innerHTML = '';
          mainPage.openPage(this.root);
        },
      },
      {
        path: PAGES.ABOUT,
        callback: () => {
          this.root.innerHTML = '';
          aboutPage.openPage(this.root);
        },
      },
    ];

    this.router.setRoutes(routes);
  }

  private checkAuth(): boolean {
    const user = this.sessionStorageService.getData('user');
    if (user) {
      this.socket.sendMessage(loginUser(user));
    }
    return !!user;
  }

  private redirectUser() {
    if (this.checkAuth()) {
      this.router.navigateTo(PAGES.MAIN);
    } else {
      this.router.navigateTo(PAGES.LOGIN);
    }
  }

  private setConnectionWaiter() {
    this.observer.subscribe(ObserverEvents.socketOpen, () => {
      this.waiter.hideWaiter();
      this.redirectUser();
    });
    this.observer.subscribe(ObserverEvents.socketClose, () => this.waiter.showWaiter());
  }
}
