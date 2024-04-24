import { BaseComponent } from '../../../../utils/BaseComponent';
import { button, div, form, textarea } from '../../../../utils/tags';
import styles from './DialogView.module.scss';
import buttonStyles from '../../../../styles/button.module.scss';
import { Message, User } from '../../../../core/socket/types';
import MessageModel from '../../message/model/MessageModel';

export default class DialogView {
  private dialogWindow: BaseComponent;

  private dialogUser: BaseComponent;

  private dialogMessages: BaseComponent;

  private dialogForm: BaseComponent<HTMLFormElement>;

  private formInput: BaseComponent<HTMLTextAreaElement>;

  private formButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.dialogUser = div({ className: styles.dialog__user });
    this.dialogMessages = div({
      classNames: [styles.dialog__messages, styles.dialog__messages_empty],
      txt: 'Select user to start messaging',
    });

    this.formInput = textarea({ className: styles.dialog__input, placeholder: 'Enter text here', disabled: true });
    this.formButton = button({
      classNames: [styles.dialog__button, buttonStyles.button],
      txt: 'Send',
      type: 'submit',
      disabled: true,
    });
    this.dialogForm = form({ className: styles.dialog__form }, this.formInput, this.formButton);

    this.dialogWindow = div({ className: styles.dialog }, this.dialogUser, this.dialogMessages, this.dialogForm);
  }

  public getDialogWindow() {
    return this.dialogWindow;
  }

  public drawMessages(messages?: Message[]) {
    this.dialogMessages.getNode().innerHTML = '';

    if (messages) {
      this.dialogMessages.removeClasses([styles.dialog__messages_empty]);
      messages.forEach((message) => {
        const messageElement = new MessageModel(message);
        this.dialogMessages.append(messageElement.getMessageElement().getNode());
      });
    } else {
      this.dialogMessages.append(div({ className: styles.dialog__empty, txt: 'Write your first message' }));
    }
  }

  public drawDialogTitle(user: User) {
    this.dialogUser.removeClasses([styles.dialog__user_active, styles.dialog__user_inactive]);

    const { login, isLogined } = user;
    this.dialogUser.setTextContent(login);
    const userStatusClass = isLogined ? styles.dialog__user_active : styles.dialog__user_inactive;
    this.dialogUser.addClasses([userStatusClass]);
  }
}
