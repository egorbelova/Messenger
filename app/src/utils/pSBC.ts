interface ColorRGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const pSBC = (
  p: number,
  c0: string,
  c1?: string,
  l?: boolean
): string | null => {
  let r: number,
    g: number,
    b: number,
    P: number,
    f: ColorRGB | null,
    t: ColorRGB | null,
    h: boolean;

  const i = parseInt;
  const m = Math.round;

  if (
    typeof p !== 'number' ||
    p < -1 ||
    p > 1 ||
    typeof c0 !== 'string' ||
    (c0[0] !== 'r' && c0[0] !== '#') ||
    (c1 && typeof c1 !== 'string')
  ) {
    return null;
  }

  const pSBCr = (d: string): ColorRGB | null => {
    const n = d.length;
    const x: Partial<ColorRGB> = {};

    if (n > 9) {
      const parts = d.split(',');
      if (parts.length < 3 || parts.length > 4) return null;

      const [rStr, gStr, bStr, aStr] = parts;
      x.r = i(rStr.includes('a') ? rStr.slice(5) : rStr.slice(4));
      x.g = i(gStr);
      x.b = i(bStr);
      x.a = aStr ? parseFloat(aStr) : -1;
    } else {
      if (n === 8 || n === 6 || n < 4) return null;

      let hex = d;
      if (n < 6) {
        hex =
          '#' +
          d[1] +
          d[1] +
          d[2] +
          d[2] +
          d[3] +
          d[3] +
          (n > 4 ? d[4] + d[4] : '');
      }

      const decimal = i(hex.slice(1), 16);
      if (n === 9 || n === 5) {
        x.r = (decimal >> 24) & 255;
        x.g = (decimal >> 16) & 255;
        x.b = (decimal >> 8) & 255;
        x.a = m((decimal & 255) / 0.255) / 1000;
      } else {
        x.r = decimal >> 16;
        x.g = (decimal >> 8) & 255;
        x.b = decimal & 255;
        x.a = -1;
      }
    }

    return x as ColorRGB;
  };

  h = c0.length > 9;
  h = c1 ? (c1.length > 9 ? true : c1 === 'c' ? !h : false) : h;

  f = pSBCr(c0);
  if (!f) return null;

  const isNegative = p < 0;

  t =
    c1 && c1 !== 'c'
      ? pSBCr(c1)
      : isNegative
      ? { r: 0, g: 0, b: 0, a: -1 }
      : { r: 255, g: 255, b: 255, a: -1 };

  if (!t) return null;

  const absP = Math.abs(p);
  P = 1 - absP;
  p = isNegative ? -p : p;

  if (l) {
    r = m(P * f.r + absP * t.r);
    g = m(P * f.g + absP * t.g);
    b = m(P * f.b + absP * t.b);
  } else {
    r = m(Math.sqrt(P * f.r ** 2 + absP * t.r ** 2));
    g = m(Math.sqrt(P * f.g ** 2 + absP * t.g ** 2));
    b = m(Math.sqrt(P * f.b ** 2 + absP * t.b ** 2));
  }

  let a = f.a;
  const tA = t.a;
  const hasAlpha = a >= 0 || tA >= 0;
  a = hasAlpha ? (a < 0 ? tA : tA < 0 ? a : a * P + tA * absP) : 0;

  if (h) {
    return `rgb${hasAlpha ? 'a(' : '('}${r},${g},${b}${
      hasAlpha ? `,${m(a * 1000) / 1000}` : ''
    })`;
  } else {
    const alphaComponent = hasAlpha ? m(a * 255) : 0;
    const colorValue =
      4294967296 + r * 16777216 + g * 65536 + b * 256 + alphaComponent;
    return '#' + colorValue.toString(16).slice(1, hasAlpha ? undefined : -2);
  }
};

export default pSBC;
