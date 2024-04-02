/* eslint-disable class-methods-use-this */
import Garage from '../api/Garage';
import Winners from '../api/Winners';
import { WinnersQueryParams } from '../types/types';

export default class WinnersModel {
  public async getWinners(params: WinnersQueryParams) {
    const winners = await Winners.getWinners(params);
    const total = winners.totalCount;
    return { winners, total };
  }

  public async getWinnerCar(id: number) {
    const car = await Garage.getCarById({ id });
    return car;
  }
}
