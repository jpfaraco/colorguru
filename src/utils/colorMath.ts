export interface HSL {
  h: number; // Hue: 0-360
  s: number; // Saturation: 0-100
  l: number; // Lightness: 0-100
}

export interface RGB {
  r: number; // Red: 0-255
  g: number; // Green: 0-255
  b: number; // Blue: 0-255
}

export function hslToRgb(hsl: HSL): RGB {
  const { h, s, l } = hsl;
  const hue = h / 360;
  const sat = s / 100;
  const light = l / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue * 6) % 2) - 1));
  const m = light - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= hue && hue < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= hue && hue < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= hue && hue < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= hue && hue < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= hue && hue < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= hue && hue < 1) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizeHue(hue: number): number {
  while (hue < 0) hue += 360;
  while (hue >= 360) hue -= 360;
  return hue;
}

export function interpolateHue(start: number, end: number, progress: number): number {
  start = normalizeHue(start);
  end = normalizeHue(end);
  
  // Calculate the shortest path around the color wheel
  let diff = end - start;
  if (Math.abs(diff) > 180) {
    if (diff > 0) {
      diff = diff - 360;
    } else {
      diff = diff + 360;
    }
  }
  
  const result = start + (diff * progress);
  return normalizeHue(result);
}

export function interpolateLinear(start: number, end: number, progress: number): number {
  return start + (end - start) * progress;
}

export function getLuminance(rgb: RGB): number {
  const { r, g, b } = rgb;
  
  // Convert to 0-1 range and apply gamma correction
  const rs = r / 255 <= 0.03928 ? r / 255 / 12.92 : Math.pow((r / 255 + 0.055) / 1.055, 2.4);
  const gs = g / 255 <= 0.03928 ? g / 255 / 12.92 : Math.pow((g / 255 + 0.055) / 1.055, 2.4);
  const bs = b / 255 <= 0.03928 ? b / 255 / 12.92 : Math.pow((b / 255 + 0.055) / 1.055, 2.4);
  
  // Calculate luminance using standard formula
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1: RGB, color2: RGB): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

export function getWCAGLevel(contrastRatio: number, isLargeText = false): 'AAA' | 'AA' | 'A' | 'Fail' {
  if (isLargeText) {
    if (contrastRatio >= 7) return 'AAA';
    if (contrastRatio >= 4.5) return 'AA';
    if (contrastRatio >= 3) return 'A';
  } else {
    if (contrastRatio >= 7) return 'AAA';
    if (contrastRatio >= 4.5) return 'AA';
    if (contrastRatio >= 3) return 'A';
  }
  return 'Fail';
}