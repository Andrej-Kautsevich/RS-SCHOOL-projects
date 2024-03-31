import GarageController from '../../Controllers/GarageController';
import { BaseComponent } from '../../helpers/BaseComponent';
import createSVGUse from '../../helpers/createSVGUse';
import { button, div, h, span } from '../../helpers/tags';
import Car from '../../Models/Car/Car';
import styles from './garageView.module.scss';
import buttonStyles from '../../styles/button.module.scss';

export default class GarageView {
  controller: GarageController;

  private garagePage: BaseComponent;

  private raceTracks: BaseComponent;

  private title: BaseComponent<HTMLHeadingElement>;

  private pagination: BaseComponent | undefined;

  constructor(garageController: GarageController) {
    this.controller = garageController;

    this.garagePage = div({ className: styles.garage });
    this.title = h(2, { className: styles.garage__title, txt: 'Garage' });
    this.raceTracks = div({ classNames: [styles.raceTracks] });

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
    if (this.pagination) {
      this.pagination.destroy();
    }
    this.pagination = div({ classNames: [styles.garage__pagination, styles.pagination] });

    const paginationText = span({ classNames: [styles.pagination__text], txt: `Page: ${page} / ${totalPages}` });
    const prevButton = button({ classNames: [buttonStyles.button], txt: 'Prev' });
    prevButton.getNode().disabled = page === 1;
    const nextButton = button({ classNames: [buttonStyles.button], txt: 'Next' });
    nextButton.getNode().disabled = page === totalPages;

    prevButton.addListener('click', async () => {
      const { cars, total } = await this.controller.getPrevPageCars();
      this.renderPage(cars, total);
    });

    nextButton.addListener('click', async () => {
      const { cars, total } = await this.controller.getNextPageCars();
      this.renderPage(cars, total);
    });

    this.pagination.appendChildren([paginationText, prevButton, nextButton]);
    this.garagePage.append(this.pagination);
  }

  public drawTitle(totalCars: number) {
    this.title.setTextContent(`Garage (${totalCars})`);
  }

  public getPage() {
    return this.garagePage.getNode();
  }

  public async renderPage(cars: Car[], total: number) {
    this.drawCars(cars);
    let totalPages = 1;
    if (total) {
      totalPages = Math.ceil(total / 7);
    }
    this.drawPagination(this.controller.currentPage, totalPages);
    this.drawTitle(total);
  }
}
