import Observer from '../../core/observer/Observer';
import ObserverEvents from '../../core/observer/types';
import Router from '../../core/router/Router';
import StorageService from '../../core/sessionStorage/SessionStorageService';
import { loginUser } from '../../core/socket/actions/user-actions';
import WebSocketService from '../../core/socket/model/WebSocketService';
import LoginPageModel from '../../pages/LoginPage/model/LoginPageModel';
import MainPageModel from '../../pages/MainPage/model/MainPageModel';
import PAGES from '../../pages/types';
import AppView from '../view/AppView';

export default class AppModel {
  private view: AppView;

  private root: HTMLElement;

  private router: Router = new Router();

  private observer = Observer.getInstance();

  private sessionStorageService = StorageService.getInstance();

  private socket = WebSocketService.getInstance();

  constructor() {
    this.view = new AppView();
    this.root = this.getHTML();
    this.checkConnection();
    console.log(
      'Привет, если есть возможность, можешь проверить позже, активно дорабатываю всё что не успел. Можешь связаться со мной в Discord (@prakapro), затягивать не буду',
    );
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }

  private checkConnection() {
    this.observer.subscribe(ObserverEvents.socketOpen, () => {
      // TODO: add reconnection to server modal window
      this.initPages();
    });
  }

  private initPages() {
    const loginPage = new LoginPageModel(this.router);
    const mainPage = new MainPageModel(this.router);

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
    ];

    this.router.setRoutes(routes);

    if (this.checkAuth()) {
      this.router.navigateTo(PAGES.MAIN);
    } else {
      this.router.navigateTo(PAGES.LOGIN);
    }
  }

  private checkAuth(): boolean {
    const user = this.sessionStorageService.getData('user');
    if (user) {
      this.socket.sendMessage(loginUser(user));
    }
    return !!user;
  }
}
