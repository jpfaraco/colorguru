export type EasingFunction = (t: number) => number;

export interface EasingCurve {
  name: string;
  func: EasingFunction;
}

// Linear easing function
export const linear: EasingFunction = (t: number) => t;

// Quadratic easing functions
export const quadEaseIn: EasingFunction = (t: number) => t * t;
export const quadEaseOut: EasingFunction = (t: number) => 1 - (1 - t) * (1 - t);
export const quadEaseInOut: EasingFunction = (t: number) => 
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Quartic easing functions  
export const quartEaseIn: EasingFunction = (t: number) => t * t * t * t;
export const quartEaseOut: EasingFunction = (t: number) => 1 - Math.pow(1 - t, 4);
export const quartEaseInOut: EasingFunction = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

// Sine easing functions
export const sineEaseIn: EasingFunction = (t: number) => 1 - Math.cos((t * Math.PI) / 2);
export const sineEaseOut: EasingFunction = (t: number) => Math.sin((t * Math.PI) / 2);
export const sineEaseInOut: EasingFunction = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

// Cubic easing functions
export const cubicEaseIn: EasingFunction = (t: number) => t * t * t;
export const cubicEaseOut: EasingFunction = (t: number) => 1 - Math.pow(1 - t, 3);
export const cubicEaseInOut: EasingFunction = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Exponential easing functions
export const expoEaseIn: EasingFunction = (t: number) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
export const expoEaseOut: EasingFunction = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
export const expoEaseInOut: EasingFunction = (t: number) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
  return (2 - Math.pow(2, -20 * t + 10)) / 2;
};

// Quintic easing functions
export const quintEaseIn: EasingFunction = (t: number) => t * t * t * t * t;
export const quintEaseOut: EasingFunction = (t: number) => 1 - Math.pow(1 - t, 5);
export const quintEaseInOut: EasingFunction = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

// Circular easing functions
export const circEaseIn: EasingFunction = (t: number) => 1 - Math.sqrt(1 - Math.pow(t, 2));
export const circEaseOut: EasingFunction = (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2));
export const circEaseInOut: EasingFunction = (t: number) =>
  t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

// Back easing functions
export const backEaseIn: EasingFunction = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

export const backEaseOut: EasingFunction = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const backEaseInOut: EasingFunction = (t: number) => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

// Easing curves mapping
export const EASING_CURVES: Record<string, EasingCurve> = {
  'Linear': { name: 'Linear', func: linear },
  'Quad - EaseIn': { name: 'Quad - EaseIn', func: quadEaseIn },
  'Quad - EaseOut': { name: 'Quad - EaseOut', func: quadEaseOut },
  'Quad - EaseInOut': { name: 'Quad - EaseInOut', func: quadEaseInOut },
  'Quart - EaseIn': { name: 'Quart - EaseIn', func: quartEaseIn },
  'Quart - EaseOut': { name: 'Quart - EaseOut', func: quartEaseOut },
  'Quart - EaseInOut': { name: 'Quart - EaseInOut', func: quartEaseInOut },
  'Sine - EaseIn': { name: 'Sine - EaseIn', func: sineEaseIn },
  'Sine - EaseOut': { name: 'Sine - EaseOut', func: sineEaseOut },
  'Sine - EaseInOut': { name: 'Sine - EaseInOut', func: sineEaseInOut },
  'Cubic - EaseIn': { name: 'Cubic - EaseIn', func: cubicEaseIn },
  'Cubic - EaseOut': { name: 'Cubic - EaseOut', func: cubicEaseOut },
  'Cubic - EaseInOut': { name: 'Cubic - EaseInOut', func: cubicEaseInOut },
  'Expo - EaseIn': { name: 'Expo - EaseIn', func: expoEaseIn },
  'Expo - EaseOut': { name: 'Expo - EaseOut', func: expoEaseOut },
  'Expo - EaseInOut': { name: 'Expo - EaseInOut', func: expoEaseInOut },
  'Quint - EaseIn': { name: 'Quint - EaseIn', func: quintEaseIn },
  'Quint - EaseOut': { name: 'Quint - EaseOut', func: quintEaseOut },
  'Quint - EaseInOut': { name: 'Quint - EaseInOut', func: quintEaseInOut },
  'Circ - EaseIn': { name: 'Circ - EaseIn', func: circEaseIn },
  'Circ - EaseOut': { name: 'Circ - EaseOut', func: circEaseOut },
  'Circ - EaseInOut': { name: 'Circ - EaseInOut', func: circEaseInOut },
  'Back - EaseIn': { name: 'Back - EaseIn', func: backEaseIn },
  'Back - EaseOut': { name: 'Back - EaseOut', func: backEaseOut },
  'Back - EaseInOut': { name: 'Back - EaseInOut', func: backEaseInOut },
};

