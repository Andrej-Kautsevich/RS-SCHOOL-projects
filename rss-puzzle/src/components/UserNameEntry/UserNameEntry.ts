import { button, div, form, input, label, p } from '../tags';
import styles from './userNameEntry.module.scss';
import buttonStyles from '../../styles/button.module.scss';

import { BaseComponent } from '../BaseComponent';

export default class UserNameEntry extends BaseComponent {
  private form: BaseComponent<HTMLFormElement>;

  private firstNameInput: BaseComponent<HTMLInputElement>;

  private surnameInput: BaseComponent<HTMLInputElement>;

  private submitButton: BaseComponent;

  constructor() {
    super({ className: styles.userEntry });

    this.firstNameInput = input({
      className: styles.formInput,
      type: 'text',
      name: 'userFirstName',
      required: true,
      pattern: '^[A-Z][A-Za-z\\-]{2,}$',
      placeholder: '',
    });

    this.surnameInput = input({
      className: styles.formInput,
      type: 'text',
      name: 'userSurname',
      required: true,
      pattern: '^[A-Z][A-Za-z\\-]{3,}$',
      placeholder: '',
    });

    this.submitButton = button({
      classNames: [styles.formButton, buttonStyles.button],
      txt: 'Submit',
      type: 'submit',
      disabled: true,
    });

    this.form = form(
      { classNames: [styles.userEntryForm, styles.form] },
      div(
        { className: styles.formField },
        label({ className: styles.formLabel, txt: 'First Name:' }),
        this.firstNameInput,
        p({
          className: styles.formRequirements,
          txt: "The user's first name must begin with a capital letter, consist only of letters of the English alphabet and a hyphen ('-') and contain at least 3 letters",
        }),
      ),
      div(
        { className: styles.formField },
        label({ className: styles.formLabel, txt: 'Surname:' }),
        this.surnameInput,
        p({
          className: styles.formRequirements,
          txt: "The user's surname must begin with a capital letter, consist only of letters of the English alphabet and a hyphen ('-') and contain at least 4 letters",
        }),
      ),
      this.submitButton,
    );
    this.append(this.form);

    this.setupFormValidation();
  }

  private setupFormValidation() {
    this.firstNameInput.addListener('input', this.validateForm);
    this.surnameInput.addListener('input', this.validateForm);
  }

  private validateForm = () => {
    if (this.firstNameInput.getNode().validity.valid && this.surnameInput.getNode().validity.valid) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'true');
    }
  };
}
