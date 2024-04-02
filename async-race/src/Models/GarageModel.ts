/* eslint-disable class-methods-use-this */
import Garage from '../api/Garage';
import Winners from '../api/Winners';
import { CarInterface } from '../types/types';
import Car from './Car/Car';
import generateCarData from './utils/generateCarData';

export default class GarageModel {
  public cars: Car[] = [];

  public renderedCars: Car[] = [];

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

  public async generateCars(quantity = 100) {
    const carPromises = Array.from({ length: quantity }, async () => {
      const car = generateCarData();
      return this.createCar(car);
    });
    await Promise.all(carPromises);
  }

  public async setWinner(id: number, time: number) {
    try {
      const winner = await Winners.getWinnerById({ id });
      if (winner.time > time) {
        winner.time = time;
      }
      winner.wins += 1;
      await Winners.updateWinnerById(winner);
    } catch (error) {
      await Winners.createWinner({ id, wins: 1, time });
    }
  }
}
