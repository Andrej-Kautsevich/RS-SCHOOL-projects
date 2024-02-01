import Cross from './Cross/Cross';
import Timer from './components/Timer';
import GameButtons from './components/GameButtons';
import createMenuBar from './layout/menubar';

export default class App {
  constructor(template) {
    this.timer = new Timer();
    this.cross = new Cross(template, this.timer);
    this.gameButtons = new GameButtons(this.cross);
  }

  start(container) {
    const crossNode = this.cross.getCross();
    const timerNode = this.timer.getTimer();
    const gameButtons = this.gameButtons.getGameButtons();
    const menuBar = createMenuBar();

    container.append(crossNode, timerNode, gameButtons, menuBar);

    this.cross.resetCross();
  }
}
