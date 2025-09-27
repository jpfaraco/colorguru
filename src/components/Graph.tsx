import React, { useMemo } from 'react';
import { PaletteData } from '../utils/paletteGenerator';
import './Graph.css';

interface GraphProps {
  paletteData: PaletteData;
  activeGraph: 'hue' | 'saturation' | 'luminosity' | 'luminance';
  width?: number;
  height?: number;
}

export const Graph: React.FC<GraphProps> = ({
  paletteData,
  activeGraph,
  width = 600,
  height = 400
}) => {
  const { colors, hueValues, saturationValues, luminosityValues, luminanceValues } = paletteData;

  const graphData = useMemo(() => {
    switch (activeGraph) {
      case 'hue':
        return {
          values: hueValues,
          maxValue: 360,
          minValue: 0,
          unit: '°',
          label: 'Hue'
        };
      case 'saturation':
        return {
          values: saturationValues,
          maxValue: 100,
          minValue: 0,
          unit: '%',
          label: 'Saturation'
        };
      case 'luminosity':
        return {
          values: luminosityValues,
          maxValue: 100,
          minValue: 0,
          unit: '%',
          label: 'Luminosity'
        };
      case 'luminance':
        return {
          values: luminanceValues,
          maxValue: 100,
          minValue: 0,
          unit: '%',
          label: 'Luminance'
        };
      default:
        return {
          values: hueValues,
          maxValue: 360,
          minValue: 0,
          unit: '°',
          label: 'Hue'
        };
    }
  }, [activeGraph, hueValues, saturationValues, luminosityValues, luminanceValues]);

  const padding = { top: 80, right: 80, bottom: 80, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points for the curve
  const points = useMemo(() => {
    if (!graphData.values.length) return [];
    
    return graphData.values.map((value, index) => {
      const x = padding.left + (index / (graphData.values.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((value - graphData.minValue) / (graphData.maxValue - graphData.minValue)) * chartHeight;
      return { x, y, value, index };
    });
  }, [graphData, chartWidth, chartHeight, padding]);

  // Create smooth curve path
  const curvePath = useMemo(() => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      
      if (i === 1) {
        // First curve segment
        const cp1x = prev.x + (curr.x - prev.x) * 0.3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) * 0.3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        // Subsequent curve segments
        const prevPrev = points[i - 2];
        const next = i < points.length - 1 ? points[i + 1] : curr;
        
        const cp1x = prev.x + (curr.x - prevPrev.x) * 0.15;
        const cp1y = prev.y + (curr.y - prevPrev.y) * 0.15;
        const cp2x = curr.x - (next.x - prev.x) * 0.15;
        const cp2y = curr.y - (next.y - prev.y) * 0.15;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  }, [points]);

  // Generate y-axis ticks
  const yTicks = useMemo(() => {
    const tickCount = 6;
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      const value = graphData.minValue + (graphData.maxValue - graphData.minValue) * (i / tickCount);
      const y = padding.top + chartHeight - (i / tickCount) * chartHeight;
      ticks.push({ value: Math.round(value), y });
    }
    return ticks;
  }, [graphData, chartHeight, padding]);

  // Generate x-axis ticks  
  const xTicks = useMemo(() => {
    const ticks = [];
    const tickCount = Math.min(points.length, 11); // Limit to prevent overcrowding
    const interval = Math.max(1, Math.floor(points.length / tickCount));
    
    for (let i = 0; i < points.length; i += interval) {
      const point = points[i];
      ticks.push({ value: i + 1, x: point.x });
    }
    
    // Always include the last point
    if (points.length > 1 && ticks[ticks.length - 1].value !== points.length) {
      const lastPoint = points[points.length - 1];
      ticks.push({ value: points.length, x: lastPoint.x });
    }
    
    return ticks;
  }, [points]);

  if (!colors.length) {
    return (
      <div className="graph-container">
        <div className="graph-placeholder">
          No data to display
        </div>
      </div>
    );
  }

  return (
    <div className="graph-container">
      <h3 className="graph-title">{graphData.label}</h3>
      <div className="graph-content">
        {/* Data points with values */}
        {points.map((point, i) => {
          // Convert point position to percentage for positioning
          const leftPercent = ((point.x - padding.left) / chartWidth) * 100;
          const bottomPercent = ((padding.top + chartHeight - point.y) / chartHeight) * 100;
          
          return (
            <div
              key={`point-${i}`}
              className="graph-dot"
              style={{
                left: `${leftPercent}%`,
                bottom: `${bottomPercent}%`,
                backgroundColor: colors[i]?.hex || '#8b5cf6'
              }}
            >
              <div className="dot-value">
                {Math.round(point.value)}
              </div>
              <div className="dot-step">
                {point.index}
              </div>
            </div>
          );
        })}
        
      </div>
    </div>
  );
};