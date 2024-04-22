import { BaseComponent } from '../../utils/BaseComponent';
import { div } from '../../utils/tags';

export default class AppView {
  private pagesContainer: BaseComponent;

  constructor() {
    this.pagesContainer = div({ className: 'site-wrapper' });
  }

  public getHTML(): HTMLElement {
    return this.pagesContainer.getNode();
  }
}
