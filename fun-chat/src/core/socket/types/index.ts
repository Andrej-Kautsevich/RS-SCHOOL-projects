export const API_URL = 'ws://127.0.0.1:4000';

export const enum UserActions {
  LOGIN = 'USER_LOGIN',
  LOGOUT = 'USER_LOGOUT',
  LOGIN_EXTERNAL = 'USER_EXTERNAL_LOGIN',
  LOGOUT_EXTERNAL = 'USER_EXTERNAL_LOGOUT',
  ALL_ACTIVE = 'USER_ACTIVE',
  ALL_INACTIVE = 'USER_INACTIVE',
  MESSAGE_HISTORY = 'MSG_FROM_USER',
  MESSAGE_SEND = 'MSG_SEND',
  MESSAGE_READ = 'MSG_READ',
  MESSAGE_DELETE = 'MSG_DELETE',
  MESSAGE_EDIT = 'MSG_EDIT',
  SELECT_USER = 'SELECT_USER',
}

export const enum AppError {
  ERROR = 'ERROR',
}

export type ServerResponse = {
  id: string | null;
  type: AppError | UserActions;
  payload: {
    error?: string;
    user?: User;
    users?: User[];
    message?: Message;
    messages?: Message[];
  } | null;
};

export type ServerMessage = {
  id: string | null;
  type: UserActions;
  payload: {
    user?: Partial<User>;
    message?: Partial<Message>;
  } | null;
};

export type User = {
  login: string;
  password?: string;
  isLogined?: boolean;
};

export type Message = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
};

type MessageStatus = {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
};

export type Dialog = {
  login: string;
  messages: Message[];
};
