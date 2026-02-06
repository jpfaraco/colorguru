import React, { useCallback, useMemo, useRef, useState } from "react";
import { getCubicBezier } from "../utils/easingCurves";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import "./BezierEditor.css";

export interface BezierValue {
  x1: number; // 0..1
  y1: number; // can be outside 0..1
  x2: number; // 0..1
  y2: number; // can be outside 0..1
}

interface BezierEditorProps {
  value: BezierValue;
  onChange: (next: BezierValue) => void;
  width?: number;
  height?: number;
  // Y range to allow dragging beyond [0,1]
  yMin?: number; // default -1
  yMax?: number; // default 2
}

// Utility clamp
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export const BezierEditor: React.FC<BezierEditorProps> = ({ value, onChange, width = 360, height = 360, yMin = -1, yMax = 2 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState<null | "p1" | "p2">(null);

  // Convert logical [0,1]x[yMin,yMax] to svg coords
  const viewSize = Math.min(width, height);
  const padding = 24;
  const innerW = viewSize - padding * 2;
  const innerH = viewSize - padding * 2;

  const toSvg = useCallback(
    (x: number, y: number) => {
      const sx = padding + x * innerW;
      // y: 0 at bottom, 1 at top in CSS cubic-bezier space. We map yMin..yMax -> svg
      const t = (y - yMin) / (yMax - yMin); // 0..1 bottom->top
      const sy = padding + (1 - t) * innerH;
      return { x: sx, y: sy };
    },
    [innerW, innerH, padding, yMin, yMax]
  );

  const fromSvg = useCallback(
    (sx: number, sy: number) => {
      const x = clamp((sx - padding) / innerW, 0, 1);
      const t = clamp(1 - (sy - padding) / innerH, 0, 1);
      const y = yMin + t * (yMax - yMin);
      return { x, y };
    },
    [innerW, innerH, padding, yMin, yMax]
  );

  const p0 = useMemo(() => toSvg(0, 0), [toSvg]);
  const p1 = useMemo(() => toSvg(value.x1, value.y1), [toSvg, value]);
  const p2 = useMemo(() => toSvg(value.x2, value.y2), [toSvg, value]);
  const p3 = useMemo(() => toSvg(1, 1), [toSvg]);

  const handleMouseDown = (which: "p1" | "p2") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(which);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Map client pixels to viewBox units to avoid scaling issues
    const scaleX = rect.width / viewSize;
    const scaleY = rect.height / viewSize;
    const sx = (e.clientX - rect.left) / scaleX;
    const sy = (e.clientY - rect.top) / scaleY;
    const { x, y } = fromSvg(sx, sy);
    if (dragging === "p1") {
      onChange({ ...value, x1: clamp(x, 0, 1), y1: clamp(y, yMin, yMax) });
    } else {
      onChange({ ...value, x2: clamp(x, 0, 1), y2: clamp(y, yMin, yMax) });
    }
  };

  const onMouseUp = () => setDragging(null);

  // Build a preview polyline of the easing curve
  const samplePath = useMemo(() => {
    const ease = getCubicBezier(value.x1, value.y1, value.x2, value.y2);
    const pts: string[] = [];
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const x = i / N;
      const y = ease(x);
      const s = toSvg(x, y);
      pts.push(`${s.x},${s.y}`);
    }
    return pts.join(" ");
  }, [toSvg, value]);

  // Inputs handlers (x in 0..1, y unrestricted within yMin..yMax)
  const updateField = (key: keyof BezierValue) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    const next: BezierValue = { ...value } as BezierValue;
    if (key === "x1" || key === "x2") {
      (next as any)[key] = clamp(isNaN(raw) ? 0 : raw, 0, 1);
    } else {
      (next as any)[key] = clamp(isNaN(raw) ? 0 : raw, yMin, yMax);
    }
    onChange(next);
  };

  return (
    <div className="bezier-editor">
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${viewSize} ${viewSize}`} className="bezier-svg" onMouseMove={onMouseMove} onMouseLeave={onMouseUp} onMouseUp={onMouseUp}>
        {/* Background */}
        <rect x={0} y={0} width={viewSize} height={viewSize} rx={10} ry={10} fill="#f8fafc" stroke="#e5e7eb" />
        {/* Grid vertical lines at x=0,1 */}
        <line x1={p0.x} y1={padding} x2={p0.x} y2={viewSize - padding} stroke="#e5e7eb" strokeDasharray="4 4" />
        <line x1={p3.x} y1={padding} x2={p3.x} y2={viewSize - padding} stroke="#e5e7eb" strokeDasharray="4 4" />

        {/* Base endpoints */}
        <circle cx={p0.x} cy={p0.y} r={5} fill="#2563eb" />
        <circle cx={p3.x} cy={p3.y} r={5} fill="#2563eb" />

        {/* Control handles */}
        <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#d1d5db" />
        <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} stroke="#d1d5db" />

        {/* Bezier curve */}
        <polyline points={samplePath} fill="none" stroke="#2563eb" strokeWidth={2} />

        {/* Draggable control points */}
        <g className="handle" onMouseDown={handleMouseDown("p1")}>
          <circle cx={p1.x} cy={p1.y} r={10} fill="#ffffff" stroke="#2563eb" strokeWidth={2} />
        </g>
        <g className="handle" onMouseDown={handleMouseDown("p2")}>
          <circle cx={p2.x} cy={p2.y} r={10} fill="#ffffff" stroke="#f97316" strokeWidth={2} />
        </g>
      </svg>

      <div className="bezier-inputs">
        <div className="flex flex-col gap-2">
          <Label htmlFor="bezier-x1" className="text-xs text-muted-foreground">x1</Label>
          <Input id="bezier-x1" type="number" step="0.01" min={0} max={1} value={value.x1} onChange={updateField("x1")} className="h-8 text-xs" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bezier-y1" className="text-xs text-muted-foreground">y1</Label>
          <Input id="bezier-y1" type="number" step="0.01" value={value.y1} onChange={updateField("y1")} className="h-8 text-xs" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bezier-x2" className="text-xs text-muted-foreground">x2</Label>
          <Input id="bezier-x2" type="number" step="0.01" min={0} max={1} value={value.x2} onChange={updateField("x2")} className="h-8 text-xs" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="bezier-y2" className="text-xs text-muted-foreground">y2</Label>
          <Input id="bezier-y2" type="number" step="0.01" value={value.y2} onChange={updateField("y2")} className="h-8 text-xs" />
        </div>
      </div>
    </div>
  );
};

export default BezierEditor;
