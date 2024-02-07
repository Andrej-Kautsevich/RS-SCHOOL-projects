import '../sass/style.scss';
import App from './App';

const mainContainer = document.createElement('main');
mainContainer.classList.add('page-wrapper');
document.body.append(mainContainer);

const app = new App();

app.start(mainContainer);
