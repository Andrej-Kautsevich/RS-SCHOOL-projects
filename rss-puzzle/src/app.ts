import { BaseComponent } from './components/BaseComponent';
import UserNameEntry from './components/UserNameEntry/UserNameEntry';
import { router } from './components/services/RouterService';
import { div, main } from './components/tags';
import { PagesId } from './components/types';

class App {
  private loginEntry: BaseComponent;

  private root: HTMLElement;

  private mainComponent: BaseComponent;

  constructor() {
    this.root = document.body;
    this.loginEntry = new UserNameEntry();
    this.mainComponent = main.call(null, { className: 'main' });

    router.addRoute(PagesId.login, () => {
      this.renderPage(this.loginEntry);
    });
    router.addRoute(PagesId.start, () => {
      this.renderPage(div({})); // TODO: add start page
    });

    this.start();
  }

  public start() {
    this.root.append(this.mainComponent.getNode());
    router.navigateTo(PagesId.login);
  }

  private renderPage(page: BaseComponent) {
    this.mainComponent.getNode().innerHTML = '';
    this.mainComponent.append(page.getNode());
  }
}

const app = new App();

app.start();
