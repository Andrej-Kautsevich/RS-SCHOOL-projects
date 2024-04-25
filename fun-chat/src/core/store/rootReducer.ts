import { Dialog, User, UserActions } from '../socket/types';
import { Reducer, State, Action, StoreActions } from './types';

const rootReducer: Reducer<State, Action> = (state: State, action: Action): State => {
  switch (action.type) {
    case UserActions.ALL_ACTIVE:
      return {
        ...state,
        currentAuthorizedUsers: action.payload as User[],
      };
    case UserActions.ALL_INACTIVE:
      return {
        ...state,
        currentUnauthorizedUsers: action.payload as User[],
      };
    case UserActions.MESSAGE_HISTORY:
      return {
        ...state,
      };
    case UserActions.LOGIN:
      return {
        ...state,
        currentUser: action.payload as User,
      };
    case UserActions.SELECT_USER:
      return {
        ...state,
        selectedUser: action.payload as User,
      };
    case StoreActions.OPEN_DIALOG: {
      return {
        ...state,
        openedDialog: action.payload as Dialog,
      };
    }
    case StoreActions.ALL_USERS: {
      return {
        ...state,
        allUsers: action.payload as User[],
      };
    }
    default:
      return state;
  }
};

export default rootReducer;
