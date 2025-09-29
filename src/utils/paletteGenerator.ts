import { ColorState } from '../App';
import { HSL, RGB, hslToHex, hslToRgb, interpolateHue, interpolateLinear, getContrastRatio, getWCAGLevel } from './colorMath';
import { getCubicBezier, getEasingFunction } from './easingCurves';

export interface ColorStep {
  index: number;
  hsl: HSL;
  rgb: RGB;
  hex: string;
  contrastRatioWhite: number;
  contrastRatioBlack: number;
  wcagWhite: 'AAA' | 'AA' | 'A' | 'Fail';
  wcagBlack: 'AAA' | 'AA' | 'A' | 'Fail';
}

export interface PaletteData {
  colors: ColorStep[];
  hueValues: number[];
  saturationValues: number[];
  brightnessValues: number[];
  luminanceValues: number[];
}

const WHITE_RGB: RGB = { r: 255, g: 255, b: 255 };
const BLACK_RGB: RGB = { r: 0, g: 0, b: 0 };

// RGB to Luminance function using WCAG formula
function rgbToLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
}

export function generatePalette(colorState: ColorState): PaletteData {
  const { steps, hue, saturation, brightness } = colorState;
  const colors: ColorStep[] = [];
  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const brightnessValues: number[] = [];
  const luminanceValues: number[] = [];

  // Get easing functions - prefer custom cubic-bezier when provided
  const hueEasing = (hue as any).custom
    ? getCubicBezier((hue as any).custom.x1, (hue as any).custom.y1, (hue as any).custom.x2, (hue as any).custom.y2)
    : getEasingFunction(hue.curve);

  const saturationEasing = (saturation as any).custom
    ? getCubicBezier((saturation as any).custom.x1, (saturation as any).custom.y1, (saturation as any).custom.x2, (saturation as any).custom.y2)
    : getEasingFunction(saturation.curve);

  const brightnessEasing = (brightness as any).custom
    ? getCubicBezier((brightness as any).custom.x1, (brightness as any).custom.y1, (brightness as any).custom.x2, (brightness as any).custom.y2)
    : getEasingFunction(brightness.curve);

  for (let i = 0; i < steps; i++) {
    // Calculate progress (0 to 1)
    const progress = steps === 1 ? 0 : i / (steps - 1);
    
    // Apply easing to get curved progress values
    const hueProgress = hueEasing(progress);
    const satProgress = saturationEasing(progress);
    const briProgress = brightnessEasing(progress);

    // Interpolate values
    const h = interpolateHue(hue.start, hue.end, hueProgress, hue.longPath);
    const s = interpolateLinear(saturation.start, saturation.end, satProgress) * saturation.rate;
    const l = interpolateLinear(brightness.start, brightness.end, briProgress);

    // Clamp values to valid ranges
    const clampedS = Math.max(0, Math.min(100, s));
    const clampedL = Math.max(0, Math.min(100, l));

    const hslColor: HSL = { h, s: clampedS, l: clampedL };
    const rgbColor = hslToRgb(hslColor);
    const hexColor = hslToHex(hslColor);

    // Calculate luminance using WCAG formula
    const luminance = rgbToLuminance(rgbColor.r, rgbColor.g, rgbColor.b);

    // Calculate contrast ratios and WCAG compliance
    const contrastRatioWhite = getContrastRatio(rgbColor, WHITE_RGB);
    const contrastRatioBlack = getContrastRatio(rgbColor, BLACK_RGB);
    const wcagWhite = getWCAGLevel(contrastRatioWhite);
    const wcagBlack = getWCAGLevel(contrastRatioBlack);

    const colorStep: ColorStep = {
      index: i,
      hsl: hslColor,
      rgb: rgbColor,
      hex: hexColor,
      contrastRatioWhite,
      contrastRatioBlack,
      wcagWhite,
      wcagBlack,
    };

    colors.push(colorStep);
    hueValues.push(h);
    saturationValues.push(clampedS);
    brightnessValues.push(clampedL);
    luminanceValues.push(luminance * 100); // Convert to percentage for easier display
  }

  return {
    colors,
    hueValues,
    saturationValues,
    brightnessValues,
    luminanceValues,
  };
}

export function exportAsCSS(palette: PaletteData): string {
  const cssVars = palette.colors.map((color, index) => 
    `  --color-${index}: ${color.hex};`
  ).join('\n');
  
  return `:root {\n${cssVars}\n}`;
}

export function exportAsJSON(palette: PaletteData, colorState: ColorState): string {
  return JSON.stringify({
    settings: colorState,
    colors: palette.colors.map(color => ({
      index: color.index,
      hex: color.hex,
      hsl: color.hsl,
      rgb: color.rgb,
      accessibility: {
        contrastRatioWhite: color.contrastRatioWhite,
        contrastRatioBlack: color.contrastRatioBlack,
        wcagWhite: color.wcagWhite,
        wcagBlack: color.wcagBlack,
      }
    }))
  }, null, 2);
}

export function exportAsPlainText(palette: PaletteData): string {
  return palette.colors.map((color, index) => 
    `${index + 1}. ${color.hex}`
  ).join('\n');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}