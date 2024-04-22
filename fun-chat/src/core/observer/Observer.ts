import ObserverEvents from './types';

type ObserverFunction<T> = (data: T) => void;

export default class Observer<T> {
  private static observer = new Observer();

  public static getInstance(): Observer<unknown> {
    return Observer.observer;
  }

  private listeners: Record<string, ObserverFunction<T>[]> = {};

  subscribe(event: ObserverEvents, callback: ObserverFunction<T>): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  unsubscribe(event: ObserverEvents, callback: ObserverFunction<T>): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
  }

  notify(event: ObserverEvents, data: T): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => callback(data));
  }
}
