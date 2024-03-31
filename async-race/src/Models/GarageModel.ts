import Garage from '../api/Garage';
import Car from './Car/Car';

export default class GarageModel {
  public cars: Car[] = [];

  public async getCars(page = 1, limit = 7) {
    const carsData = await Garage.getCars(page, limit);
    this.cars = carsData.cars.map((carData) => new Car(carData));
    const total = carsData.totalCount;
    return { cars: this.cars, total };
  }
}
