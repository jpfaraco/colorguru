import React, { useMemo } from "react";
import { PaletteData } from "../utils/paletteGenerator";
import { getTranslation } from "../utils/translations";
import "./Graph.css";

interface GraphProps {
  paletteData: PaletteData;
  activeGraph: "hue" | "saturation" | "brightness" | "luminance" | "sat-bri";
  width?: number;
  height?: number;
  language?: string;
  onTogglePin?: (hexColor: string, index: number) => void;
}

export const Graph: React.FC<GraphProps> = ({ paletteData, activeGraph, width = 600, height = 400, language = "en", onTogglePin }) => {
  const { colors, hueValues, saturationValues, brightnessValues, luminanceValues } = paletteData;

  const t = (key: keyof import("../utils/translations").TranslationKeys) => getTranslation(language, key);

  const graphData = useMemo(() => {
    switch (activeGraph) {
      case "hue":
        return {
          values: hueValues,
          maxValue: 360,
          minValue: 0,
          unit: "°",
          label: t("hueLabel"),
        };
      case "saturation":
        return {
          values: saturationValues,
          maxValue: 100,
          minValue: 0,
          unit: "%",
          label: t("saturationLabel"),
        };
      case "brightness":
        return {
          values: brightnessValues,
          maxValue: 100,
          minValue: 0,
          unit: "%",
          label: t("brightnessLabel"),
        };
      case "luminance":
        return {
          values: luminanceValues,
          maxValue: 100,
          minValue: 0,
          unit: "%",
          label: t("luminanceLabel"),
        };
      case "sat-bri":
        return {
          values: saturationValues, // X-axis values
          yValues: brightnessValues, // Y-axis values
          maxValue: 100, // X-axis max (saturation)
          minValue: 0, // X-axis min
          yMaxValue: 100, // Y-axis max (brightness)
          yMinValue: 0, // Y-axis min
          unit: "%",
          yUnit: "%",
          label: t("saturationBrightnessLabel"),
          xLabel: t("saturation"),
          yLabel: t("brightness"),
        };
      default:
        return {
          values: hueValues,
          maxValue: 360,
          minValue: 0,
          unit: "°",
          label: t("hueLabel"),
        };
    }
  }, [activeGraph, hueValues, saturationValues, brightnessValues, luminanceValues]);

  const padding = { top: 80, right: 80, bottom: 80, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points for the curve
  const points = useMemo(() => {
    if (!graphData.values.length) return [];

    // Handle XY scatter plot for sat-bri graph
    if (activeGraph === "sat-bri" && "yValues" in graphData) {
      return graphData.values.map((xValue, index) => {
        const yValue = graphData.yValues![index];
        const x = padding.left + ((xValue - graphData.minValue) / (graphData.maxValue - graphData.minValue)) * chartWidth;
        const y = padding.top + chartHeight - ((yValue - graphData.yMinValue!) / (graphData.yMaxValue! - graphData.yMinValue!)) * chartHeight;
        return { x, y, value: xValue, yValue, index };
      });
    }

    // Handle regular line graphs (equal x-spacing)
    return graphData.values.map((value, index) => {
      const x = padding.left + (index / (graphData.values.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((value - graphData.minValue) / (graphData.maxValue - graphData.minValue)) * chartHeight;
      return { x, y, value, index };
    });
  }, [activeGraph, graphData, chartWidth, chartHeight, padding]);

  // (Removed unused curve path and tick builders to satisfy strict TypeScript build)

  if (!colors.length) {
    return (
      <div className="graph-container">
        <div className="graph-placeholder">{t("totalColors")}: 0</div>
      </div>
    );
  }

  return (
    <div className="graph-container">
      <h3 className="graph-title">{graphData.label}</h3>
      <div className="graph-content">
        {/* Axis lines and labels */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="graph-axes-svg" style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}>
          {/* Y-axis line */}
          <line x1="0" y1="0" x2="0" y2="100" stroke="#9ca3af" strokeWidth="0.2" />

          {/* X-axis line (only for XY plot) */}
          {activeGraph === "sat-bri" && <line x1="0" y1="100" x2="100" y2="100" stroke="#9ca3af" strokeWidth="0.2" />}

          {/* Grid lines and labels for XY plot */}
          {activeGraph === "sat-bri" && (
            <>
              {[0, 20, 40, 60, 80, 100].map((value) => {
                // Convert to percentage coordinates (same as dot positioning)
                const xPercent = ((value - graphData.minValue) / (graphData.maxValue - graphData.minValue)) * 100;
                const yPercent = 100 - ((value - graphData.yMinValue!) / (graphData.yMaxValue! - graphData.yMinValue!)) * 100;

                return (
                  <g key={`grid-${value}`}>
                    {/* Vertical grid lines (Saturation) */}
                    <line x1={xPercent} y1="0" x2={xPercent} y2="100" stroke="#f3f4f6" strokeWidth="0.2" />
                    {/* Horizontal grid lines (Luminosity) */}
                    <line x1="0" y1={yPercent} x2="100" y2={yPercent} stroke="#f3f4f6" strokeWidth="0.2" />
                  </g>
                );
              })}
            </>
          )}

          {/* Y-axis tick marks for single-value graphs */}
          {activeGraph !== "sat-bri" && (
            <>
              {[0, 25, 50, 75, 100].map((percent, index) => {
                // Convert to percentage coordinates (inverted Y for SVG)
                const yPercent = 100 - percent;

                return (
                  <g key={`y-tick-${index}`}>
                    <line x1="-1" y1={yPercent} x2="0" y2={yPercent} stroke="#9ca3af" strokeWidth="0.2" />
                  </g>
                );
              })}
            </>
          )}
        </svg>

        {/* Axis labels positioned outside the graph */}
        {activeGraph === "sat-bri" && (
          <>
            {/* X-axis labels */}
            {[0, 20, 40, 60, 80, 100].map((value) => {
              const leftPercent = ((value - graphData.minValue) / (graphData.maxValue - graphData.minValue)) * 100;
              return (
                <div
                  key={`x-label-${value}`}
                  style={{
                    position: "absolute",
                    left: `${leftPercent}%`,
                    bottom: "-25px",
                    transform: "translateX(-50%)",
                    fontSize: "12px",
                    color: "#6b7280",
                    pointerEvents: "none",
                  }}
                >
                  {value}
                </div>
              );
            })}
            {/* Y-axis labels */}
            {[0, 20, 40, 60, 80, 100].map((value) => {
              const bottomPercent = ((value - graphData.yMinValue!) / (graphData.yMaxValue! - graphData.yMinValue!)) * 100;
              return (
                <div
                  key={`y-label-${value}`}
                  style={{
                    position: "absolute",
                    left: "-35px",
                    bottom: `${bottomPercent}%`,
                    transform: "translateY(50%)",
                    fontSize: "12px",
                    color: "#6b7280",
                    pointerEvents: "none",
                    textAlign: "right",
                    width: "30px",
                  }}
                >
                  {value}
                </div>
              );
            })}
            {/* Axis titles */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "-50px",
                transform: "translateX(-50%)",
                fontSize: "14px",
                color: "#374151",
                fontWeight: "500",
                pointerEvents: "none",
              }}
            >
              {graphData.xLabel} (%)
            </div>
            <div
              style={{
                position: "absolute",
                left: "-70px",
                top: "50%",
                transform: "translateY(-50%) rotate(-90deg)",
                fontSize: "14px",
                color: "#374151",
                fontWeight: "500",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {graphData.yLabel} (%)
            </div>
          </>
        )}

        {/* Y-axis labels for single-value graphs */}
        {activeGraph !== "sat-bri" && (
          <>
            {[0, 25, 50, 75, 100].map((percent, index) => {
              const actualValue = graphData.minValue + (graphData.maxValue - graphData.minValue) * (percent / 100);
              const displayValue = Math.round(actualValue);
              const bottomPercent = percent;

              return (
                <div
                  key={`y-label-${index}`}
                  style={{
                    position: "absolute",
                    left: "-45px",
                    bottom: `${bottomPercent}%`,
                    transform: "translateY(50%)",
                    fontSize: "12px",
                    color: "#6b7280",
                    pointerEvents: "none",
                    textAlign: "right",
                    width: "40px",
                  }}
                >
                  {displayValue}
                  {graphData.unit}
                </div>
              );
            })}
          </>
        )}

        {/* Data points with values */}
        {points.map((point, i) => {
          // Convert point position to percentage for positioning
          const leftPercent = ((point.x - padding.left) / chartWidth) * 100;
          const bottomPercent = ((padding.top + chartHeight - point.y) / chartHeight) * 100;

          // Determine best contrast color for text
          const color = colors[i];
          const textColor = color && color.contrastRatioWhite > color.contrastRatioBlack ? "#ffffff" : "#000000";

          return (
            <div
              key={`point-${i}`}
              className="graph-dot"
              style={{
                left: `${leftPercent}%`,
                bottom: `${bottomPercent}%`,
                backgroundColor: colors[i]?.hex || "#8b5cf6",
                ...(colors[i]?.isPinned && { boxShadow: '0 0 0 2px #ffffff, 0 0 0 4px rgba(0, 0, 0, 0.3)' }),
                cursor: onTogglePin ? 'pointer' : 'default'
              }}
              onClick={() => onTogglePin?.(colors[i]?.hex, i)}
            >
              <div className="dot-value" style={{ color: textColor }}>
                {activeGraph === "sat-bri" ? `${Math.round(point.value)}, ${Math.round((point as any).yValue || 0)}` : Math.round(point.value)}
              </div>
              <div className="dot-step" style={{ color: textColor }}>
                {point.index}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
