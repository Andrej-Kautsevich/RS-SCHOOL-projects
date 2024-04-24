import { BaseComponent } from '../../../utils/BaseComponent';
import { button, div, span } from '../../../utils/tags';
import styles from './AboutPageView.module.scss';
import buttonStyles from '../../../styles/button.module.scss';

export default class AboutPageView {
  private page: BaseComponent;

  private backButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.page = div({ className: styles.aboutPage });
    this.backButton = button({ classNames: [styles.button, buttonStyles.button], txt: 'Back' });
    const content = div(
      { className: styles.content },
      span({ textContent: 'This is educational project' }),
      this.backButton,
    );

    this.page.append(content);
  }

  public getPage() {
    return this.page.getNode();
  }

  public getBackButton() {
    return this.backButton;
  }
}
