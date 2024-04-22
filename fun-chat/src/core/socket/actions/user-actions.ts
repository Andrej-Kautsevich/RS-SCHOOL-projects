import { ServerMessage, User, UserActions } from '../types';
import generateId from '../utils/idGenerator';

export type UserAction = {
  id: string;
  type: UserActions;
  payload: User | User[];
};

export const loginUser = (user: User): ServerMessage => ({
  id: generateId(),
  type: UserActions.LOGIN,
  payload: {
    user,
  },
});
