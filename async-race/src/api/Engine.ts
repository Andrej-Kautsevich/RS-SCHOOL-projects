import ApiModel from './ApiModel';
import { API_METHODS, API_URLS, URL_PARAMS } from './types/enums';
import { CarInterface, EngineInterface, EngineStatus } from './types/types';

export default class Engine extends ApiModel {
  /**
   * Starts or stops engine of specified car, and returns it's actual velocity and distance
   *
   * @param car car ID
   * @param status engine status
   * @returns returns it's actual velocity and distance
   */
  public static async startStopCarEngine(
    car: Pick<CarInterface, 'id'>,
    status: EngineStatus,
  ): Promise<Omit<EngineInterface, 'status'>> {
    const url = new URL(API_URLS.ENGINE);
    url.searchParams.set(URL_PARAMS.ID, car.id.toString());
    url.searchParams.set(URL_PARAMS.STATUS, status);
    return this.fetchAPI(url, { method: API_METHODS.PATCH });
  }

  /**
   * Switches engine of specified car to drive mode and finishes with success message or fails with 500 error.
   * Before using this request you need to switch engine status to the 'started' status first.
   *
   * @param car car ID
   * @returns returns success status
   */
  public static async switchToDriveCarEngine(car: Pick<CarInterface, 'id'>): Promise<Pick<EngineInterface, 'status'>> {
    const url = new URL(API_URLS.ENGINE);
    url.searchParams.set(URL_PARAMS.ID, car.id.toString());
    url.searchParams.set(URL_PARAMS.STATUS, 'drive');
    return this.fetchAPI(url, { method: API_METHODS.PATCH });
  }
}
