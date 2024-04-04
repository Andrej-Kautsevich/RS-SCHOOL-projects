import { WinnersQueryParamsSort, WinnersQueryParamsOrder } from './enums';

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

export type Winner = WinnerInterface & Pick<CarInterface, 'color' | 'name'>;

export interface WinnersQueryParams {
  page: number;
  limit: number;
  sort: WinnersQueryParamsSort;
  order: WinnersQueryParamsOrder;
}

export interface GarageQueryParams {
  page?: number;
  limit?: number;
}
