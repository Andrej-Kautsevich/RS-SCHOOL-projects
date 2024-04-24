import Observer from '../../../../core/observer/Observer';
import ObserverEvents from '../../../../core/observer/types';
import { messageRead, sendMessage } from '../../../../core/socket/actions/user-actions';
import WebSocketService from '../../../../core/socket/model/WebSocketService';
import { setOpenedDialog } from '../../../../core/store/actions';
import storeModel from '../../../../core/store/StoreModel';
import isFromServerMessage from '../../../../utils/isFromServerMessage';
import DialogView from '../view/DialogView';

export default class DialogModel {
  private view: DialogView;

  private observer = Observer.getInstance();

  private socket = WebSocketService.getInstance();

  constructor() {
    this.view = new DialogView();
    this.subscribeToEvents();
    this.setInputHandler();
    this.setFormHandler();
  }

  public getDialogWindow() {
    return this.view.getDialogWindow();
  }

  public openDialog() {
    const { currentUserDialogs, selectedUser } = storeModel.getState();
    const currentDialog = currentUserDialogs.find((dialog) => selectedUser?.login === dialog.login);

    if (currentDialog) storeModel.dispatch(setOpenedDialog(currentDialog));
    if (selectedUser) this.view.drawDialogTitle(selectedUser);

    this.view.enableFormInput();
    this.drawMessages();
  }

  private drawMessages() {
    const { openedDialog } = storeModel.getState();
    this.view.drawMessages(openedDialog?.messages);
  }

  private dialogHandler() {
    const { currentUserDialogs, selectedUser } = storeModel.getState();
    const currentDialog = currentUserDialogs.find((dialog) => selectedUser?.login === dialog.login);
    const messages = currentDialog?.messages;

    if (messages) {
      const unreadMessages = messages.filter(
        (message) => message.from === selectedUser?.login && !message.status.isReaded,
      );

      if (unreadMessages) {
        unreadMessages.forEach((message) => this.socket.sendMessage(messageRead(message)));
      }
    }
  }

  private updateDialogTitle(response: unknown) {
    const serverMessage = isFromServerMessage(response);
    if (serverMessage) {
      const { openedDialog } = storeModel.getState();
      const user = serverMessage.payload?.user;
      if (user && user?.login === openedDialog?.login) {
        this.view.drawDialogTitle(user);
      }
    }
  }

  private setInputHandler() {
    const formInput = this.view.getFormInput();
    const formButton = this.view.getFormButton().getNode();
    formInput.addListener('input', () => {
      formButton.disabled = !formInput.getNode().value;
    });
    formInput.addListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.formHandler();
      }
    });
  }

  private setFormHandler() {
    const form = this.view.getForm();
    form.addListener('submit', (event: Event) => {
      event.preventDefault();
      this.formHandler();
    });
  }

  private formHandler() {
    const formInput = this.view.getFormInput();
    const { value } = formInput.getNode();
    const formButton = this.view.getFormButton().getNode();
    if (!value) return;
    this.sendMessage(value);
    formInput.getNode().value = '';
    formButton.disabled = true;
  }

  private sendMessage(value: string) {
    const { selectedUser } = storeModel.getState();
    if (selectedUser) {
      const message = {
        to: selectedUser?.login,
        text: value,
      };
      this.socket.sendMessage(sendMessage(message));
    }
  }

  private handleReadResponse(response: unknown) {
    const serverMessage = isFromServerMessage(response);
    if (serverMessage) {
      const { openedDialog } = storeModel.getState();
      const readMessage = openedDialog?.messages.find((message) => serverMessage.payload?.message?.id === message.id);
      if (readMessage) {
        this.drawMessages();
      }
    }
  }

  private subscribeToEvents() {
    this.observer.subscribe(ObserverEvents.openDialog, () => this.openDialog());
    this.observer.subscribe(ObserverEvents.messageSend, () => this.drawMessages());
    this.observer.subscribe(ObserverEvents.messageRead, (response) => this.handleReadResponse(response));
    this.observer.subscribe(ObserverEvents.externalLogoutResponse, (response) => this.updateDialogTitle(response));
    this.observer.subscribe(ObserverEvents.externalLoginResponse, (response) => this.updateDialogTitle(response));

    const dialogWindow = this.view.getDialogWindow();
    dialogWindow.addListener('click', () => this.dialogHandler());
    dialogWindow.addListener('wheel', () => this.dialogHandler());
  }
}
