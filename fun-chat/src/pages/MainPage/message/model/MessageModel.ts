import { Message } from '../../../../core/socket/types';
import MessageView from '../view/MessageView';

export default class MessageModel {
  private message: Message;

  private view: MessageView;

  constructor(message: Message) {
    this.message = message;
    this.view = new MessageView(this.message);
  }

  public getMessageElement() {
    return this.view.getMessage();
  }
}
