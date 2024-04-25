import { Dialog, User, UserActions } from '../socket/types';

export type State = {
  currentAuthorizedUsers: User[];
  currentUnauthorizedUsers: User[];
  currentUser: User | null;
  selectedUser: User | null;
  allUsers: User[];
  currentUserDialogs: Dialog[];
  openedDialog: Dialog | null;
};

export const initialState: State = {
  currentAuthorizedUsers: [],
  currentUnauthorizedUsers: [],
  currentUser: null,
  selectedUser: null,
  allUsers: [],
  currentUserDialogs: [],
  openedDialog: null,
};

export type Action = {
  type: UserActions | StoreActions;
  payload: User | User[] | Dialog;
};

export interface Reducer<T, U> {
  (state: T, action: U): T;
}

export const enum StoreActions {
  OPEN_DIALOG = 'OPEN_DIALOG',
  ALL_USERS = 'ALL_USERS',
}
