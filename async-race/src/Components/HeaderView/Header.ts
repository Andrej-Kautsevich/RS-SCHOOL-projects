import { BaseComponent } from '../../helpers/BaseComponent';
import { button, header } from '../../helpers/tags';
import styles from './header.module.scss';
import buttonStyles from '../../styles/button.module.scss';
import GarageController from '../../Controllers/GarageController';
import WinnersController from '../../Controllers/WinnersController';

export default class Header {
  public garageButton: BaseComponent<HTMLButtonElement>;

  public winnersButton: BaseComponent<HTMLButtonElement>;

  private header: BaseComponent<HTMLHeadElement>;

  constructor(
    private garageController: GarageController,
    private winnersController: WinnersController,
  ) {
    this.header = header({ classNames: [styles.header] });
    this.garageButton = button({ classNames: [buttonStyles.button, styles.header__button], txt: 'To Garage' });
    this.garageButton.getNode().disabled = true;
    this.winnersButton = button({ classNames: [buttonStyles.button, styles.header__button], txt: 'To Winners' });
    this.header.appendChildren([this.garageButton, this.winnersButton]);

    this.setListeners();
  }

  public getNode(): HTMLElement {
    return this.header.getNode();
  }

  private setListeners(): void {
    this.winnersButton.addListener('click', () => {
      this.handleWinnersButton();
    });
    this.garageButton.addListener('click', () => {
      this.handleGarageButton();
    });
  }

  private handleWinnersButton(): void {
    this.winnersButton.getNode().disabled = true;
    this.garageButton.getNode().disabled = false;
    this.garageController.toggleVisibility();
    this.winnersController.toggleVisibility();
  }

  private handleGarageButton(): void {
    this.garageButton.getNode().disabled = true;
    this.winnersButton.getNode().disabled = false;
    this.garageController.toggleVisibility();
    this.winnersController.toggleVisibility();
  }
}
