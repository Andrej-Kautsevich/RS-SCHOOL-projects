import Observer from '../helpers/Observer';
import Car from '../Models/Car/Car';
import GarageModel from '../Models/GarageModel';
import { CARS_PER_PAGE, GENERATE_CARS_NUMBER, ObserverEvents } from '../types/enums';
import { EngineInterface } from '../types/types';
import GarageView from '../Views/GarageView/GarageView';

export default class GarageController {
  private garageModel: GarageModel;

  private garageView: GarageView;

  private currentPage: number = 1;

  public observer: Observer<unknown> = Observer.getInstance();

  private raceMode: boolean = false;

  constructor() {
    this.garageModel = new GarageModel();
    this.garageView = new GarageView();

    this.init();
  }

  private async getCars(page = 1, limit = CARS_PER_PAGE): Promise<{ cars: Car[]; total?: number }> {
    const { cars, total } = await this.garageModel.getCars(page, limit);
    return { cars, total };
  }

  private addListeners(): void {
    this.setPaginationListeners();
    this.setCarCreateListeners();
    this.setCarUpdateListeners();
    this.setCarGenerateListeners();
    this.setStartRaceListeners();
    this.setResetRaceListeners();
  }

  private handleCarsButtons(): void {
    this.garageView.observer.subscribe(ObserverEvents.delete, (data) => {
      if (typeof data === 'number') this.deleteCar(data);
    });
    this.garageView.observer.subscribe(ObserverEvents.select, (data) => {
      if (typeof data === 'number') this.selectCar(data);
    });
    this.garageView.observer.subscribe(ObserverEvents.start, (car) => {
      if (car instanceof Car) car.startDrive();
    });
    this.garageView.observer.subscribe(ObserverEvents.stop, (data) => {
      if (data instanceof Car) this.stopEngine(data);
    });
  }

  private async deleteCar(carId: number): Promise<void> {
    const car = { id: carId };
    await this.garageModel.deleteCar(car);
    this.observer.notify(ObserverEvents.updateWinners, '');
    this.renderPage();
  }

  private async selectCar(carId: number): Promise<void> {
    const car = await this.garageModel.getCarById({ id: carId });
    this.garageView.updateCarForm.form.setAttribute('data-car-ID', carId.toString());
    this.garageView.updateCarForm.carNameInput.getNode().value = car.name;
    this.garageView.updateCarForm.carColorInput.getNode().value = car.color;
    this.garageView.updateCarForm.submitButton.getNode().disabled = false;
  }

  private setPaginationListeners(): void {
    this.garageView.prevButton.addListener('click', () => {
      this.currentPage -= 1;
      this.renderPage();
    });
    this.garageView.nextButton.addListener('click', () => {
      this.currentPage += 1;
      this.renderPage();
    });
  }

  private setCarCreateListeners(): void {
    this.garageView.createCarForm.form.addListener('submit', async (event) => {
      event.preventDefault();
      const name = this.garageView.createCarForm.carNameInput.getNode().value.trim();
      const color = this.garageView.createCarForm.carColorInput.getNode().value;

      await this.garageModel.createCar({ name, color });
      this.garageView.createCarForm.clearForm();
      this.renderPage();
    });
  }

  private setCarUpdateListeners(): void {
    this.garageView.updateCarForm.form.addListener('submit', async (event) => {
      event.preventDefault();
      const name = this.garageView.updateCarForm.carNameInput.getNode().value.trim();
      const color = this.garageView.updateCarForm.carColorInput.getNode().value;
      const id = Number(this.garageView.updateCarForm.form.getNode().dataset.carId);
      if (!id) throw new Error('No id was found');

      await this.garageModel.updateCarById({ name, color, id });
      this.garageView.updateCarForm.clearForm();
      this.observer.notify(ObserverEvents.updateWinners, '');
      this.renderPage();
    });
  }

  private setCarGenerateListeners(): void {
    this.garageView.garageButtons.generateCarsButton.addListener('click', async () => {
      await this.garageModel.generateCars(GENERATE_CARS_NUMBER);
      this.renderPage();
    });
  }

  private setStartRaceListeners(): void {
    this.garageView.garageButtons.startRaceButton.addListener('click', async () => {
      try {
        this.raceMode = true;
        this.garageView.garageButtons.resetRaceButton.getNode().disabled = false;
        this.garageView.disableButtons(this.garageModel.renderedCars);
        const startTimes: Record<number, number> = {};
        const promises = this.garageModel.renderedCars.map(async (car) => {
          startTimes[car.id] = Date.now();
          const result = await car.startDrive();
          if (result === 'canceled') return Promise.reject();
          return { car, result, id: car.id };
        });
        const winner = await Promise.any(promises).catch(() => {});
        if (winner) {
          this.setWinner(winner, startTimes);
        }
        await Promise.all(promises).catch(() => {});
      } catch (error) {
        if (error instanceof AggregateError) {
          throw new Error();
        }
        throw new Error();
      } finally {
        this.raceMode = false;
      }
    });
  }

  private async setWinner(
    winner: { car: Car; result: Pick<EngineInterface, 'status'>; id: number },
    startTimes: Record<number, number>,
  ): Promise<void> {
    const winnerTime = Date.now() - startTimes[winner.car.id];
    const fixedTime = Math.ceil(winnerTime / 10) / 100;
    this.garageView.showWinner(winner.car, fixedTime);
    await this.garageModel
      .setWinner(winner.id, fixedTime)
      .then(() => this.observer.notify(ObserverEvents.updateWinners, ''));
  }

  private setResetRaceListeners(): void {
    this.garageView.garageButtons.resetRaceButton.addListener('click', async () => this.resetRace());
  }

  private async resetRace(): Promise<void> {
    this.garageView.garageButtons.resetRaceButton.getNode().disabled = true;
    const promises = this.garageModel.renderedCars.map((car) => this.stopEngine(car));
    await Promise.all(promises);
    this.garageView.enableButtons(this.garageModel.renderedCars);
    this.garageView.garageButtons.startRaceButton.getNode().disabled = false;
  }

  private async stopEngine(car: Car): Promise<void> {
    await car.stop(this.raceMode);
  }

  public getPage(): HTMLElement {
    return this.garageView.getPage();
  }

  private async renderPage(): Promise<void> {
    const { cars, total } = await this.getCars(this.currentPage);
    this.garageModel.renderedCars = await this.garageView.renderPage(cars, this.currentPage, total);
  }

  public toggleVisibility(): void {
    this.garageView.toggleVisibility();
  }

  private async init(): Promise<void> {
    await this.renderPage();
    this.addListeners();
    this.handleCarsButtons();
  }
}
