import { ServerMessage } from '../core/socket/types';

const isFromServerMessage = (message: unknown): null | ServerMessage => {
  const isValidMessage = (msg: unknown): msg is ServerMessage =>
    typeof msg === 'object' && msg !== null && 'type' in msg && 'id' in msg && 'payload' in msg;

  if (isValidMessage(message)) {
    return message;
  }
  return null;
};

export default isFromServerMessage;
