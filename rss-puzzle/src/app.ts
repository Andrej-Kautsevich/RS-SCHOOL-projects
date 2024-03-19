import { BaseComponent } from './components/BaseComponent';
import StartScreen from './components/StartScreen/StartScreen';
import UserNameEntry from './components/UserNameEntry/UserNameEntry';
import { router } from './services/RouterService';
import { main } from './components/tags';
import { PagesId } from './types';
import { user } from './models/User';
import MainGamePage from './components/MainGamePage/MainGamePage';

class App {
  private loginEntry: UserNameEntry;

  private startScreen: StartScreen;

  private gamePage: MainGamePage;

  private root: HTMLElement;

  private mainComponent: BaseComponent;

  constructor() {
    this.root = document.body;
    this.loginEntry = new UserNameEntry();
    this.startScreen = new StartScreen();
    this.gamePage = new MainGamePage();
    this.mainComponent = main.call(null, { className: 'main' });

    router.addRoute(PagesId.login, () => {
      this.renderPage(this.loginEntry);
    });
    router.addRoute(PagesId.start, () => {
      this.startScreen.updateUserName();
      this.renderPage(this.startScreen);
    });
    router.addRoute(PagesId.main, () => {
      this.renderPage(this.gamePage);
      this.gamePage.startNewLevel();
    });

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
