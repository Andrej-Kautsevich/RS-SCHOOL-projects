export const API_URL = 'ws://127.0.0.1:4000';

export const enum UserActions {
  LOGIN = 'USER_LOGIN',
  LOGOUT = 'USER_LOGOUT',
  LOGIN_ANOTHER = 'USER_EXTERNAL_LOGIN',
  LOGOUT_ANOTHER = 'USER_EXTERNAL_LOGOUT',
  ALL_ACTIVE = 'USER_ACTIVE',
  ALL_INACTIVE = 'USER_INACTIVE',
}

export const enum AppError {
  ERROR = 'ERROR',
}

export type ServerMessage = {
  id: string | null;
  type: AppError | UserActions;
  payload: {
    error?: string;
    user?: User;
  };
};

export type User = {
  login: string;
  password?: string;
  isLogined?: boolean;
};
