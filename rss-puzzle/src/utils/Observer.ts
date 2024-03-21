export interface ObserverFunction<T> {
  update: (data: T) => void;
}

export class Observer<T> {
  private observers: ObserverFunction<T>[] = [];

  public subscribe(observer: ObserverFunction<T>): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: ObserverFunction<T>) {
    this.observers = this.observers.filter((subscriber) => subscriber !== observer);
  }

  public unsubscribeAll() {
    this.observers = [];
  }

  public notify(data: T) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

export const statisticsPageObserver = new Observer<void>();
