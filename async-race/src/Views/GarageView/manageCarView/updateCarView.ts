import { BaseComponent } from '../../../helpers/BaseComponent';
import { button, form, input } from '../../../helpers/tags';
import styles from '../garageView.module.scss';
import createCarStyles from './manageCarView.module.scss';
import buttonStyles from '../../../styles/button.module.scss';

export default class UpdateCarView {
  public carNameInput: BaseComponent<HTMLInputElement>;

  public carColorInput: BaseComponent<HTMLInputElement>;

  public submitButton: BaseComponent<HTMLButtonElement>;

  public form: BaseComponent<HTMLFormElement>;

  constructor() {
    this.form = form({ classNames: [styles.garage__create, createCarStyles.create] });
    this.carNameInput = input({ classNames: [createCarStyles.create__name], type: 'text', placeholder: 'Car name' });
    this.carColorInput = input({ classNames: [createCarStyles.create__color], type: 'color' });
    this.submitButton = button({ classNames: [buttonStyles.button], type: 'submit', txt: 'Update' });
    this.submitButton.getNode().disabled = true;
    this.form.appendChildren([this.carNameInput, this.carColorInput, this.submitButton]);
  }

  public getForm() {
    return this.form;
  }

  public clearForm() {
    this.carNameInput.getNode().value = '';
    this.submitButton.getNode().disabled = true;
  }
}
