// import Observer from '../../../core/observer/Observer';
import Router from '../../../core/router/Router';
import StorageService from '../../../core/sessionStorage/SessionStorageService';
import FooterModel from '../../components/Footer/model/FooterModel';
import HeaderModel from '../../components/Header/model/HeaderModel';
import PAGES from '../../types';
import ContactsModel from '../contacts/model/ContactsModel';
import DialogModel from '../dialog/model/DialogModel';
import MainPageView from '../view/MainPageView';

export default class MainPageModel {
  private view: MainPageView;

  private header: HeaderModel;

  private footer: FooterModel;

  private userList: ContactsModel;

  private dialogWindow: DialogModel;

  private router: Router;

  // private observer = Observer.getInstance();

  private sessionStorageService = StorageService.getInstance();

  constructor(router: Router) {
    this.router = router;
    this.header = new HeaderModel(this.router);
    this.footer = new FooterModel();
    this.userList = new ContactsModel();
    this.dialogWindow = new DialogModel();
    this.view = new MainPageView(
      this.header.getHeader(),
      this.footer.getFooter(),
      this.userList.getUserList(),
      this.dialogWindow.getDialogWindow(),
    );
  }

  public openPage(root: HTMLElement) {
    const user = this.sessionStorageService.getData('user');
    if (!user) {
      this.router.navigateTo(PAGES.LOGIN);
    } else {
      root.append(this.getPage());
    }
  }

  public getPage() {
    return this.view.getPage();
  }
}
