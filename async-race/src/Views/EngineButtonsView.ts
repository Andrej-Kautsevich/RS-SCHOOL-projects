import { button, div } from '../helpers/tags';
import styles from './GarageView/garageView.module.scss';
import buttonStyles from '../styles/button.module.scss';
import { BaseComponent } from '../helpers/BaseComponent';

export default class EngineButtonsView {
  private buttonsWrapper = div({ classNames: [styles.car__engine] });

  public startButton: BaseComponent<HTMLButtonElement>;

  public stopButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.startButton = button({ classNames: [buttonStyles.button, styles.button, styles.button_start], txt: 'Start' });
    this.stopButton = button({ classNames: [buttonStyles.button, styles.button, styles.button_stop], txt: 'Stop' });
    this.stopButton.getNode().disabled = true;
    this.buttonsWrapper.appendChildren([this.startButton, this.stopButton]);
  }

  public getNode() {
    return this.buttonsWrapper;
  }
}
