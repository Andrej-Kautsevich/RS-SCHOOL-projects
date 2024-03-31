import ApiModel from './ApiModel';
import { API_METHODS, API_URLS, URL_PARAMS } from '../types/enums';
import { WinnerInterface, WinnersQueryParams } from '../types/types';

export default class Winners extends ApiModel {
  public static async getWinners(params?: WinnersQueryParams): Promise<WinnerInterface[]> {
    const url = new URL(API_URLS.WINNERS);
    if (params) {
      if (params.limit) url.searchParams.set(URL_PARAMS.LIMIT, params.limit.toString());
      if (params.order) url.searchParams.set(URL_PARAMS.ORDER, params.order.toString());
      if (params.page) url.searchParams.set(URL_PARAMS.PAGE, params.page.toString());
      if (params.sort) url.searchParams.set(URL_PARAMS.SORT, params.sort.toString());
    }
    return this.fetchAPI(url, { method: API_METHODS.GET });
  }

  public static async getWinnerById(winner: Pick<WinnerInterface, 'id'>): Promise<WinnerInterface> {
    const url = new URL(`${API_URLS.WINNERS}${winner.id}`);
    return this.fetchAPI(url, { method: API_METHODS.GET });
  }

  public static async createWinner(winner: WinnerInterface): Promise<WinnerInterface> {
    const url = new URL(API_URLS.WINNERS);
    return this.fetchAPI(url, {
      method: API_METHODS.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    });
  }

  public static async deleteWinnerById(winner: Pick<WinnerInterface, 'id'>): Promise<void> {
    const url = new URL(`${API_URLS.WINNERS}${winner.id}`);
    return this.fetchAPI(url, { method: API_METHODS.DELETE });
  }

  public static async updateWinnerById(winner: WinnerInterface): Promise<WinnerInterface> {
    const url = new URL(`${API_URLS.WINNERS}${winner.id}`);
    const data = { wins: winner.wins, time: winner.time };
    return this.fetchAPI(url, {
      method: API_METHODS.PUT,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }
}
