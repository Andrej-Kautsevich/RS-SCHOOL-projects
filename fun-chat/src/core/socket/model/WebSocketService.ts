import Observer from '../../observer/Observer';
import ObserverEvents from '../../observer/types';
import { API_URL, AppError, ServerMessage, UserActions } from '../types';

export default class WebSocketService {
  private observer = Observer.getInstance();

  private static instance: WebSocketService;

  private connection: WebSocket | null = null;

  constructor() {
    if (this.connection === null) {
      this.createSocket();
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

  private createSocket() {
    this.connection = new WebSocket(API_URL);
    this.connection.onopen = () => this.setListeners();
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
      case UserActions.LOGIN: {
        this.observer.notify(ObserverEvents.loginResponse, message);
        break;
      }
      case AppError.ERROR: {
        this.observer.notify(ObserverEvents.loginResponse, message);
        break;
      }
      case UserActions.LOGOUT: {
        // console.log('logout');
        break;
      }
      default:
    }
  }
}
