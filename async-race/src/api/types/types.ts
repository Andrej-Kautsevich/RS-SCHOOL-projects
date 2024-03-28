export type EngineStatus = 'started' | 'stopped';

export interface EngineInterface {
  velocity: number;
  distance: number;
  status: boolean;
}

export interface CarInterface {
  name: string;
  color: string;
  id: number;
}

export interface WinnerInterface {
  id: number;
  wins: number;
  time: number;
}

export interface WinnersQueryParams {
  page: number;
  limit: number;
  sort: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
}
