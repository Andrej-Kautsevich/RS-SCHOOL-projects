import { Dialog, User, UserActions } from '../socket/types';
import { Action } from './types';

export const setCurrentAuthorizedUsers = (users: User[]): Action => ({
  type: UserActions.ALL_ACTIVE,
  payload: users,
});

export const setCurrentUnauthorizedUsers = (users: User[]): Action => ({
  type: UserActions.ALL_INACTIVE,
  payload: users,
});

export const setCurrentUserDialogs = (dialogs: Dialog[]): Action => ({
  type: UserActions.MESSAGE_HISTORY,
  payload: dialogs,
});

export const setCurrentUser = (user: User): Action => ({
  type: UserActions.LOGIN,
  payload: user,
});

export const setSelectedUser = (user: User): Action => ({
  type: UserActions.SELECT_USER,
  payload: user,
});
