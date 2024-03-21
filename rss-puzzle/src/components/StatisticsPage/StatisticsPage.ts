import { statisticsPageObserver } from '../../utils/Observer';
import { BaseComponent } from '../BaseComponent';
import { button, h, span } from '../tags';
import styles from './statisticsPage.module.scss';
import buttonStyles from '../../styles/button.module.scss';
import gameButtonStyles from '../MainGamePage/GameButtons/GameButton.module.scss';
import iconStyles from '../../styles/icons.module.scss';
import { router } from '../../services/RouterService';
import { PagesId } from '../../types';

export default class StatisticsPage extends BaseComponent {
  constructor() {
    super(
      { className: styles.statistics },
      h(1, { className: styles.statistics__title, txt: 'Game statistics' }),
      button(
        {
          classNames: [
            buttonStyles.button,
            buttonStyles.buttonHasIcon,
            gameButtonStyles.buttons__continue,
            gameButtonStyles.gameButton,
          ],
          onclick: () => {
            statisticsPageObserver.notify();
            router.navigateTo(PagesId.main);
          },
        },
        span({ className: gameButtonStyles.gameButtonText, txt: 'Continue' }),
        span({ classNames: [gameButtonStyles.gameButtonIcon, iconStyles.icon, iconStyles.iconContinue] }),
      ),
    );
  }
}
