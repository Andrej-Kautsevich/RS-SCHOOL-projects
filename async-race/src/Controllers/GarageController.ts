import Observer from '../helpers/Observer';
import Car from '../Models/Car/Car';
import GarageModel from '../Models/GarageModel';
import { GENERATE_CARS_NUMBER } from '../types/enums';
import GarageView from '../Views/GarageView/GarageView';

export default class GarageController {
  private garageModel: GarageModel;

  private garageView: GarageView;

  public currentPage: number = 1;

  public observer: Observer<unknown> = Observer.getInstance();

  constructor() {
    this.garageModel = new GarageModel();
    this.garageView = new GarageView();

    this.init();
  }

  public async getCars(page = 1, limit = 7) {
    const { cars, total } = await this.garageModel.getCars(page, limit);
    return { cars, total };
  }

  private addListeners() {
    this.setPaginationListeners();
    this.setCarCreateListeners();
    this.setCarUpdateListeners();
    this.setCarGenerateListeners();
    this.setStartRaceListeners();
    this.setResetRaceListeners();
  }

  private handleCarsButtons() {
    this.garageView.observer.subscribe('delete', (data) => {
      if (typeof data === 'number') this.deleteCar(data);
    });
    this.garageView.observer.subscribe('select', (data) => {
      if (typeof data === 'number') this.selectCar(data);
    });
    this.garageView.observer.subscribe('start', (data) => {
      if (data instanceof Car) this.startEngine(data);
    });
    this.garageView.observer.subscribe('stop', (data) => {
      if (data instanceof Car) this.stopEngine(data);
    });
  }

  private async deleteCar(carId: number) {
    const car = { id: carId };
    await this.garageModel.deleteCar(car);
    this.renderPage();
  }

  private async selectCar(carId: number) {
    const car = await this.garageModel.getCarById({ id: carId });
    this.garageView.updateCarForm.form.setAttribute('data-car-ID', carId.toString());
    this.garageView.updateCarForm.carNameInput.getNode().value = car.name;
    this.garageView.updateCarForm.carColorInput.getNode().value = car.color;
    this.garageView.updateCarForm.submitButton.getNode().disabled = false;
  }

  private setPaginationListeners() {
    this.garageView.prevButton.addListener('click', () => {
      this.currentPage -= 1;
      this.renderPage();
    });
    this.garageView.nextButton.addListener('click', () => {
      this.currentPage += 1;
      this.renderPage();
    });
  }

  private setCarCreateListeners() {
    this.garageView.createCarForm.form.addListener('submit', async (event) => {
      event.preventDefault();
      const name = this.garageView.createCarForm.carNameInput.getNode().value.trim();
      const color = this.garageView.createCarForm.carColorInput.getNode().value;

      await this.garageModel.createCar({ name, color });
      this.garageView.createCarForm.clearForm();
      this.renderPage();
    });
  }

  private setCarUpdateListeners() {
    this.garageView.updateCarForm.form.addListener('submit', async (event) => {
      event.preventDefault();
      const name = this.garageView.updateCarForm.carNameInput.getNode().value.trim();
      const color = this.garageView.updateCarForm.carColorInput.getNode().value;
      const id = Number(this.garageView.updateCarForm.form.getNode().dataset.carId);
      if (!id) {
        throw new Error('No id was found');
      }

      await this.garageModel.updateCarById({ name, color, id });
      this.garageView.updateCarForm.clearForm();
      this.observer.notify('updateWinners', '');
      this.renderPage();
    });
  }

  private setCarGenerateListeners() {
    this.garageView.garageButtons.generateCarsButton.addListener('click', async () => {
      await this.garageModel.generateCars(GENERATE_CARS_NUMBER);
      this.renderPage();
    });
  }

  private setStartRaceListeners() {
    this.garageView.garageButtons.startRaceButton.addListener('click', async () => {
      try {
        this.garageView.garageButtons.startRaceButton.getNode().disabled = true;
        const startTimes: Record<number, number> = {};
        const promises = this.garageModel.renderedCars.map((car) => {
          startTimes[car.id] = Date.now();
          return this.startEngine(car).then((result) => {
            return { ...result, id: car.id };
          });
        });
        const winner = await Promise.any(promises);
        const winnerTime = Date.now() - startTimes[winner.id];
        const fixedTime = Math.ceil(winnerTime / 10) / 100;
        this.garageView.showWinner(winner, fixedTime);
        await this.garageModel.setWinner(winner.id, fixedTime).then(() => this.observer.notify('updateWinners', ''));
        await Promise.all(promises).catch(() => {});
      } finally {
        this.garageView.garageButtons.resetRaceButton.getNode().disabled = false;
      }
    });
  }

  private setResetRaceListeners() {
    this.garageView.garageButtons.resetRaceButton.addListener('click', async () => {
      this.garageView.garageButtons.resetRaceButton.getNode().disabled = true;
      const promises = this.garageModel.renderedCars.map((car) => this.stopEngine(car));
      await Promise.all(promises);
      this.garageView.garageButtons.startRaceButton.getNode().disabled = false;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async startEngine(car: Car) {
    const params = await car.startEngine();
    if (params) {
      const duration = params.distance / params.velocity;
      await car.drive(duration);
      return car;
    }
    throw new Error('Engine start failed');
  }

  // eslint-disable-next-line class-methods-use-this
  private async stopEngine(car: Car) {
    await car.stop();
  }

  public getPage() {
    return this.garageView.getPage();
  }

  public async renderPage() {
    const { cars, total } = await this.getCars(this.currentPage);
    this.garageModel.renderedCars = await this.garageView.renderPage(cars, this.currentPage, total);
  }

  public toggleVisibility() {
    this.garageView.toggleVisibility();
  }

  private async init() {
    await this.renderPage();
    this.addListeners();
    this.handleCarsButtons();
  }
}
