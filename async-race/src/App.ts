import GarageController from './Controllers/GarageController';
import { BaseComponent } from './helpers/BaseComponent';
import { main } from './helpers/tags';
import GarageView from './Views/GarageView/GarageView';

class App {
  private root: HTMLElement;

  private mainComponent: BaseComponent;

  private garageView: GarageView;

  private garageController: GarageController;

  constructor() {
    this.root = document.body;
    this.mainComponent = main({ className: 'main' });

    this.garageController = new GarageController();
    this.garageView = new GarageView(this.garageController);

    this.mainComponent.append(this.garageView.getPage());
  }

  public async init() {
    this.root.append(this.mainComponent.getNode());
    const { cars, total } = await this.garageController.getCars();
    this.garageView.renderPage(cars, total);
  }
}

const app = new App();

app.init();
