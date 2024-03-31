import { BaseComponent } from '../../helpers/BaseComponent';
import createSVGUse from '../../helpers/createSVGUse';
import { button, div, h, span } from '../../helpers/tags';
import Car from '../../Models/Car/Car';
import styles from './garageView.module.scss';
import buttonStyles from '../../styles/button.module.scss';

export default class GarageView {
  private garagePage: BaseComponent;

  private raceTracks: BaseComponent;

  private title: BaseComponent<HTMLHeadingElement>;

  private pagination: BaseComponent;

  public nextButton: BaseComponent<HTMLButtonElement>;

  public prevButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    this.garagePage = div({ className: styles.garage });
    this.title = h(2, { className: styles.garage__title, txt: 'Garage' });
    this.raceTracks = div({ classNames: [styles.raceTracks] });

    this.pagination = div({ classNames: [styles.garage__pagination, styles.pagination] });
    this.prevButton = button({ classNames: [buttonStyles.button], txt: 'Prev' });
    this.nextButton = button({ classNames: [buttonStyles.button], txt: 'Next' });

    this.garagePage.appendChildren([this.title, this.raceTracks]);
  }

  public drawCars(cars: Car[]) {
    this.raceTracks.destroyChildren();
    cars.forEach((car) => {
      const raceTrack = div({ classNames: [styles.raceTrack] });
      const flag = createSVGUse('flag', [styles.raceTrackFlag]);
      raceTrack.appendChildren([car.getNode(), flag]);
      this.raceTracks.append(raceTrack);
    });
  }

  public drawPagination(page: number, totalPages: number) {
    this.pagination?.destroyChildren();

    const paginationText = span({ classNames: [styles.pagination__text], txt: `Page: ${page} / ${totalPages}` });
    this.prevButton.getNode().disabled = page === 1;
    this.nextButton.getNode().disabled = page === totalPages;

    this.pagination.appendChildren([paginationText, this.prevButton, this.nextButton]);
    this.garagePage.append(this.pagination);
  }

  public drawTitle(totalCars: number) {
    this.title.setTextContent(`Garage (${totalCars})`);
  }

  public getPage() {
    return this.garagePage.getNode();
  }

  public async renderPage(cars: Car[], currentPage: number, total: number) {
    this.drawCars(cars);
    let totalPages = 1;
    if (total) {
      totalPages = Math.ceil(total / 7);
    }
    this.drawTitle(total);
    this.drawPagination(currentPage, totalPages);
  }
}
