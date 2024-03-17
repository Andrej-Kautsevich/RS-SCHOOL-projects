import { isNotNullable } from '../utils/helpers';

export type Props<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
  txt?: string;
  tag?: keyof HTMLElementTagNameMap;
  classNames?: string[];
};

export type ElementFnProps<T extends HTMLElement = HTMLElement> = Omit<Props<T>, 'tag'>;

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
    if (props.classNames) {
      node.classList.add(...props.classNames);
    }
    this.node = node;

    if (children) {
      this.appendChildren(children);
    }
  }

  /**
   * Appends a child component to the current component.
   */
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

  /**
   * Returns the HTML node associated with the component.
   */
  public getNode() {
    return this.node;
  }

  /**
   * Returns an array of child components.
   */
  public getChildren() {
    return this.children;
  }

  /**
   * Sets the text content of the component.
   */
  public setTextContent(content: string): void {
    this.node.textContent = content;
  }

  /**
   * Sets an attribute on the component's HTML node.
   */
  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  /**
   * Removes an attribute from the component's HTML node.
   */
  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  /**
   * Toggles the presence of a CSS class on the component's HTML node.
   * @param {boolean} force - If force is not given, "toggles" token, removing it if it's present and adding it if it's not present. If force is true, adds token (same as add()). If force is false, removes token (same as remove()).
   */
  public toggleClass(className: string, force?: boolean): void {
    this.node.classList.toggle(className, force);
  }

  /**
   * Add one or more CSS classes on the component's HTML node.
   * @param {string[]} classNames - array of classes names
   */
  public addClasses(classNames: string[]): void {
    this.node.classList.add(...classNames);
  }

  /**
   * Remove one or more CSS classes on the component's HTML node.
   * @param {string[]} classNames - array of classes names
   */
  public removeClasses(classNames: string[]): void {
    this.node.classList.remove(...classNames);
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
