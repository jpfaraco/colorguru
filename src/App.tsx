import { useState, useMemo } from 'react'
import './App.css'
import { Graph } from './components/Graph'
import { PalettePreview } from './components/PalettePreview'
import { ExportModal } from './components/ExportModal'
import { generatePalette } from './utils/paletteGenerator'
import { getCurveNames } from './utils/easingCurves'

// Types
export interface ColorState {
  steps: number;
  hue: {
    start: number;
    end: number;
    curve: string;
  };
  saturation: {
    start: number;
    end: number;
    curve: string;
    rate: number;
  };
  brightness: {
    start: number;
    end: number;
    curve: string;
  };
}

function App() {
  const [colorState, setColorState] = useState<ColorState>({
    steps: 11,
    hue: {
      start: 180,
      end: 270,
      curve: 'Quad - EaseIn'
    },
    saturation: {
      start: 50,
      end: 80,
      curve: 'Quad - EaseIn',
      rate: 1
    },
    brightness: {
      start: 80,
      end: 20,
      curve: 'Quad - EaseIn'
    }
  });

  const [activeGraph, setActiveGraph] = useState<'hue' | 'saturation' | 'brightness' | 'luminance' | 'sat-bri'>('hue');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Generate palette data
  const paletteData = useMemo(() => {
    return generatePalette(colorState);
  }, [colorState]);

  // Get curve names for dropdowns
  const curveNames = getCurveNames();

  // Reset function
  const handleReset = () => {
    setColorState({
      steps: 11,
      hue: {
        start: 180,
        end: 270,
        curve: 'Quad - EaseIn'
      },
      saturation: {
        start: 50,
        end: 80,
        curve: 'Quad - EaseIn',
        rate: 1
      },
      brightness: {
        start: 80,
        end: 20,
        curve: 'Quad - EaseIn'
      }
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Color Guru</h1>
        <div className="header-actions">
          <button className="reset-btn" onClick={handleReset}>Reset</button>
          <button className="share-btn" onClick={() => setIsExportModalOpen(true)}>Export</button>
        </div>
      </header>
      
      <div className="app-content">
        {/* Left Panel - Controls */}
        <div className="left-panel">
          <div className="controls">
            <div className="control-section">
              <h3>Major Steps</h3>
              <div className="control-group">
                <label>Total</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="3" 
                    max="21" 
                    value={colorState.steps}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      steps: parseInt(e.target.value)
                    }))}
                  />
                  <span className="slider-value">{colorState.steps}</span>
                </div>
              </div>
            </div>


            <div className="control-section">
              <h3>Hue</h3>
              <div className="control-group">
                <label>Start</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    className="hue-slider"
                    min="0" 
                    max="360" 
                    value={colorState.hue.start}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      hue: { ...prev.hue, start: parseInt(e.target.value) }
                    }))}
                  />
                  <span className="slider-value">{colorState.hue.start}</span>
                </div>
              </div>
              <div className="control-group">
                <label>End</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    className="hue-slider"
                    min="0" 
                    max="360" 
                    value={colorState.hue.end}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      hue: { ...prev.hue, end: parseInt(e.target.value) }
                    }))}
                  />
                  <span className="slider-value">{colorState.hue.end}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Curve</label>
                <select 
                  value={colorState.hue.curve}
                  onChange={(e) => setColorState(prev => ({
                    ...prev, 
                    hue: { ...prev.hue, curve: e.target.value }
                  }))}
                >
                  {curveNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="control-section">
              <h3>Saturation</h3>
              <div className="control-group">
                <label>Start</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={colorState.saturation.start}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      saturation: { ...prev.saturation, start: parseInt(e.target.value) }
                    }))}
                  />
                  <span className="slider-value">{colorState.saturation.start}</span>
                </div>
              </div>
              <div className="control-group">
                <label>End</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={colorState.saturation.end}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      saturation: { ...prev.saturation, end: parseInt(e.target.value) }
                    }))}
                  />
                  <span className="slider-value">{colorState.saturation.end}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Rate</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="0.1"
                    value={colorState.saturation.rate}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      saturation: { ...prev.saturation, rate: parseFloat(e.target.value) }
                    }))}
                  />
                  <span className="slider-value">{colorState.saturation.rate.toFixed(1)}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Curve</label>
                <select 
                  value={colorState.saturation.curve}
                  onChange={(e) => setColorState(prev => ({
                    ...prev, 
                    saturation: { ...prev.saturation, curve: e.target.value }
                  }))}
                >
                  {curveNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="control-section">
              <h3>Brightness</h3>
              <div className="control-group">
                <label>Start</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={colorState.brightness.start}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      brightness: { ...prev.brightness, start: parseInt(e.target.value) }
                    }))}
                  />
                  <span className="slider-value">{colorState.brightness.start}</span>
                </div>
              </div>
              <div className="control-group">
                <label>End</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={colorState.brightness.end}
                    onChange={(e) => setColorState(prev => ({
                      ...prev, 
                      brightness: { ...prev.brightness, end: parseInt(e.target.value) }
                    }))}
                  />
                  <span className="slider-value">{colorState.brightness.end}</span>
                </div>
              </div>
              <div className="control-group">
                <label>Curve</label>
                <select 
                  value={colorState.brightness.curve}
                  onChange={(e) => setColorState(prev => ({
                    ...prev, 
                    brightness: { ...prev.brightness, curve: e.target.value }
                  }))}
                >
                  {curveNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Graph */}
        <div className="middle-panel">
          <div className="graph-controls">
            <button 
              className={activeGraph === 'hue' ? 'active' : ''}
              onClick={() => setActiveGraph('hue')}
            >
              Hue
            </button>
            <button 
              className={activeGraph === 'saturation' ? 'active' : ''}
              onClick={() => setActiveGraph('saturation')}
            >
              Saturation
            </button>
            <button 
              className={activeGraph === 'brightness' ? 'active' : ''}
              onClick={() => setActiveGraph('brightness')}
            >
              Brightness
            </button>
            <button 
              className={activeGraph === 'luminance' ? 'active' : ''}
              onClick={() => setActiveGraph('luminance')}
            >
              Luminance
            </button>
            <button 
              className={activeGraph === 'sat-bri' ? 'active' : ''}
              onClick={() => setActiveGraph('sat-bri')}
            >
              Sat × Bri
            </button>
          </div>
          <Graph paletteData={paletteData} activeGraph={activeGraph} />
        </div>

        {/* Right Panel - Palette */}
        <div className="right-panel">
          <PalettePreview colors={paletteData.colors} />
        </div>
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        paletteData={paletteData}
        colorState={colorState}
      />
    </div>
  )
}

export default App