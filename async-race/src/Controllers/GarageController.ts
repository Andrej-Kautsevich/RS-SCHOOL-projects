import GarageModel from '../Models/GarageModel';
import GarageView from '../Views/GarageView/GarageView';

export default class GarageController {
  private garageModel: GarageModel;

  private garageView: GarageView;

  public currentPage: number = 1;

  constructor() {
    this.garageModel = new GarageModel();
    this.garageView = new GarageView();

    this.renderPage().then(this.addListeners.bind(this));
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

  private addListeners() {
    this.garageView.prevButton.addListener('click', () => {
      this.currentPage -= 1;
      this.renderPage();
    });
    this.garageView.nextButton.addListener('click', () => {
      this.currentPage += 1;
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
}
