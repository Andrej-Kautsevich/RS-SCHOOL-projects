import MainGamePage from './MainGamePage';

export default class EventHandlers {
  mainGamePage: MainGamePage;

  constructor(mainGamePage: MainGamePage) {
    this.mainGamePage = mainGamePage;
  }

  public handleContinue() {
    this.mainGamePage.currentRoundSentence += 1;
  }
}
