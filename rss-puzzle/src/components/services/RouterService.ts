import { PagesId } from '../types';

export class RouterService {
  private routes: { [key in PagesId]?: () => void } = {};

  addRoute(path: PagesId, callback: () => void) {
    this.routes[path] = callback;
  }

  navigateTo(path: PagesId) {
    if (this.routes[path]) {
      this.routes[path]!();
    } else {
      throw new Error('Route not found!');
    }
  }
}

export const router = new RouterService();
