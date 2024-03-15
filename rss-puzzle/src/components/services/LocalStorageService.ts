import { UserData } from '../types';

export class StorageService<T> {
  private storageKeyPrefix: string;

  constructor(storageKeyPrefix: string) {
    this.storageKeyPrefix = storageKeyPrefix;
  }

  private getStorageKey(key: string): string {
    return `${this.storageKeyPrefix}_${key}`;
  }

  public saveData(key: string, data: T): void {
    const storageKey = this.getStorageKey(key);
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  public getData(key: string): T | undefined {
    const storageKey = this.getStorageKey(key);
    const data = localStorage.getItem(storageKey);
    if (!data) {
      return undefined;
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error parsing data: ${error}`);
    }
  }
}

export const localStorageService = new StorageService<UserData>('user');
