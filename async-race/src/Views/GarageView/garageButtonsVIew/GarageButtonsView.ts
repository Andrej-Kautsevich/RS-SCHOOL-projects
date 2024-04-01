import { BaseComponent } from '../../../helpers/BaseComponent';
import { button, div } from '../../../helpers/tags';
import styles from '../garageView.module.scss';
import buttonStyles from '../../../styles/button.module.scss';

export default class GarageButtonsView {
  private buttonsWrapper = div({ classNames: [styles.garage__buttons] });

  public generateCarsButton: BaseComponent<HTMLButtonElement>;

  public startRaceButton: BaseComponent<HTMLButtonElement>;

  public resetRaceButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.generateCarsButton = button({ classNames: [buttonStyles.button], txt: 'Generate cars' });
    this.startRaceButton = button({ classNames: [buttonStyles.button], txt: 'Start race' });
    this.resetRaceButton = button({ classNames: [buttonStyles.button], txt: 'Reset race' });
    this.resetRaceButton.getNode().disabled = true;
    this.buttonsWrapper.appendChildren([this.generateCarsButton, this.startRaceButton, this.resetRaceButton]);
  }

  public getNode() {
    return this.buttonsWrapper;
  }
}
