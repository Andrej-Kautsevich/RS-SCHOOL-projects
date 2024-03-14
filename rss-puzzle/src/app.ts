import { BaseComponent } from './components/BaseComponent';
import UserNameEntry from './components/UserNameEntry/UserNameEntry';
import { main } from './components/tags';

class App {
  private loginEntry: BaseComponent;

  constructor(private root = document.body) {
    this.loginEntry = new UserNameEntry();
  }

  public start(): void {
    const mainComponent = main.call(null, { className: 'main' });
    mainComponent.append(this.loginEntry);

    this.root.append(mainComponent.getNode());
  }
}

const app = new App();

app.start();
