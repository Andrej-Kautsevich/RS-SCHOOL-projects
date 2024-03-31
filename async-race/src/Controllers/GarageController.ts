import GarageModel from '../Models/GarageModel';

export default class GarageController {
  private garageModel: GarageModel;

  public currentPage: number = 1;

  constructor() {
    this.garageModel = new GarageModel();
  }

  public async getCars(page = 1, limit = 7) {
    const { cars, total } = await this.garageModel.getCars(page, limit);
    return { cars, total };
  }

  public async getPrevPageCars() {
    this.currentPage -= 1;
    const cars = await this.getCars(this.currentPage);
    return cars;
  }

  public async getNextPageCars() {
    this.currentPage += 1;
    const cars = await this.getCars(this.currentPage);
    return cars;
  }
}