export function getEasingFunction(curveName: string): EasingFunction {
  const curve = EASING_CURVES[curveName];
  return curve ? curve.func : quadEaseIn; // Default fallback
}

// Cubic-bezier implementation based on WebKit implementation
// Returns an easing function for given control points.
export function getCubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction {
  // Clamp Xs to [0,1] as per CSS specification.
  const cx = 3.0 * x1;
  const bx = 3.0 * (x2 - x1) - cx;
  const ax = 1.0 - cx - bx;

  const cy = 3.0 * y1;
  const by = 3.0 * (y2 - y1) - cy;
  const ay = 1.0 - cy - by;

  function sampleCurveX(t: number): number {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t: number): number {
    return ((ay * t + by) * t + cy) * t;
  }
  function sampleCurveDerivativeX(t: number): number {
    return (3.0 * ax * t + 2.0 * bx) * t + cx;
  }

  function solveCurveX(x: number): number {
    // Use Newton-Raphson iteration first
    let t2 = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x;
      const d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(x2) < 1e-6) return t2;
      if (Math.abs(d2) < 1e-6) break;
      t2 = t2 - x2 / d2;
    }
    // Fall back to bisection method
    let t0 = 0.0;
    let t1 = 1.0;
    t2 = x;
    while (t0 < t1) {
      const x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < 1e-6) return t2;
      if (x > x2) t0 = t2; else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2;
  }

  return function cubicBezierAt(x: number): number {
    if (x <= 0) return sampleCurveY(0);
    if (x >= 1) return sampleCurveY(1);
    const t = solveCurveX(x);
    return sampleCurveY(t);
  };
}

export function getCurveNames(): string[] {
  return Object.keys(EASING_CURVES);
}

// Preset control points for CSS cubic-bezier equivalent curves
// Reference: easings.net data
export interface BezierPreset { x1: number; y1: number; x2: number; y2: number }

export const CURVE_PRESETS: Record<string, BezierPreset> = {
  // Linear (approximation with symmetric points)
  'Linear': { x1: 0.25, y1: 0.25, x2: 0.75, y2: 0.75 },
  // Sine
  'Sine - EaseIn': { x1: 0.12, y1: 0, x2: 0.39, y2: 0 },
  'Sine - EaseOut': { x1: 0.61, y1: 1, x2: 0.88, y2: 1 },
  'Sine - EaseInOut': { x1: 0.37, y1: 0, x2: 0.63, y2: 1 },
  // Quad
  'Quad - EaseIn': { x1: 0.11, y1: 0, x2: 0.5, y2: 0 },
  'Quad - EaseOut': { x1: 0.5, y1: 1, x2: 0.89, y2: 1 },
  'Quad - EaseInOut': { x1: 0.45, y1: 0, x2: 0.55, y2: 1 },
  // Cubic
  'Cubic - EaseIn': { x1: 0.32, y1: 0, x2: 0.67, y2: 0 },
  'Cubic - EaseOut': { x1: 0.33, y1: 1, x2: 0.68, y2: 1 },
  'Cubic - EaseInOut': { x1: 0.65, y1: 0, x2: 0.35, y2: 1 },
  // Quart
  'Quart - EaseIn': { x1: 0.5, y1: 0, x2: 0.75, y2: 0 },
  'Quart - EaseOut': { x1: 0.25, y1: 1, x2: 0.5, y2: 1 },
  'Quart - EaseInOut': { x1: 0.76, y1: 0, x2: 0.24, y2: 1 },
  // Quint
  'Quint - EaseIn': { x1: 0.64, y1: 0, x2: 0.78, y2: 0 },
  'Quint - EaseOut': { x1: 0.22, y1: 1, x2: 0.36, y2: 1 },
  'Quint - EaseInOut': { x1: 0.83, y1: 0, x2: 0.17, y2: 1 },
  // Expo
  'Expo - EaseIn': { x1: 0.7, y1: 0, x2: 0.84, y2: 0 },
  'Expo - EaseOut': { x1: 0.16, y1: 1, x2: 0.3, y2: 1 },
  'Expo - EaseInOut': { x1: 0.87, y1: 0, x2: 0.13, y2: 1 },
  // Circ
  'Circ - EaseIn': { x1: 0.55, y1: 0, x2: 1, y2: 0.45 },
  'Circ - EaseOut': { x1: 0, y1: 0.55, x2: 0.45, y2: 1 },
  'Circ - EaseInOut': { x1: 0.85, y1: 0, x2: 0.15, y2: 1 },
  // Back (allows y outside [0,1])
  'Back - EaseIn': { x1: 0.36, y1: 0, x2: 0.66, y2: -0.56 },
  'Back - EaseOut': { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },
  'Back - EaseInOut': { x1: 0.68, y1: -0.6, x2: 0.32, y2: 1.6 },
};