export const API_URLS = {
  GARAGE: 'http://127.0.0.1:3000/garage/',
  ENGINE: 'http://127.0.0.1:3000/engine/',
  WINNERS: 'http://127.0.0.1:3000/winners/',
} as const;

export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

export const URL_PARAMS = {
  PAGE: '_page',
  LIMIT: '_limit',
  SORT: '_sort',
  ORDER: '_order',
  ID: 'id',
  STATUS: 'status',
} as const;

export const GENERATE_CARS_NUMBER = 100;

export const WINNER_TIME_DISPLAY = 3000;
