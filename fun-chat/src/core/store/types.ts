import { Dialog, User, UserActions } from '../socket/types';

export type State = {
  currentAuthorizedUsers: User[];
  currentUnauthorizedUsers: User[];
  currentUser: User | null;
  selectedUser: User | null;
  allUsers: User[];
  currentUserDialogs: Dialog[];
};

export const initialState: State = {
  currentAuthorizedUsers: [],
  currentUnauthorizedUsers: [],
  currentUser: null,
  selectedUser: null,
  allUsers: [],
  currentUserDialogs: [],
};

export type Action = {
  type: UserActions;
  payload: User | User[];
};

export interface Reducer<T, U> {
  (state: T, action: U): T;
}
