import './sources.css';
import { SourceItem, View, assertIsDefined, assertIsInstanceOf, queryElement } from '../../../types/index';

class Sources implements View<SourceItem> {
    draw(data: SourceItem[]): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = document.querySelector('#sourceItemTemp');
        assertIsInstanceOf(sourceItemTemp, HTMLTemplateElement);

        data.forEach((item: SourceItem) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true);
            assertIsInstanceOf(sourceClone, DocumentFragment);

            const sourceItemName = queryElement(sourceClone, HTMLElement, '.source__item-name');
            assertIsDefined(sourceItemName);

            const sourceItem = queryElement(sourceClone, HTMLElement, '.source__item');
            assertIsDefined(sourceItem);

            sourceItemName.textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id.toString());

            fragment.append(sourceClone);
        });

        const sources = queryElement(document, HTMLElement, '.sources');
        assertIsDefined(sources);
        sources.append(fragment);
    }
}

export default Sources;
