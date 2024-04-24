import { Message } from '../../../../core/socket/types';
import storeModel from '../../../../core/store/StoreModel';
import { BaseComponent } from '../../../../utils/BaseComponent';
import dateFormat from '../../../../utils/dateFormate';
import { div, span } from '../../../../utils/tags';
import styles from './MessageView.module.scss';

export default class MessageView {
  private messageElement: BaseComponent;

  private message: Message;

  private messageText: BaseComponent;

  private messageDate: BaseComponent;

  private messageLogin: BaseComponent;

  private messageStatus: BaseComponent;

  private messageEdited: BaseComponent;

  constructor(message: Message) {
    this.message = message;

    this.messageText = this.createMessageText();
    this.messageDate = this.createMessageDate();
    this.messageLogin = this.createMessageLogin();
    this.messageStatus = this.createMessageStatus();
    this.messageEdited = this.createMessageEdited();
    this.messageElement = this.createMessageElement();
  }

  public getMessage() {
    return this.messageElement;
  }

  private createMessageText() {
    return div({ className: styles.message__text, txt: this.message.text });
  }

  private createMessageDate() {
    const date = dateFormat(this.message.datetime);
    return span({ className: styles.message__date, txt: date });
  }

  private createMessageLogin() {
    const { currentUser } = storeModel.getState();
    const login = currentUser?.login === this.message.from ? 'You' : this.message.from;
    return span({ className: styles.message__login, txt: login });
  }

  private createMessageStatus() {
    const { isDelivered, isReaded } = this.message.status;
    let status;
    if (isDelivered) status = 'delivered';
    if (isReaded) status = 'reded';
    return span({ className: styles.message__status, txt: status });
  }

  private createMessageEdited() {
    const status = this.message.status.isEdited ? 'edited' : '';
    return span({ className: styles.message__status, txt: status });
  }

  private createMessageElement() {
    const messageElement = div({ className: styles.message });
    const messageInfo = div({ className: styles.message__info }, this.messageLogin, this.messageDate);
    const messageState = div({ className: styles.message__state }, this.messageEdited, this.messageStatus);

    messageElement.appendChildren([messageInfo, this.messageText]);

    const { currentUser } = storeModel.getState();

    if (currentUser?.login === this.message.from) {
      messageElement.append(messageState);
      messageElement.addClasses([styles.message_from]);
    } else messageElement.addClasses([styles.message_to]);

    return messageElement;
  }
}
