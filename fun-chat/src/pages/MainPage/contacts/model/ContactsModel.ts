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
  setAllUsers,
  setCurrentAuthorizedUsers,
  setCurrentUnauthorizedUsers,
  setCurrentUserDialogs,
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
    this.setSearchInputHandler();
  }

  public getUserList() {
    return this.view.getContacts();
  }

  public getUsers() {
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

  private handleDeleteResponse(response: unknown) {
    const serverMessage = isFromServerMessage(response);
    if (serverMessage) {
      const { currentUserDialogs } = storeModel.getState();

      const incomeMessage = serverMessage.payload?.message;
      currentUserDialogs.forEach((dialog) => {
        const savedMessage = dialog.messages.find((msg) => msg.id === incomeMessage?.id);

        if (savedMessage) {
          const currentDialog = dialog;
          currentDialog.messages = dialog.messages.filter((msg) => msg.id !== savedMessage.id);
          this.observer.notify(ObserverEvents.updateDialog, '');
          this.drawUsers();
        }
      });
    }
  }

  private handleEditResponse(response: unknown) {
    const serverMessage = isFromServerMessage(response);
    if (serverMessage) {
      const { currentUserDialogs } = storeModel.getState();

      const incomeMessage = serverMessage.payload?.message;
      currentUserDialogs.forEach((dialog) => {
        const editedMessage = dialog.messages.find((msg) => msg.id === incomeMessage?.id);

        if (editedMessage && incomeMessage) {
          editedMessage.text = incomeMessage?.text;
          editedMessage.status.isEdited = incomeMessage.status.isEdited;
          this.observer.notify(ObserverEvents.updateDialog, '');
        }
      });
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
      storeModel.dispatch(setAllUsers(users));
      storeModel.dispatch(setCurrentUserDialogs(currentUserDialogs));
      users.map((user) => this.getMessagesFromUser(user));
    }
  }

  private getMessagesFromUser(user: User) {
    this.socket.sendMessage(messageHistory(user));
  }

  private drawUsers() {
    this.view.clearList();

    const { allUsers, currentUser } = storeModel.getState();
    const users = allUsers.filter((user) => user.login !== currentUser?.login);

    users.forEach((user) => this.drawUser(user));
  }

  private drawUser(user: User) {
    const { currentUser, currentUserDialogs } = storeModel.getState();
    const userDialog = currentUserDialogs.find((dialog) => dialog.login === user.login);

    let unreadMessagesCount;
    if (userDialog) {
      unreadMessagesCount = userDialog.messages.filter(
        (message) => message.from !== currentUser?.login && !message.status.isReaded,
      ).length;
    }
    const userItem = this.view.drawUser(user, unreadMessagesCount);
    userItem.addListener('click', () => this.UserDialogHandler(user));
  }

  private UserDialogHandler(user: User) {
    storeModel.dispatch(setSelectedUser(user));
    this.observer.notify(ObserverEvents.openDialog, '');
  }

  private setSearchInputHandler() {
    this.view.getSearchInput().addListener('input', () => this.searchInputHandler());
  }

  private searchInputHandler() {
    const { allUsers } = storeModel.getState();

    const inputValue = this.view.getSearchInput().getNode().value.toLowerCase().trim();
    const findUsers = allUsers.filter((user) => user.login.toLowerCase().includes(inputValue));
    this.view.clearList();
    findUsers.forEach((user) => this.drawUser(user));
  }

  private subscribeToEvents() {
    this.observer.subscribe(ObserverEvents.allActiveUsers, (message) => this.getAllUsersHandler(message));
    this.observer.subscribe(ObserverEvents.allInactiveUsers, (message) => this.getAllUsersHandler(message));

    this.observer.subscribe(ObserverEvents.externalLoginResponse, () => this.getUsers());
    this.observer.subscribe(ObserverEvents.externalLogoutResponse, () => this.getUsers());

    this.observer.subscribe(ObserverEvents.messageHistory, (message) => this.handleMessages(message));
    this.observer.subscribe(ObserverEvents.messageSend, (message) => this.handleSendResponse(message));
    this.observer.subscribe(ObserverEvents.messageRead, (response) => this.handleReadResponse(response));
    this.observer.subscribe(ObserverEvents.messageDelete, (response) => this.handleDeleteResponse(response));
    this.observer.subscribe(ObserverEvents.messageEdit, (response) => this.handleEditResponse(response));
  }
}
