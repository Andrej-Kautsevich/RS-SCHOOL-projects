import { BaseComponent } from '../../../../utils/BaseComponent';
import createSVGUse from '../../../../utils/createSVGUse';
import { a, footer, span } from '../../../../utils/tags';
import styles from './FooterView.module.scss';

export default class FooterView {
  private footer: BaseComponent;

  constructor() {
    this.footer = footer({ className: styles.footer });

    const logoIcon = createSVGUse('rs_school_logo');
    const logo = a({ className: styles.footer__link, href: 'https://rs.school/', target: 'blank' }, logoIcon);

    const gitLink = a(
      {
        className: styles.footer__link,
        href: 'https://github.com/Andrej-Kautsevich',
        target: 'blank',
      },
      span({ txt: 'Andrej-Kautsevich' }),
    );

    const date = span({ className: styles.footer__date, textContent: '2024' });

    this.footer.appendChildren([gitLink, logo, date]);
  }

  public getFooter() {
    return this.footer;
  }
}
