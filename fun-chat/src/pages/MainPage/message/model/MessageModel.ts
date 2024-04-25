import Observer from '../../../../core/observer/Observer';
import ObserverEvents from '../../../../core/observer/types';
import { deleteMessage } from '../../../../core/socket/actions/user-actions';
import WebSocketService from '../../../../core/socket/model/WebSocketService';
import { Message } from '../../../../core/socket/types';
import MessageView from '../view/MessageView';

export default class MessageModel {
  private message: Message;

  private view: MessageView;

  private socket = WebSocketService.getInstance();

  private observer = Observer.getInstance();

  constructor(message: Message) {
    this.message = message;
    this.view = new MessageView(this.message);
    this.init();
  }

  public getMessageElement() {
    return this.view.getMessage();
  }

  public getMessage() {
    return this.message;
  }

  private handleDelete() {
    this.socket.sendMessage(deleteMessage(this.message));
    this.view.getMessage().destroy();
  }

  private handleEdit() {
    this.observer.notify(ObserverEvents.openMessageEdit, this.message.id);
  }

  private init() {
    const messageContext = this.view.getMessageContext();
    const messageWrapper = this.view.getMessage();
    const deleteButton = this.view.getDeleteButton();
    const editButton = this.view.getEditButton();

    messageWrapper.addListener('contextmenu', (event: Event) => {
      event.preventDefault();
      this.view.toggleContextVisibility();
    });

    messageContext.addListener('mouseleave', () => this.view.toggleContextVisibility());
    deleteButton.addListener('click', () => this.handleDelete());
    editButton.addListener('click', () => this.handleEdit());
  }
}
