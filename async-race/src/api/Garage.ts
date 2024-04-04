import ApiModel from './ApiModel';
import { API_METHODS, API_URLS, URL_PARAMS } from '../types/enums';
import { CarInterface, GarageQueryParams } from '../types/types';

export default class Garage extends ApiModel {
  public static async getCars(params?: GarageQueryParams): Promise<{ cars: CarInterface[]; totalCount?: number }> {
    const url = new URL(API_URLS.GARAGE);
    if (params?.page) url.searchParams.set(URL_PARAMS.PAGE, params.page.toString());
    if (params?.limit) url.searchParams.set(URL_PARAMS.LIMIT, params.limit.toString());
    const response = await fetch(url, { method: API_METHODS.GET });
    const cars = await response.json();

    if (params?.limit) {
      const totalCountHeader = response.headers.get('X-Total-Count');
      if (totalCountHeader === null) {
        throw new Error('X-Total-Count header not found');
      }
      const totalCount = parseInt(totalCountHeader, 10);
      return { cars, totalCount };
    }
    return { cars };
  }

  public static async getCarById(car: Pick<CarInterface, 'id'>): Promise<CarInterface> {
    const url = new URL(`${API_URLS.GARAGE}${car.id}`);
    return this.fetchAPI(url, { method: API_METHODS.GET });
  }

  public static async createCar(car: Pick<CarInterface, 'name' | 'color'>): Promise<CarInterface> {
    const url = new URL(API_URLS.GARAGE);
    return this.fetchAPI(url, {
      method: API_METHODS.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
  }

  public static async deleteCar(car: Pick<CarInterface, 'id'>): Promise<CarInterface> {
    const url = new URL(`${API_URLS.GARAGE}${car.id}`);
    return this.fetchAPI(url, {
      method: API_METHODS.DELETE,
    });
  }

  public static async updateCar(car: CarInterface): Promise<CarInterface> {
    const url = new URL(`${API_URLS.GARAGE}${car.id}`);
    const carData = { name: car.name, color: car.color };
    return this.fetchAPI(url, {
      method: API_METHODS.PUT,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    });
  }
}
