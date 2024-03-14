export class RouterService {
  routes: { [key: string]: () => void };

  constructor() {
    this.routes = {};
  }

  addRoute(path: string, callback: () => void) {
    this.routes[path] = callback;
  }

  navigateTo(path: string) {
    if (this.routes[path]) {
      this.routes[path]();
    } else {
      throw new Error('Route not found!');
    }
  }
}

export const router = new RouterService();
