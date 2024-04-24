import Observer from '../../../../core/observer/Observer';
import ObserverEvents from '../../../../core/observer/types';
// import WebSocketService from '../../../../core/socket/model/WebSocketService';
// import { Message } from '../../../../core/socket/types';
import storeModel from '../../../../core/store/StoreModel';
import DialogView from '../view/DialogView';

export default class DialogModel {
  private view: DialogView;

  private observer = Observer.getInstance();

  // private socket = WebSocketService.getInstance();

  constructor() {
    this.view = new DialogView();
    this.subscribeToEvents();
  }

  public getDialogWindow() {
    return this.view.getDialogWindow();
  }

  public openDialog() {
    const { currentUserDialogs, selectedUser } = storeModel.getState();
    const currentDialog = currentUserDialogs.find((dialog) => selectedUser?.login === dialog.login);

    if (selectedUser) this.view.drawDialogTitle(selectedUser);
    this.view.drawMessages(currentDialog?.messages);
  }

  private subscribeToEvents() {
    this.observer.subscribe(ObserverEvents.openDialog, () => this.openDialog());
  }
}
