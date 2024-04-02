import { BaseComponent, ElementFnProps } from './BaseComponent';

export const div = (props: ElementFnProps, ...children: (BaseComponent | Node)[]) => {
  return new BaseComponent<HTMLDivElement>({ ...props }, ...children);
};

export const p = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLParagraphElement>({ ...props, tag: 'p' }, ...children);
};

export const span = (props: ElementFnProps) => {
  return new BaseComponent<HTMLSpanElement>({ ...props, tag: 'span' });
};

export const main = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLElementTagNameMap['main']>({ ...props, tag: 'main' }, ...children);
};

export const header = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLElementTagNameMap['header']>({ ...props, tag: 'header' }, ...children);
};

export const form = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLFormElement>({ ...props, tag: 'form' }, ...children);
};

export const label = (props: ElementFnProps<HTMLLabelElement>, ...children: (BaseComponent | HTMLElement)[]) => {
  return new BaseComponent<HTMLLabelElement>({ ...props, tag: 'label' }, ...children);
};

export const input = (props: ElementFnProps<HTMLInputElement>) => {
  return new BaseComponent<HTMLInputElement>({ ...props, tag: 'input' });
};

export const select = (props: ElementFnProps<HTMLSelectElement>, ...children: (BaseComponent | HTMLElement)[]) => {
  return new BaseComponent<HTMLSelectElement>({ ...props, tag: 'select' }, ...children);
};

export const option = (props: ElementFnProps<HTMLOptionElement>) => {
  return new BaseComponent<HTMLOptionElement>({ ...props, tag: 'option' });
};

export const button = (props: ElementFnProps<HTMLButtonElement>, ...children: (BaseComponent | HTMLElement)[]) => {
  return new BaseComponent<HTMLButtonElement>({ ...props, tag: 'button' }, ...children);
};

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export const h = (level: HeadingLevel, props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLHeadingElement>(
    { ...props, tag: `h${level}` as keyof HTMLElementTagNameMap },
    ...children,
  );
};

export const img = (source: string, props?: ElementFnProps<HTMLImageElement>) => {
  return new BaseComponent<HTMLImageElement>({ ...props, src: source, tag: 'img' });
};

export const table = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLElementTagNameMap['table']>({ ...props, tag: 'table' }, ...children);
};

export const thead = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLElementTagNameMap['thead']>({ ...props, tag: 'thead' }, ...children);
};

export const tbody = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLElementTagNameMap['tbody']>({ ...props, tag: 'tbody' }, ...children);
};

export const tr = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLElementTagNameMap['tr']>({ ...props, tag: 'tr' }, ...children);
};

export const td = (props: ElementFnProps, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLElementTagNameMap['td']>({ ...props, tag: 'td' }, ...children);
};
