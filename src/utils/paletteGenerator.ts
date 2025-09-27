import { ColorState } from '../App';
import { HSL, RGB, hslToHex, hslToRgb, interpolateHue, interpolateLinear, getContrastRatio, getWCAGLevel } from './colorMath';
import { getEasingFunction } from './easingCurves';

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
  luminosityValues: number[];
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
  const { steps, hue, saturation, luminosity } = colorState;
  const colors: ColorStep[] = [];
  const hueValues: number[] = [];
  const saturationValues: number[] = [];
  const luminosityValues: number[] = [];
  const luminanceValues: number[] = [];

  // Get easing functions
  const hueEasing = getEasingFunction(hue.curve);
  const saturationEasing = getEasingFunction(saturation.curve);
  const luminosityEasing = getEasingFunction(luminosity.curve);

  for (let i = 0; i < steps; i++) {
    // Calculate progress (0 to 1)
    const progress = steps === 1 ? 0 : i / (steps - 1);
    
    // Apply easing to get curved progress values
    const hueProgress = hueEasing(progress);
    const satProgress = saturationEasing(progress);
    const lumProgress = luminosityEasing(progress);

    // Interpolate values
    const h = interpolateHue(hue.start, hue.end, hueProgress);
    const s = interpolateLinear(saturation.start, saturation.end, satProgress) * saturation.rate;
    const l = interpolateLinear(luminosity.start, luminosity.end, lumProgress);

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
    luminosityValues.push(clampedL);
    luminanceValues.push(luminance * 100); // Convert to percentage for easier display
  }

  return {
    colors,
    hueValues,
    saturationValues,
    luminosityValues,
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