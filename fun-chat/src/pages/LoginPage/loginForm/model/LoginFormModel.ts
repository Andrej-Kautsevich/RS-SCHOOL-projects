import StorageService from '../../../../core/sessionStorage/SessionStorageService';
import { loginUser } from '../../../../core/socket/actions/user-actions';
import WebSocketService from '../../../../core/socket/model/WebSocketService';
import { User } from '../../../../core/socket/types';
import LoginFormView from '../view/LoginFormView';

export default class LoginFormModel {
  private view: LoginFormView;

  private socket = WebSocketService.getInstance();

  private sessionStorageService = StorageService.getInstance();

  private user: User | null = null;

  constructor() {
    this.view = new LoginFormView();
    this.setupForm();
  }

  public getForm() {
    return this.view.getForm();
  }

  private setupForm() {
    this.view.loginInput.addListener('input', () => this.validateForm());
    this.view.passwordInput.addListener('input', () => this.validateForm());
    this.view.form.addListener('submit', (e) => this.handleSubmit(e));
  }

  private validateForm() {
    if (this.view.loginInput.getNode().validity.valid && this.view.passwordInput.getNode().validity.valid) {
      this.view.submitButton.removeAttribute('disabled');
    } else {
      this.view.submitButton.setAttribute('disabled', 'true');
    }
  }

  private handleSubmit(event: Event) {
    event.preventDefault();

    const login = this.view.loginInput.getNode().value;
    const password = this.view.passwordInput.getNode().value;

    this.user = {
      login,
      password,
    };

    this.socket.sendMessage(loginUser(this.user));
    this.sessionStorageService.saveData('user', this.user);

    this.view.clearForm();
  }
}
