import { BaseComponent } from '../helpers/BaseComponent';
import { button, div } from '../helpers/tags';
import styles from './GarageView/garageView.module.scss';
import buttonStyles from '../styles/button.module.scss';

export default class ManageButtonsView {
  private info = div({ className: styles.car__info });

  public deleteBtn: BaseComponent<HTMLButtonElement>;

  public selectBtn: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.deleteBtn = button({ classNames: [buttonStyles.button], txt: 'Delete' });
    this.selectBtn = button({ classNames: [buttonStyles.button], txt: 'Select' });

    this.info.appendChildren([this.deleteBtn, this.selectBtn]);
  }

  public getNode(): BaseComponent {
    return this.info;
  }

  public disableButtons(state: boolean): void {
    this.deleteBtn.getNode().disabled = state;
    this.selectBtn.getNode().disabled = state;
  }
}
