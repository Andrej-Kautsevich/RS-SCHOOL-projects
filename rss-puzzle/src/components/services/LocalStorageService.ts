export default class StorageService<T> {
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

  public getData(key: string): T | null {
    const storageKey = this.getStorageKey(key);
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
