import Card from '../../../models/Card';
import { BaseComponent } from '../../BaseComponent';

export default class GameUIManager {
  private sourcesContainer: BaseComponent;

  constructor(sourcesContainer: BaseComponent) {
    this.sourcesContainer = sourcesContainer;
  }

  public displayCards(cards: Card[], isVisible: boolean) {
    cards.sort(() => Math.random() - 0.5);
    cards.forEach((card) => {
      card.toggleViability(isVisible);
      this.sourcesContainer.append(card.getCard());
    });
  }
}
