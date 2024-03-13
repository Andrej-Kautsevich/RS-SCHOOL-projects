import isNotNullable from '../utils/helpers';

export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
  txt?: string;
  tag?: keyof HTMLElementTagNameMap;
};

export class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected children: BaseComponent[] = [];

  constructor(props: Props<T>, ...children: (BaseComponent | HTMLElement)[]) {
    const node = document.createElement(props.tag ?? 'div') as T;
    // Assign properties from props to the node
    Object.assign(node, props);

    if (props.txt) {
      node.textContent = props.txt;
    }
    this.node = node;

    if (children) {
      this.appendChildren(children);
    }
  }

  public append(child: BaseComponent | HTMLElement): void {
    if (child instanceof BaseComponent) {
      this.children.push(child);
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public appendChildren(children: (BaseComponent | HTMLElement | null)[]): void {
    children.filter(isNotNullable).forEach((el) => {
      this.append(el);
    });
  }

  public getNode() {
    return this.node;
  }

  public getChildren() {
    return this.children;
  }

  public setTextContent(content: string): void {
    this.node.textContent = content;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public addListener(event: string, listener: EventListener, options = false): void {
    this.node.addEventListener(event, listener, options);
  }

  public removeListener(event: string, listener: EventListener, options = false): void {
    this.node.removeEventListener(event, listener, options);
  }

  /**
   * Destroys all child components associated with the current component.
   */
  destroyChildren() {
    this.children.forEach((child) => {
      child.destroy();
    });
    this.children.length = 0;
  }

  /**
   * Destroys the current component and removes its HTML node from the DOM.
   */
  destroy() {
    this.destroyChildren();
    this.node.remove();
  }
}
