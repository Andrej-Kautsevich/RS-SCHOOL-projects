/* eslint-disable class-methods-use-this */
import Garage from '../api/Garage';
import { CarInterface } from '../api/types/types';
import Car from './Car/Car';

export default class GarageModel {
  public cars: Car[] = [];

  public async getCars(page = 1, limit = 7) {
    const carsData = await Garage.getCars(page, limit);
    this.cars = carsData.cars.map((carData) => new Car(carData));
    const total = carsData.totalCount;
    return { cars: this.cars, total };
  }

  public async createCar(car: Pick<CarInterface, 'name' | 'color'>) {
    try {
      await Garage.createCar(car);
      return true;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async deleteCar(carId: Pick<CarInterface, 'id'>) {
    try {
      await Garage.deleteCar(carId);
      return true;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async getCarById(carId: Pick<CarInterface, 'id'>) {
    const car = await Garage.getCarById(carId);
    return car;
  }

  public async updateCarById(car: CarInterface) {
    try {
      await Garage.updateCar(car);
      return true;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}
