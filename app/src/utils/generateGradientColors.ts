type RGB = { r: number; g: number; b: number };

function generateGradientColors(hexColor: string): string[] {
  function hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function adjustColor(rgb: RGB, factor: number): RGB {
    return {
      r: Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
      g: Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
      b: Math.min(255, Math.max(0, Math.round(rgb.b * factor))),
    };
  }

  function createAnalogous(rgb: RGB, hueShift: number): RGB {
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number,
      s: number,
      l: number = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }

    h = (h + hueShift / 360) % 1;
    if (h < 0) h += 1;

    function hueToRgb(p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  const baseRgb = hexToRgb(hexColor);
  if (!baseRgb) {
    throw new Error('Invalid hex color');
  }

  const gradientColors: string[] = [];

  const color1 = adjustColor(baseRgb, 1.1);
  gradientColors.push(rgbToHex(color1.r, color1.g, color1.b));

  gradientColors.push(hexColor);

  const analogous1 = createAnalogous(baseRgb, 30);
  gradientColors.push(rgbToHex(analogous1.r, analogous1.g, analogous1.b));

  const analogous2 = createAnalogous(baseRgb, 150);
  gradientColors.push(rgbToHex(analogous2.r, analogous2.g, analogous2.b));

  return gradientColors;
}

export default generateGradientColors;
