import { BaseComponent } from '../../helpers/BaseComponent';
import createSVGUse from '../../helpers/createSVGUse';
import { button, div, h, span } from '../../helpers/tags';
import Car from '../../Models/Car/Car';
import styles from './garageView.module.scss';
import buttonStyles from '../../styles/button.module.scss';
import CreateCarView from './manageCarView/CreateCarView';
import Observer from '../../helpers/Observer';
import UpdateCarView from './manageCarView/updateCarView';
import GarageButtonsView from './garageButtonsVIew/GarageButtonsView';
import { CarInterface } from '../../types/types';
import { WINNER_TIME_DISPLAY } from '../../types/enums';

export default class GarageView {
  private garagePage: BaseComponent;

  private garageItems: BaseComponent;

  private title: BaseComponent<HTMLHeadingElement>;

  private pagination: BaseComponent;

  public nextButton: BaseComponent<HTMLButtonElement>;

  public prevButton: BaseComponent<HTMLButtonElement>;

  public garageButtons: GarageButtonsView;

  public createCarForm: CreateCarView;

  public updateCarForm: UpdateCarView;

  public observer: Observer<unknown> = Observer.getInstance();

  constructor() {
    this.garagePage = div({ className: styles.garage });
    this.createCarForm = new CreateCarView();
    this.updateCarForm = new UpdateCarView();
    this.garageButtons = new GarageButtonsView();
    const garageForms = div(
      { classNames: [styles.garage__forms] },
      this.createCarForm.getForm(),
      this.updateCarForm.getForm(),
    );

    this.title = h(2, { className: styles.garage__title, txt: 'Garage' });
    this.garageItems = div({ classNames: [styles.garage__items] });

    this.pagination = div({ classNames: [styles.garage__pagination, styles.pagination] });
    this.prevButton = button({ classNames: [buttonStyles.button], txt: 'Prev' });
    this.nextButton = button({ classNames: [buttonStyles.button], txt: 'Next' });

    this.garagePage.appendChildren([garageForms, this.garageButtons.getNode(), this.title, this.garageItems]);
  }

  public drawCars(cars: Car[]) {
    this.garageItems.destroyChildren();
    cars.forEach((car) => {
      const garageItem = div({ classNames: [styles.garage__item, styles.car] });
      const deleteBtn = button({ classNames: [buttonStyles.button], txt: 'Delete' });
      deleteBtn.addListener('click', () => {
        this.observer.notify('delete', car.id);
      });
      const selectBtn = button({ classNames: [buttonStyles.button], txt: 'Select' });
      selectBtn.addListener('click', () => {
        this.observer.notify('select', car.id);
      });
      const info = div({ className: styles.car__info }, deleteBtn, selectBtn, span({ txt: car.name }));

      const road = div({ className: styles.car__road }, car.getNode(), createSVGUse('flag', [styles.car__flag]));
      garageItem.appendChildren([info, car.engineButtons.getNode(), road]);
      this.garageItems.append(garageItem);

      const carWidth = car.getNode().clientWidth;
      car.setRoad(road);
      car.setCarWidth(carWidth);
    });
    return cars;
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

  public showWinner(car: CarInterface, time: number) {
    const winnerWrapper = div({ classNames: [styles.garage__winner], txt: `${car.name} wins in time: ${time}s` });
    this.garagePage.append(winnerWrapper);
    setTimeout(() => {
      winnerWrapper.destroy();
    }, WINNER_TIME_DISPLAY);
  }

  public getPage() {
    return this.garagePage.getNode();
  }

  public async renderPage(cars: Car[], currentPage: number, total: number) {
    const renderedCars = this.drawCars(cars);
    let totalPages = 1;
    if (total) {
      totalPages = Math.ceil(total / 7);
    }
    this.drawTitle(total);
    this.drawPagination(currentPage, totalPages);
    return renderedCars;
  }

  public toggleVisibility() {
    this.garagePage.toggleClass(styles.hidden);
  }
}
