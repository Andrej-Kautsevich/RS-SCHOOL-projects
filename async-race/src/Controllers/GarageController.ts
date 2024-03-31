import GarageModel from '../Models/GarageModel';
import GarageView from '../Views/GarageView/GarageView';

export default class GarageController {
  private garageModel: GarageModel;

  private garageView: GarageView;

  public currentPage: number = 1;

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
  }

  private handleCarsButtons() {
    this.garageView.observer.subscribe('delete', (data) => {
      if (typeof data === 'number') this.deleteCar(data);
    });
    this.garageView.observer.subscribe('select', (data) => {
      if (typeof data === 'number') this.selectCar(data);
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
      this.renderPage();
    });
  }

  public getPage() {
    return this.garageView.getPage();
  }

  public async renderPage() {
    const { cars, total } = await this.getCars(this.currentPage);
    this.garageView.renderPage(cars, this.currentPage, total);
  }

  private async init() {
    await this.renderPage();
    this.addListeners();
    this.handleCarsButtons();
  }
}
