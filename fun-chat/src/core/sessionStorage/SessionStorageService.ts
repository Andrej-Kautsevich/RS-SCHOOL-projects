import { SessionStorageData } from './types';

export default class StorageService<T> {
  private static sessionStorageService = new StorageService<SessionStorageData>('fun-chat');

  public static getInstance(): StorageService<SessionStorageData> {
    return StorageService.sessionStorageService;
  }

  private storageKeyPrefix: string;

  constructor(storageKeyPrefix: string) {
    this.storageKeyPrefix = storageKeyPrefix;
  }

  private getStorageKey(key: string): string {
    return `${this.storageKeyPrefix}_${key}`;
  }

  public saveData<K extends keyof T>(key: K, data: T[K]): void {
    const storageKey = this.getStorageKey(key.toString());
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }

  public removeData<K extends keyof T>(key: K): void {
    const storageKey = this.getStorageKey(key.toString());
    sessionStorage.removeItem(storageKey);
  }

  public getData<K extends keyof T>(key: K): T[K] | null {
    const storageKey = this.getStorageKey(key.toString());
    const data = sessionStorage.getItem(storageKey);
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
