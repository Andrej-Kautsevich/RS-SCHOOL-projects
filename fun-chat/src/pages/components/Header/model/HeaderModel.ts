import Observer from '../../../../core/observer/Observer';
import ObserverEvents from '../../../../core/observer/types';
import Router from '../../../../core/router/Router';
import StorageService from '../../../../core/sessionStorage/SessionStorageService';
import { logoutUser } from '../../../../core/socket/actions/user-actions';
import WebSocketService from '../../../../core/socket/model/WebSocketService';
import { AppError, ServerMessage } from '../../../../core/socket/types';
import generateId from '../../../../core/socket/utils/idGenerator';
import isFromServerMessage from '../../../../utils/isFromServerMessage';
import PAGES from '../../../types';
import HeaderView from '../view/HeaderView';

export default class HeaderModel {
  private router: Router;

  private observer = Observer.getInstance();

  private socket = WebSocketService.getInstance();

  private sessionStorageService = StorageService.getInstance();

  private view: HeaderView;

  constructor(router: Router) {
    this.router = router;
    this.view = new HeaderView();
    this.init();
  }

  public getHeader() {
    return this.view.getHeader();
  }

  private setUser() {
    const user = this.sessionStorageService.getData('user');
    if (user) {
      this.view.setUser(user.login);
    }
  }

  private init() {
    this.setUser();
    this.observer.subscribe(ObserverEvents.loginResponse, () => this.setUser());
    this.setLogoutButtonHandler();
  }

  private setLogoutButtonHandler() {
    this.view.logoutButton.addListener('click', () => this.logoutButtonHandler());
  }

  private logoutButtonHandler() {
    const user = this.sessionStorageService.getData('user');
    if (!user) return;

    const id = generateId();
    this.socket.sendMessage(logoutUser(id, user));
    this.observer.subscribe(ObserverEvents.logoutResponse, (message) => {
      const serverMessage = isFromServerMessage(message);
      if (serverMessage && serverMessage.id === id) {
        this.logoutHandler(serverMessage);
      }
    });
  }

  private logoutHandler(serverMessage: ServerMessage) {
    if (serverMessage.type === AppError.ERROR) {
      throw new Error(`Server error: ${serverMessage.payload?.error}`);
    }
    if (serverMessage.payload?.user?.isLogined === false) {
      this.sessionStorageService.removeData('user');
      this.router.navigateTo(PAGES.LOGIN);
    }
  }
}
