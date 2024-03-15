import { BaseComponent } from './components/BaseComponent';
import StartScreen from './components/StartScreen/StartScreen';
import UserNameEntry from './components/UserNameEntry/UserNameEntry';
import { router } from './components/services/RouterService';
import { main } from './components/tags';
import { PagesId } from './components/types';
import { user } from './models/User';

class App {
  private loginEntry: UserNameEntry;

  private startScreen: StartScreen;

  private root: HTMLElement;

  private mainComponent: BaseComponent;

  constructor() {
    this.root = document.body;
    this.loginEntry = new UserNameEntry();
    this.startScreen = new StartScreen();
    this.mainComponent = main.call(null, { className: 'main' });

    router.addRoute(PagesId.login, () => {
      this.renderPage(this.loginEntry);
    });
    router.addRoute(PagesId.start, () => {
      this.startScreen.updateUserName();
      this.renderPage(this.startScreen);
    });
    router.addRoute(PagesId.main, () => {});

    this.start();
  }

  public start() {
    this.root.append(this.mainComponent.getNode());
    if (user.isAuth()) {
      router.navigateTo(PagesId.start);
    } else {
      router.navigateTo(PagesId.login);
    }
  }

  private renderPage(page: BaseComponent) {
    this.mainComponent.getNode().innerHTML = '';
    this.mainComponent.append(page.getNode());
  }
}

const app = new App();

app.start();
