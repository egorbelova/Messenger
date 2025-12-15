function getDeviceCornerRadius(): number {
  const temp: HTMLDivElement = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.top = '0';
  temp.style.left = '0';
  temp.style.width = 'env(safe-area-inset-bottom)';
  temp.style.height = 'env(safe-area-inset-top)';
  document.body.appendChild(temp);

  const computed: CSSStyleDeclaration = getComputedStyle(temp);
  const insetTop: number = parseInt(computed.height) || 0;
  const insetBottom: number = parseInt(computed.width) || 0;

  document.body.removeChild(temp);

  const radius: number = Math.max(Math.max(insetTop, insetBottom) - 5, 0);

  return radius;
}

export default getDeviceCornerRadius;
