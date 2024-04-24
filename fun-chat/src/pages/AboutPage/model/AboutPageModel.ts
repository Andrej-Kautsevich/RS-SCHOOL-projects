import AboutPageView from '../view/AboutPageView';

export default class AboutPageModel {
  private view: AboutPageView;

  constructor() {
    this.view = new AboutPageView();
    this.setBackButtonHandler();
  }

  public openPage(root: HTMLElement) {
    root.append(this.getPage());
  }

  public getPage() {
    return this.view.getPage();
  }

  public setBackButtonHandler() {
    this.view.getBackButton().addListener('click', () => {
      window.history.back();
    });
  }
}
