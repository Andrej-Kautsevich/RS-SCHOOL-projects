import { Message, ServerMessage, User, UserActions } from '../types';
import generateId from '../utils/idGenerator';

export type UserAction = {
  id: string;
  type: UserActions;
  payload: null;
};

export const loginUser = (user: User): ServerMessage => ({
  id: generateId(),
  type: UserActions.LOGIN,
  payload: {
    user: {
      login: user.login,
      password: user.password,
    },
  },
});

export const logoutUser = (id: string, user: User): ServerMessage => ({
  id,
  type: UserActions.LOGOUT,
  payload: {
    user,
  },
});

export const allActiveUsers = (): ServerMessage => ({
  id: generateId(),
  type: UserActions.ALL_ACTIVE,
  payload: null,
});

export const allInactiveUsers = (): ServerMessage => ({
  id: generateId(),
  type: UserActions.ALL_INACTIVE,
  payload: null,
});

export const messageHistory = (currentUser: User): ServerMessage => ({
  id: generateId(),
  type: UserActions.MESSAGE_HISTORY,
  payload: {
    user: {
      login: currentUser.login,
    },
  },
});

export const messageRead = (message: Message) => ({
  id: generateId(),
  type: UserActions.MESSAGE_READ,
  payload: {
    message,
  },
});

export const sendMessage = (message: Pick<Message, 'to' | 'text'>) => ({
  id: generateId(),
  type: UserActions.MESSAGE_SEND,
  payload: {
    message,
  },
});

export const sendEditMessage = (message: Pick<Message, 'id' | 'text'>): ServerMessage => ({
  id: generateId(),
  type: UserActions.MESSAGE_EDIT,
  payload: {
    message,
  },
});

export const deleteMessage = (message: Pick<Message, 'id'>): ServerMessage => ({
  id: generateId(),
  type: UserActions.MESSAGE_DELETE,
  payload: {
    message,
  },
});
