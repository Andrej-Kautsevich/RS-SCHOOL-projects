import PAGES from '../../pages/types';

type RouteHandler = () => void;

type Route = {
  path: string;
  callback: RouteHandler;
};

export default class Router {
  private routes: Route[] = [];

  constructor() {
    window.addEventListener('popstate', () => this.loadInitialRoute());
  }

  // private getCurrentURL() {
  //   const path = window.location.pathname;
  //   return path;
  // }

  private matchUrlToRoute(urlSeg: string) {
    const matchedRoute = this.routes.find((route) => route.path === urlSeg);
    return matchedRoute;
  }

  private loadInitialRoute() {
    const pathnameSplit = window.location.pathname.split('/');
    const pathSeg = pathnameSplit.slice(0).join('/');

    this.loadRoute(pathSeg);
  }

  public setRoutes(routes: Route[]) {
    this.routes = routes;
  }

  public loadRoute(urlSeg: string) {
    const matchedRoute = this.matchUrlToRoute(urlSeg);
    if (!matchedRoute) {
      throw new Error('Route not found');
    }
    matchedRoute.callback();
  }

  public navigateTo(path: PAGES) {
    window.history.pushState({}, '', path);
    this.loadRoute(path);
  }
}
