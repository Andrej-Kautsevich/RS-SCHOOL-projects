import './sources.css';
import { SourceItem, View } from '../../../types/index';

class Sources implements View<SourceItem> {
    draw(data: SourceItem[]): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = document.querySelector('#sourceItemTemp') as HTMLTemplateElement;

        data.forEach((item: SourceItem) => {
            if (sourceItemTemp instanceof HTMLElement) {
                const sourceClone = sourceItemTemp.content.cloneNode(true) as DocumentFragment;

                const sourceItemName = sourceClone.querySelector('.source__item-name');
                const sourceItem = sourceClone.querySelector('.source__item');

                if (sourceItemName instanceof HTMLElement && sourceItem instanceof HTMLElement) {
                    sourceItemName.textContent = item.name;
                    sourceItem.setAttribute('data-source-id', item.id.toString());

                    fragment.append(sourceClone);
                }
            }
        });

        const sources = document.querySelector('.sources');
        if (sources instanceof HTMLElement) {
            sources.append(fragment);
        }
    }
}

export default Sources;
