import '../sass/style.scss';
import App from './App';
// import templates from './templates';

const mainContainer = document.createElement('main');
mainContainer.classList.add('page-wrapper');
document.body.append(mainContainer);

const app = new App(/* templates[1].template */);

app.start(mainContainer);
