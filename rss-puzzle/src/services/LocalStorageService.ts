import { UserLocalStorageData } from '../types';

export class StorageService<T> {
  private storageKeyPrefix: string;

  constructor(storageKeyPrefix: string) {
    this.storageKeyPrefix = storageKeyPrefix;
  }

  private getStorageKey(key: string): string {
    return `${this.storageKeyPrefix}_${key}`;
  }

  public saveData<K extends keyof T>(key: K, data: T[K]): void {
    const storageKey = this.getStorageKey(key.toString());
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  public removeData<K extends keyof T>(key: K): void {
    const storageKey = this.getStorageKey(key.toString());
    localStorage.removeItem(storageKey);
  }

  public getData<K extends keyof T>(key: K): T[K] | null {
    const storageKey = this.getStorageKey(key.toString());
    const data = localStorage.getItem(storageKey);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error parsing data: ${error}`);
    }
  }
}

export const localStorageService = new StorageService<UserLocalStorageData>('user');
