import { NewsItem, View } from '../../../types/index';
import { assertIsDefined, assertIsInstanceOf, queryElement } from '../../../types/helpers';
import './news.css';
import img from '../../../assets/placeholder.jpg';

const MAX_ITEMS_PER_PAGE = 10;

class News implements View<NewsItem> {
    public draw(data: NewsItem[]): void {
        const news = data.length >= MAX_ITEMS_PER_PAGE ? data.filter((_item, idx) => idx < MAX_ITEMS_PER_PAGE) : data;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp');
        assertIsInstanceOf(newsItemTemp, HTMLTemplateElement);

        news.forEach((item: Readonly<NewsItem>, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true);
            assertIsInstanceOf(newsClone, DocumentFragment);
            assertIsDefined(newsClone);

            if (idx % 2) queryElement(newsClone, Element, '.news__item').classList.add('alt');

            queryElement(newsClone, HTMLElement, '.news__meta-photo').style.backgroundImage = `url(${
                item.urlToImage || img
            })`;
            queryElement(newsClone, HTMLElement, '.news__meta-author').textContent = item.author || item.source.name;
            queryElement(newsClone, HTMLElement, '.news__meta-date').textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            queryElement(newsClone, HTMLElement, '.news__description-title').textContent = item.title;
            queryElement(newsClone, HTMLElement, '.news__description-source').textContent = item.source.name;
            queryElement(newsClone, HTMLElement, '.news__description-content').textContent = item.description;
            queryElement(newsClone, HTMLElement, '.news__read-more a').setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        queryElement(document, Element, '.news').innerHTML = '';
        queryElement(document, Element, '.news').appendChild(fragment);
    }
}

export default News;
