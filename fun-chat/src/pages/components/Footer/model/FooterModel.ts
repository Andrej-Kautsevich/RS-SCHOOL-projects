import FooterView from '../view/FooterView';

export default class FooterModel {
  private view: FooterView;

  constructor() {
    this.view = new FooterView();
  }

  public getFooter() {
    return this.view.getFooter();
  }
}
