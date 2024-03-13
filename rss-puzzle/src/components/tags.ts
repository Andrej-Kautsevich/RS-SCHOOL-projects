import { BaseComponent } from './BaseComponent';

export const div = (className: string, ...children: (BaseComponent | HTMLElement)[]) => {
  return new BaseComponent<HTMLDivElement>(className, ...children);
};

export const p = (className: string, txt?: string, ...children: BaseComponent[]) => {
  return new BaseComponent<HTMLParagraphElement>({ tag: 'p', className, txt }, ...children);
};
