import { BaseComponent } from '../../../helpers/BaseComponent';
import { button, div } from '../../../helpers/tags';
import styles from '../garageView.module.scss';
import buttonStyles from '../../../styles/button.module.scss';

export default class GarageButtonsView {
  private buttonsWrapper = div({ classNames: [styles.garage__buttons] });

  public generateCarsButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.generateCarsButton = button({ classNames: [buttonStyles.button], txt: 'Generate cars' });
    this.buttonsWrapper.appendChildren([this.generateCarsButton]);
  }

  public getNode() {
    return this.buttonsWrapper;
  }
}
