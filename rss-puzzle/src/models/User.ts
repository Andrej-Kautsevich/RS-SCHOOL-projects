import { localStorageService } from '../components/services/LocalStorageService';
import { UserData } from '../components/types';

export class User {
  private userData: UserData | undefined;

  constructor() {
    const savedUserData = localStorageService.getData('login');
    if (savedUserData) {
      this.userData = savedUserData;
    }
  }

  public saveUser(firstName: string, surname: string) {
    this.userData = { firstName, surname };
    localStorageService.saveData('login', this.userData);
  }

  public deleteUser() {
    localStorageService.removeData('login');
    this.userData = undefined;
  }

  public isAuth(): boolean {
    if (this.userData) return true;
    return false;
  }
}

export const user = new User();
