import { localStorageService } from '../services/LocalStorageService';
import { UserData, UserSettings } from '../types';

export class User {
  private userData: UserData | undefined;

  private userSettings: UserSettings = { pronunciationHint: true, translateHint: true, backgroundHint: true };

  constructor() {
    const savedUserData = localStorageService.getData('user');
    if (savedUserData) {
      this.userData = savedUserData;
    }
  }

  public saveUser(firstName: string, surname: string) {
    this.userData = { firstName, surname, settings: this.userSettings };
    localStorageService.saveData('user', this.userData);
  }

  public deleteUser() {
    localStorageService.removeData('user');
    this.userData = undefined;
  }

  public isAuth(): boolean {
    if (this.userData) return true;
    return false;
  }

  public getSettings() {
    if (this.userData?.settings) return this.userData.settings;
    return null;
  }

  public setSettings(settingKey: keyof UserSettings, settingValue: boolean) {
    if (this.userData && this.userData.settings) {
      this.userData.settings[settingKey] = settingValue;
      localStorageService.saveData('user', this.userData);
    }
  }
}

export const user = new User();
