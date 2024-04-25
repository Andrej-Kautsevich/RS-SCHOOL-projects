import { BaseComponent } from '../../../../utils/BaseComponent';
import { button, div, form, span, textarea } from '../../../../utils/tags';
import styles from './DialogView.module.scss';
import buttonStyles from '../../../../styles/button.module.scss';
import { Message, User } from '../../../../core/socket/types';
import MessageModel from '../../message/model/MessageModel';
import storeModel from '../../../../core/store/StoreModel';

export default class DialogView {
  private dialogWindow: BaseComponent;

  private dialogUser: BaseComponent;

  private dialogMessagesArea: BaseComponent;

  private messageDivider: BaseComponent;

  private dialogForm: BaseComponent<HTMLFormElement>;

  private formInput: BaseComponent<HTMLTextAreaElement>;

  private formButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.dialogUser = div({ className: styles.dialog__user });
    this.dialogMessagesArea = div({
      classNames: [styles.dialog__messages, styles.dialog__messages_empty],
      txt: 'Select user to start messaging',
    });
    this.messageDivider = div({ className: styles.dialog__divider }, span({ txt: 'new unread messages' }));

    this.formInput = textarea({ className: styles.dialog__input, placeholder: 'Enter text here', disabled: true });
    this.formButton = button({
      classNames: [styles.dialog__button, buttonStyles.button],
      txt: 'Send',
      type: 'submit',
      disabled: true,
    });
    this.dialogForm = form({ className: styles.dialog__form }, this.formInput, this.formButton);

    this.dialogWindow = div({ className: styles.dialog }, this.dialogUser, this.dialogMessagesArea, this.dialogForm);
  }

  public getDialogWindow() {
    return this.dialogWindow;
  }

  public getDialogMessagesArea() {
    return this.dialogMessagesArea;
  }

  public getFormInput() {
    return this.formInput;
  }

  public getFormButton() {
    return this.formButton;
  }

  public getForm() {
    return this.dialogForm;
  }

  public drawMessages(messages?: Message[]) {
    this.dialogMessagesArea.getNode().innerHTML = '';

    let firstUnreadMessage: unknown = null;
    const { currentUser } = storeModel.getState();

    if (messages?.length) {
      this.dialogMessagesArea.removeClasses([styles.dialog__messages_empty]);
      messages.forEach((message) => {
        const messageElement = new MessageModel(message);
        this.dialogMessagesArea.append(messageElement.getMessageElement().getNode());
        if (!message.status.isReaded && !firstUnreadMessage && message.to === currentUser?.login) {
          firstUnreadMessage = messageElement;
        }
      });
      if (firstUnreadMessage instanceof MessageModel) {
        firstUnreadMessage.getMessageElement().getNode().before(this.messageDivider.getNode());
        this.messageDivider.getNode().scrollIntoView();
      } else {
        this.dialogMessagesArea.getNode().scrollTop = this.dialogMessagesArea.getNode().scrollHeight;
      }
    } else {
      this.dialogMessagesArea.append(div({ className: styles.dialog__empty, txt: 'Write your first message' }));
    }
  }

  public enableFormInput() {
    this.formInput.getNode().disabled = false;
  }

  public drawDialogTitle(user: User) {
    this.dialogUser.removeClasses([styles.dialog__user_active, styles.dialog__user_inactive]);

    const { login, isLogined } = user;
    this.dialogUser.setTextContent(login);
    const userStatusClass = isLogined ? styles.dialog__user_active : styles.dialog__user_inactive;
    this.dialogUser.addClasses([userStatusClass]);
  }
}
