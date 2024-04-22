import AppModel from './App/model/AppModel';
import './styles/style.scss';

const app = new AppModel();
document.body.append(app.getHTML());
