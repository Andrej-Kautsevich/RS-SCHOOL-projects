import Observer from '../../../../core/observer/Observer';
import ObserverEvents from '../../../../core/observer/types';
import {
  allActiveUsers,
  allInactiveUsers,
  messageHistory,
  messageRead,
} from '../../../../core/socket/actions/user-actions';
import WebSocketService from '../../../../core/socket/model/WebSocketService';
import { Message, User, UserActions } from '../../../../core/socket/types';
import {
  setCurrentAuthorizedUsers,
  setCurrentUnauthorizedUsers,
  setCurrentUserDialogs,
  // setOpenedDialog,
  setSelectedUser,
} from '../../../../core/store/actions';
import storeModel from '../../../../core/store/StoreModel';
import isFromServerMessage from '../../../../utils/isFromServerMessage';
import ContactsView from '../view/ContactsView';

export default class ContactsModel {
  private view: ContactsView;

  private observer = Observer.getInstance();

  private socket = WebSocketService.getInstance();

  constructor() {
    this.view = new ContactsView();
    this.subscribeToEvents();
  }

  public getUserList() {
    return this.view.getContacts();
  }

  private getUsers() {
    this.socket.sendMessage(allActiveUsers());
    this.socket.sendMessage(allInactiveUsers());
  }

  private handleMessages(response: unknown) {
    const serverMessage = isFromServerMessage(response);
    if (serverMessage) {
      const { currentUserDialogs, currentUser } = storeModel.getState();
      let messages: Message[] = [];

      if (serverMessage.payload?.message) {
        messages = [serverMessage.payload.message];
      } else if (serverMessage.payload?.messages) {
        messages = serverMessage.payload.messages;
      }

      if (messages.length) {
        const { from, to } = messages[0];

        const login = from === currentUser?.login ? to : from;
        const currentUserDialog = currentUserDialogs.find((dialog) => dialog.login === login);

        if (currentUserDialog) {
          currentUserDialog.messages = serverMessage.payload?.message
            ? [...currentUserDialog.messages, ...messages]
            : messages;
        } else {
          currentUserDialogs.push({ login, messages });
        }
      }
      storeModel.dispatch(setCurrentUserDialogs(currentUserDialogs));
    }
    this.drawUsers();
  }

  private handleReadResponse(response: unknown) {
    const serverMessage = isFromServerMessage(response);
    if (serverMessage) {
      const { openedDialog } = storeModel.getState();
      const readMessage = openedDialog?.messages.find((message) => message.id === serverMessage.payload?.message?.id);
      if (readMessage && serverMessage.payload?.message?.status) {
        readMessage.status.isReaded = serverMessage.payload.message.status.isReaded;
      }

      this.drawUsers();
    }
  }

  private handleSendResponse(response: unknown) {
    const serverMessage = isFromServerMessage(response);
    if (serverMessage) {
      const { openedDialog } = storeModel.getState();
      const incomeMessage = serverMessage.payload?.message;
      if (incomeMessage && incomeMessage?.from === openedDialog?.login) {
        openedDialog?.messages.push(incomeMessage);
        incomeMessage.status.isReaded = true;
        this.socket.sendMessage(messageRead(incomeMessage));
        this.drawUsers();
      } else this.handleMessages(response);
    }
  }

  private getAllUsersHandler(message: unknown) {
    const serverMessage = isFromServerMessage(message);
    if (serverMessage && serverMessage.payload?.users) {
      const action =
        serverMessage.type === UserActions.ALL_ACTIVE ? setCurrentAuthorizedUsers : setCurrentUnauthorizedUsers;
      storeModel.dispatch(action(serverMessage.payload.users));

      const { currentAuthorizedUsers, currentUnauthorizedUsers, currentUser, currentUserDialogs } =
        storeModel.getState();
      const users = [...currentAuthorizedUsers, ...currentUnauthorizedUsers].filter(
        (user) => user.login !== currentUser?.login,
      );
      users.forEach((user) => {
        const existingDialog = currentUserDialogs.find((dialog) => dialog.login === user.login);
        if (!existingDialog) {
          currentUserDialogs.push({ login: user.login, messages: [] });
        }
      });
      storeModel.dispatch(setCurrentUserDialogs(currentUserDialogs));
      users.map((user) => this.getMessagesFromUser(user));
    }
  }

  private getMessagesFromUser(user: User) {
    this.socket.sendMessage(messageHistory(user));
  }

  private drawUsers() {
    this.view.clearList();

    const { currentAuthorizedUsers, currentUnauthorizedUsers, currentUser, currentUserDialogs } = storeModel.getState();
    const users = [...currentAuthorizedUsers, ...currentUnauthorizedUsers].filter(
      (user) => user.login !== currentUser?.login,
    );

    const unreadMessageCounts = new Map();
    currentUserDialogs.forEach((dialog) => {
      const unreadMessagesCount = dialog.messages.filter(
        (message) => message.from !== currentUser?.login && !message.status.isReaded,
      ).length;
      unreadMessageCounts.set(dialog.login, unreadMessagesCount);
    });

    users.forEach((user) => {
      const unreadMessagesCount = unreadMessageCounts.get(user.login);
      const userItem = this.view.drawUser(user, unreadMessagesCount);
      userItem.addListener('click', () => this.UserDialogHandler(user));
    });
  }

  private UserDialogHandler(user: User) {
    storeModel.dispatch(setSelectedUser(user));
    this.observer.notify(ObserverEvents.openDialog, '');
  }

  private subscribeToEvents() {
    this.observer.subscribe(ObserverEvents.allActiveUsers, (message) => this.getAllUsersHandler(message));
    this.observer.subscribe(ObserverEvents.allInactiveUsers, (message) => this.getAllUsersHandler(message));

    this.observer.subscribe(ObserverEvents.loginResponse, () => this.getUsers());

    this.observer.subscribe(ObserverEvents.externalLoginResponse, () => this.getUsers());
    this.observer.subscribe(ObserverEvents.externalLogoutResponse, () => this.getUsers());

    this.observer.subscribe(ObserverEvents.messageHistory, (message) => this.handleMessages(message));
    this.observer.subscribe(ObserverEvents.messageSend, (message) => this.handleSendResponse(message));
    this.observer.subscribe(ObserverEvents.messageRead, (response) => this.handleReadResponse(response));
  }
}
