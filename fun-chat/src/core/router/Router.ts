import PAGES from '../../pages/types';

type RouteHandler = () => void;

type Route = {
  path: string;
  callback: RouteHandler;
};

const PATH_SEGMENTS_TO_KEEP = 2;

export default class Router {
  private routes: Route[] = [];

  constructor() {
    window.addEventListener('popstate', () => this.loadInitialRoute());

    window.addEventListener('DOMContentLoaded', () => this.loadInitialRoute());
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
    const pathSeg = pathnameSplit.slice(PATH_SEGMENTS_TO_KEEP + 1).join('/');

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
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    const url = `${basePath}/${path}`;
    window.history.pushState({}, '', url);
    this.loadRoute(path);
  }
}
