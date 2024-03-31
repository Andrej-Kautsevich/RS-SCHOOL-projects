import GarageController from './Controllers/GarageController';
import { BaseComponent } from './helpers/BaseComponent';
import { main } from './helpers/tags';

class App {
  private root: HTMLElement;

  private mainComponent: BaseComponent;

  private garageController: GarageController;

  constructor() {
    this.root = document.body;
    this.mainComponent = main({ className: 'main' });

    this.garageController = new GarageController();

    this.mainComponent.append(this.garageController.getPage());
  }

  public async init() {
    this.root.append(this.mainComponent.getNode());
  }
}

const app = new App();

app.init();
