import React, { useMemo } from 'react';
import { PaletteData } from '../utils/paletteGenerator';
import './Graph.css';

interface GraphProps {
  paletteData: PaletteData;
  activeGraph: 'hue' | 'saturation' | 'brightness' | 'luminance' | 'sat-bri';
  width?: number;
  height?: number;
}

export const Graph: React.FC<GraphProps> = ({
  paletteData,
  activeGraph,
  width = 600,
  height = 400
}) => {
  const { colors, hueValues, saturationValues, brightnessValues, luminanceValues } = paletteData;

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
      case 'brightness':
        return {
          values: brightnessValues,
          maxValue: 100,
          minValue: 0,
          unit: '%',
          label: 'Brightness'
        };
      case 'luminance':
        return {
          values: luminanceValues,
          maxValue: 100,
          minValue: 0,
          unit: '%',
          label: 'Luminance'
        };
      case 'sat-bri':
        return {
          values: saturationValues, // X-axis values
          yValues: brightnessValues, // Y-axis values
          maxValue: 100, // X-axis max (saturation)
          minValue: 0,   // X-axis min
          yMaxValue: 100, // Y-axis max (brightness)
          yMinValue: 0,   // Y-axis min
          unit: '%',
          yUnit: '%',
          label: 'Saturation × Brightness',
          xLabel: 'Saturation',
          yLabel: 'Brightness'
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
  }, [activeGraph, hueValues, saturationValues, brightnessValues, luminanceValues]);

  const padding = { top: 80, right: 80, bottom: 80, left: 80 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate points for the curve
  const points = useMemo(() => {
    if (!graphData.values.length) return [];
    
    // Handle XY scatter plot for sat-bri graph
    if (activeGraph === 'sat-bri' && 'yValues' in graphData) {
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
        {/* Axis lines and labels */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="graph-axes-svg"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
        >
          {/* Y-axis line */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="100"
            stroke="#9ca3af"
            strokeWidth="0.2"
          />
          
          {/* X-axis line (only for XY plot) */}
          {activeGraph === 'sat-bri' && (
            <line
              x1="0"
              y1="100"
              x2="100"
              y2="100"
              stroke="#9ca3af"
              strokeWidth="0.2"
            />
          )}
          
          {/* Grid lines and labels for XY plot */}
          {activeGraph === 'sat-bri' && (
            <>
              {[0, 20, 40, 60, 80, 100].map(value => {
                // Convert to percentage coordinates (same as dot positioning)
                const xPercent = ((value - graphData.minValue) / (graphData.maxValue - graphData.minValue)) * 100;
                const yPercent = 100 - ((value - graphData.yMinValue!) / (graphData.yMaxValue! - graphData.yMinValue!)) * 100;
                
                return (
                  <g key={`grid-${value}`}>
                    {/* Vertical grid lines (Saturation) */}
                    <line
                      x1={xPercent}
                      y1="0"
                      x2={xPercent}
                      y2="100"
                      stroke="#f3f4f6"
                      strokeWidth="0.2"
                    />
                    {/* Horizontal grid lines (Luminosity) */}
                    <line
                      x1="0"
                      y1={yPercent}
                      x2="100"
                      y2={yPercent}
                      stroke="#f3f4f6"
                      strokeWidth="0.2"
                    />
                  </g>
                );
              })}
            </>
          )}
          
          {/* Y-axis tick marks for single-value graphs */}
          {activeGraph !== 'sat-bri' && (
            <>
              {[0, 25, 50, 75, 100].map((percent, index) => {
                // Convert to percentage coordinates (inverted Y for SVG)
                const yPercent = 100 - percent;
                
                return (
                  <g key={`y-tick-${index}`}>
                    <line
                      x1="-1"
                      y1={yPercent}
                      x2="0"
                      y2={yPercent}
                      stroke="#9ca3af"
                      strokeWidth="0.2"
                    />
                  </g>
                );
              })}
            </>
          )}
          
        </svg>

        {/* Axis labels positioned outside the graph */}
        {activeGraph === 'sat-bri' && (
          <>
            {/* X-axis labels */}
            {[0, 20, 40, 60, 80, 100].map(value => {
              const leftPercent = ((value - graphData.minValue) / (graphData.maxValue - graphData.minValue)) * 100;
              return (
                <div
                  key={`x-label-${value}`}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    bottom: '-25px',
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    color: '#6b7280',
                    pointerEvents: 'none'
                  }}
                >
                  {value}
                </div>
              );
            })}
            {/* Y-axis labels */}
            {[0, 20, 40, 60, 80, 100].map(value => {
              const bottomPercent = ((value - graphData.yMinValue!) / (graphData.yMaxValue! - graphData.yMinValue!)) * 100;
              return (
                <div
                  key={`y-label-${value}`}
                  style={{
                    position: 'absolute',
                    left: '-35px',
                    bottom: `${bottomPercent}%`,
                    transform: 'translateY(50%)',
                    fontSize: '12px',
                    color: '#6b7280',
                    pointerEvents: 'none',
                    textAlign: 'right',
                    width: '30px'
                  }}
                >
                  {value}
                </div>
              );
            })}
            {/* Axis titles */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-50px',
                transform: 'translateX(-50%)',
                fontSize: '14px',
                color: '#374151',
                fontWeight: '500',
                pointerEvents: 'none'
              }}
            >
              Saturation (%)
            </div>
            <div
              style={{
                position: 'absolute',
                left: '-70px',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                fontSize: '14px',
                color: '#374151',
                fontWeight: '500',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Brightness (%)
            </div>
          </>
        )}

        {/* Y-axis labels for single-value graphs */}
        {activeGraph !== 'sat-bri' && (
          <>
            {[0, 25, 50, 75, 100].map((percent, index) => {
              const actualValue = graphData.minValue + (graphData.maxValue - graphData.minValue) * (percent / 100);
              const displayValue = Math.round(actualValue);
              const bottomPercent = percent;
              
              return (
                <div
                  key={`y-label-${index}`}
                  style={{
                    position: 'absolute',
                    left: '-45px',
                    bottom: `${bottomPercent}%`,
                    transform: 'translateY(50%)',
                    fontSize: '12px',
                    color: '#6b7280',
                    pointerEvents: 'none',
                    textAlign: 'right',
                    width: '40px'
                  }}
                >
                  {displayValue}{graphData.unit}
                </div>
              );
            })}
            {/* Y-axis title */}
            <div
              style={{
                position: 'absolute',
                left: '-80px',
                top: '50%',
                transform: 'translateY(-50%) rotate(-90deg)',
                fontSize: '14px',
                color: '#374151',
                fontWeight: '500',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {graphData.label} ({graphData.unit})
            </div>
          </>
        )}

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
                {activeGraph === 'sat-bri' ? 
                  `${Math.round(point.value)}, ${Math.round((point as any).yValue || 0)}` : 
                  Math.round(point.value)
                }
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