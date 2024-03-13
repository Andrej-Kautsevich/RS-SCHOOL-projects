import { main } from './components/tags';

class App {
  constructor(private root = document.body) {}

  public start(): void {
    const mainComponent = main.call(null, ['main']);
    this.root.append(mainComponent.getNode());
  }
}

const app = new App();

app.start();
