import WinnersModel from '../Models/WinnersModel';
import { WinnersQueryParams, Winner } from '../types/types';
import { WinnersQueryParamsSort, WinnersQueryParamsOrder, ObserverEvents, WINNERS_PER_PAGE } from '../types/enums';
import WinnersView from '../Views/WinnersView/WinnersView';

export default class WinnersController {
  private winnersModel: WinnersModel;

  private winnersView: WinnersView;

  private params: WinnersQueryParams = {
    page: 1,
    limit: WINNERS_PER_PAGE,
    sort: WinnersQueryParamsSort.id,
    order: WinnersQueryParamsOrder.ASC,
  };

  constructor() {
    this.winnersModel = new WinnersModel();
    this.winnersView = new WinnersView();
    this.init();
  }

  private setPaginationListeners(): void {
    this.winnersView.prevButton.addListener('click', () => {
      this.params.page -= 1;
      this.renderPage();
    });
    this.winnersView.nextButton.addListener('click', () => {
      this.params.page += 1;
      this.renderPage();
    });
  }

  private handleSortClick(): void {
    this.winnersView.observer.subscribe(ObserverEvents.sortTime, async () =>
      this.sortTable(WinnersQueryParamsSort.time),
    );
    this.winnersView.observer.subscribe(ObserverEvents.sortWins, async () =>
      this.sortTable(WinnersQueryParamsSort.wins),
    );
  }

  private async sortTable(sort: WinnersQueryParamsSort): Promise<void> {
    if (this.params.sort === sort) this.toggleSortOrder();
    this.params.sort = sort;
    const { winners } = await this.getWinners();
    this.winnersView.drawTable(winners, this.params);
  }

  private toggleSortOrder(): void {
    if (this.params.order === WinnersQueryParamsOrder.ASC) {
      this.params.order = WinnersQueryParamsOrder.DESC;
    } else {
      this.params.order = WinnersQueryParamsOrder.ASC;
    }
  }

  public getPage(): HTMLElement {
    return this.winnersView.getPage();
  }

  public toggleVisibility(): void {
    this.winnersView.toggleVisibility();
  }

  private async getWinners(): Promise<{ winners: Winner[]; total: number }> {
    const { winners, totalCount } = await this.winnersModel.getWinners(this.params);
    const updatedWinners = await Promise.all(
      winners.map(async (winner) => {
        const { name, color } = await this.winnersModel.getWinnerCar(winner.id);
        return { ...winner, name, color };
      }),
    );
    return { winners: updatedWinners, total: totalCount };
  }

  public async renderPage(): Promise<void> {
    const { winners, total } = await this.getWinners();
    this.winnersView.renderPage(winners, this.params.page, total, this.params);
  }

  private async init(): Promise<void> {
    await this.renderPage();
    this.setPaginationListeners();
    this.handleSortClick();
  }
}
