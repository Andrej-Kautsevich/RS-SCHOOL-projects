import { BaseComponent } from './BaseComponent';

export const div = (classNames: string[], ...children: (BaseComponent | HTMLElement)[]) => {
  const combinedClass = classNames.join(' ');
  return new BaseComponent<HTMLDivElement>({ className: combinedClass }, ...children);
};

export const p = (classNames: string[], txt?: string, ...children: BaseComponent[]) => {
  const combinedClass = classNames.join(' ');
  return new BaseComponent<HTMLParagraphElement>({ tag: 'p', className: combinedClass, txt }, ...children);
};

export const main = (classNames: string[], ...children: BaseComponent[]) => {
  const combinedClass = classNames.join(' ');
  return new BaseComponent<HTMLElementTagNameMap['main']>({ tag: 'main', className: combinedClass }, ...children);
};

export const form = (classNames: string[], ...children: BaseComponent[]) => {
  const combinedClass = classNames.join(' ');
  return new BaseComponent<HTMLFormElement>({ tag: 'form', className: combinedClass }, ...children);
};

export const label = (classNames: string[], text: string, ...children: (BaseComponent | HTMLElement)[]) => {
  const combinedClass = classNames.join(' ');
  return new BaseComponent<HTMLLabelElement>({ tag: 'label', className: combinedClass, txt: text }, ...children);
};

export const input = (classNames: string[], type: string, name: string, ...rest: Partial<HTMLInputElement>[]) => {
  const attributes = Object.assign({}, ...rest);
  const combinedClass = classNames.join(' ');
  return new BaseComponent<HTMLInputElement>({ tag: 'input', className: combinedClass, type, name, ...attributes });
};
export const button = (classNames: string[], text: string, type: string, ...rest: Partial<HTMLButtonElement>[]) => {
  const attributes = Object.assign({}, ...rest);
  const combinedClass = classNames.join(' ');
  return new BaseComponent<HTMLButtonElement>({
    tag: 'button',
    className: combinedClass,
    type,
    txt: text,
    ...attributes,
  });
};
