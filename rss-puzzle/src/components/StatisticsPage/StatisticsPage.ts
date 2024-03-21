import { BaseComponent } from '../BaseComponent';
import { h } from '../tags';
import styles from './statisticsPage.module.scss';

export default class StatisticsPage extends BaseComponent {
  constructor() {
    super({ className: styles.statistics }, h(1, { className: styles.statistics__title, txt: 'Game statistics' }));
  }
}
