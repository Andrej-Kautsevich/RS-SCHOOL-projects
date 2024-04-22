import Router from '../../core/router/Router';
import LoginPageModel from '../../pages/LoginPage/model/LoginPageModel';
import PAGES from '../../pages/types';
import { div } from '../../utils/tags';
import AppView from '../view/AppView';

export default class AppModel {
  private view: AppView;

  private root: HTMLElement;

  private router: Router = new Router();

  constructor() {
    this.view = new AppView();
    this.root = this.getHTML();
    this.initPages();
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }

  private initPages() {
    const loginPage = new LoginPageModel(this.router);

    const routes = [
      {
        path: PAGES.LOGIN,
        callback: () => {
          this.root.innerHTML = '';
          this.root.append(loginPage.getPage());
        },
      },
      {
        path: PAGES.MAIN,
        callback: () => {
          this.root.innerHTML = '';
          this.root.append(div({ textContent: 'text' }).getNode());
        },
      },
    ];

    this.router.setRoutes(routes);
    this.router.navigateTo(PAGES.LOGIN);
  }
}
