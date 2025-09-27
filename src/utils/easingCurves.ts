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

export function getCurveNames(): string[] {
  return Object.keys(EASING_CURVES);
}