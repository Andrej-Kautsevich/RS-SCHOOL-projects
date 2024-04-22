import { BaseComponent } from '../../../../utils/BaseComponent';
import { button, div, form, input, label, p } from '../../../../utils/tags';
import styles from './loginFormView.module.scss';
import buttonStyles from '../../../../styles/button.module.scss';

export default class LoginFormView {
  public form: BaseComponent<HTMLFormElement>;

  public loginInput: BaseComponent<HTMLInputElement>;

  public passwordInput: BaseComponent<HTMLInputElement>;

  public submitButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.loginInput = input({
      className: styles.form__input,
      type: 'text',
      name: 'login',
      id: 'login',
      required: true,
      pattern: '^[A-Za-z\\-]{3,}$',
      placeholder: 'login',
      autocomplete: 'off',
    });

    this.passwordInput = input({
      className: styles.form__input,
      type: 'password',
      name: 'password',
      id: 'password',
      required: true,
      pattern: '^(?=.*[A-Z])(?=.*\\d).{4,}$',
      placeholder: 'password',
      // autocomplete: 'new-password',
    });

    this.submitButton = button({
      classNames: [styles.form__button, buttonStyles.button],
      txt: 'Enter',
      type: 'submit',
      disabled: true,
    });

    this.form = form(
      { classNames: [styles.login__form, styles.form] },
      div(
        { className: styles.form__field },
        label({ className: styles.formLabel, txt: 'Enter login', htmlFor: 'login' }),
        this.loginInput,
        p({
          className: styles.form__requirements,
          txt: "The user's login must consist only of letters of the English alphabet and a hyphen ('-') and contain at least 3 letters",
        }),
      ),
      div(
        { className: styles.form__field },
        label({ className: styles.form__label, txt: 'Enter password:', htmlFor: 'password' }),
        this.passwordInput,
        p({
          className: styles.form__requirements,
          txt: "The user's password must have at least 1 upper case letter, at least 1 number and contain at least 4 symbols",
        }),
      ),
      this.submitButton,
    );
  }

  public getForm() {
    return this.form.getNode();
  }

  public clearForm() {
    this.loginInput.getNode().value = '';
    this.passwordInput.getNode().value = '';
    this.submitButton.getNode().disabled = true;
  }
}
