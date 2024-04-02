import WinnersModel from '../Models/WinnersModel';
import { WinnersQueryParamsOrder, WinnersQueryParams, WinnersQueryParamsSort } from '../types/types';
import WinnersView from '../Views/WinnersView/WinnersView';

export default class WinnersController {
  private winnersModel: WinnersModel;

  private winnersView: WinnersView;

  private params: WinnersQueryParams = {
    page: 1,
    limit: 10,
    sort: WinnersQueryParamsSort.id,
    order: WinnersQueryParamsOrder.ASC,
  };

  constructor() {
    this.winnersModel = new WinnersModel();
    this.winnersView = new WinnersView();
    this.init();
  }

  private setPaginationListeners() {
    this.winnersView.prevButton.addListener('click', () => {
      this.params.page -= 1;
      this.renderPage();
    });
    this.winnersView.nextButton.addListener('click', () => {
      this.params.page += 1;
      this.renderPage();
    });
  }

  private handleSortClick() {
    this.winnersView.observer.subscribe('sortTime', async () => {
      if (this.params.sort === WinnersQueryParamsSort.time) {
        this.toggleSortOrder();
      }
      this.params.sort = WinnersQueryParamsSort.time;
      const { winners } = await this.getWinners();
      this.winnersView.drawTable(winners, this.params);
    });
    this.winnersView.observer.subscribe('sortWins', async () => {
      if (this.params.sort === WinnersQueryParamsSort.wins) {
        this.toggleSortOrder();
      }
      this.params.sort = WinnersQueryParamsSort.wins;
      const { winners } = await this.getWinners();
      this.winnersView.drawTable(winners, this.params);
    });
  }

  private toggleSortOrder() {
    if (this.params.order === WinnersQueryParamsOrder.ASC) {
      this.params.order = WinnersQueryParamsOrder.DESC;
    } else {
      this.params.order = WinnersQueryParamsOrder.ASC;
    }
  }

  public getPage() {
    return this.winnersView.getPage();
  }

  public toggleVisibility() {
    this.winnersView.toggleVisibility();
  }

  private async getWinners() {
    const { winners, total } = await this.winnersModel.getWinners(this.params);
    const updatedWinners = await Promise.all(
      winners.winners.map(async (winner) => {
        const { name, color } = await this.winnersModel.getWinnerCar(winner.id);
        return { ...winner, name, color };
      }),
    );
    return { winners: updatedWinners, total };
  }

  public async renderPage() {
    const { winners, total } = await this.getWinners();
    this.winnersView.renderPage(winners, this.params.page, total, this.params);
  }

  private async init() {
    await this.renderPage();
    this.setPaginationListeners();
    this.handleSortClick();
  }
}
