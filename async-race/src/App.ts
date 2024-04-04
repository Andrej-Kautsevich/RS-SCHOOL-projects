import GarageController from './Controllers/GarageController';
import { BaseComponent } from './helpers/BaseComponent';
import { main } from './helpers/tags';
import Header from './Components/HeaderView/Header';
import WinnersController from './Controllers/WinnersController';
import { ObserverEvents } from './types/enums';

class App {
  private root: HTMLElement;

  private mainComponent: BaseComponent;

  private header: Header;

  private garageController: GarageController;

  private winnersController: WinnersController;

  constructor() {
    this.root = document.body;
    this.mainComponent = main({ className: 'main' });
    this.garageController = new GarageController();
    this.winnersController = new WinnersController();
    this.header = new Header(this.garageController, this.winnersController);

    this.mainComponent.appendChildren([this.garageController.getPage(), this.winnersController.getPage()]);
  }

  public init(): void {
    this.garageController.observer.subscribe(ObserverEvents.updateWinners, () => this.winnersController.renderPage());
    this.root.append(this.header.getNode());
    this.root.append(this.mainComponent.getNode());
  }
}

const app = new App();

app.init();
