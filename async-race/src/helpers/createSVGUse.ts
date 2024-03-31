const createSVGUse = (id: string, classNames?: string[]): SVGSVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`);
  svg.append(use);
  if (classNames) {
    svg.classList.add(...classNames);
  }
  return svg;
};

export default createSVGUse;
