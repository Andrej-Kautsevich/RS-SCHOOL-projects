import Observer from '../../observer/Observer';
import ObserverEvents from '../../observer/types';
import { API_URL, AppError, ServerMessage, UserActions } from '../types';

export default class WebSocketService {
  private observer = Observer.getInstance();

  private static instance: WebSocketService;

  private connection: WebSocket | null = null;

  // private isOpen = false;

  constructor() {
    if (this.connection === null) {
      this.connectSocket();
    }
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }

    return WebSocketService.instance;
  }

  public sendMessage(message: ServerMessage): boolean {
    if (this.connection !== null && this.connection.OPEN) {
      this.connection.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  private connectSocket() {
    this.connection = new WebSocket(API_URL);
    this.connection.onopen = () => {
      // this.isOpen = true;
      this.observer.notify(ObserverEvents.socketOpen, '');
      this.setListeners();
    };
  }

  private setListeners() {
    this.connection?.addEventListener('message', (messageEvent: MessageEvent) => {
      const message: ServerMessage = JSON.parse(messageEvent.data);

      this.handleServerResponse(message);
    });
  }

  private handleServerResponse(message: ServerMessage) {
    if ('type' in message && 'payload' in message) {
      this.handleAuthentication(message);
    } else {
      throw new Error(`Unknown server response: ${message}`);
    }
  }

  private handleAuthentication(message: ServerMessage) {
    switch (message.type) {
      case AppError.ERROR: {
        this.observer.notify(ObserverEvents.loginResponse, message);
        this.observer.notify(ObserverEvents.logoutResponse, message);
        break;
      }
      case UserActions.LOGIN: {
        this.observer.notify(ObserverEvents.loginResponse, message);
        break;
      }
      case UserActions.LOGOUT: {
        this.observer.notify(ObserverEvents.logoutResponse, message);
        break;
      }
      default:
        this.handleExternalAuthentication(message);
    }
  }

  private handleExternalAuthentication(message: ServerMessage) {
    switch (message.type) {
      case UserActions.LOGIN_EXTERNAL: {
        this.observer.notify(ObserverEvents.externalLoginResponse, message);
        break;
      }
      case UserActions.LOGOUT_EXTERNAL: {
        this.observer.notify(ObserverEvents.externalLogoutResponse, message);
        break;
      }
      default:
        this.handleGetUsers(message);
    }
  }

  private handleGetUsers(message: ServerMessage) {
    switch (message.type) {
      case UserActions.ALL_ACTIVE: {
        this.observer.notify(ObserverEvents.allActiveUsers, message);
        break;
      }
      case UserActions.ALL_INACTIVE: {
        this.observer.notify(ObserverEvents.allInactiveUsers, message);
        break;
      }
      default:
        this.handleMessages(message);
    }
  }

  private handleMessages(message: ServerMessage) {
    switch (message.type) {
      case UserActions.MESSAGE_HISTORY: {
        this.observer.notify(ObserverEvents.messageHistory, message);
        break;
      }
      case UserActions.MESSAGE_SEND: {
        this.observer.notify(ObserverEvents.messageSend, message);
        break;
      }
      default:
    }
  }
}
