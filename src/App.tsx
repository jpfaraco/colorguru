import { useState, useMemo } from "react";
import "./App.css";
import { Graph } from "./components/Graph";
import BezierEditor from "./components/BezierEditor";
import { PalettePreview } from "./components/PalettePreview";
import { ExportModal } from "./components/ExportModal";
import { generatePalette } from "./utils/paletteGenerator";
import { getCurveNames } from "./utils/easingCurves";
import { getTranslation, languageOptions } from "./utils/translations";

// Types
export interface ColorState {
  steps: number;
  hue: {
    start: number;
    end: number;
    curve: string;
    longPath: boolean;
    custom?: { x1: number; y1: number; x2: number; y2: number };
  };
  saturation: {
    start: number;
    end: number;
    curve: string;
    rate: number;
    custom?: { x1: number; y1: number; x2: number; y2: number };
  };
  brightness: {
    start: number;
    end: number;
    curve: string;
    custom?: { x1: number; y1: number; x2: number; y2: number };
  };
}

function App() {
  const [colorState, setColorState] = useState<ColorState>({
    steps: 11,
    hue: {
      start: 180,
      end: 270,
      curve: "Quad - EaseIn",
      longPath: false,
    },
    saturation: {
      start: 50,
      end: 80,
      curve: "Quad - EaseIn",
      rate: 1,
    },
    brightness: {
      start: 80,
      end: 20,
      curve: "Quad - EaseIn",
    },
  });

  const [activeGraph, setActiveGraph] = useState<"hue" | "saturation" | "brightness" | "luminance" | "sat-bri">("hue");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState("en");

  // Generate palette data
  const paletteData = useMemo(() => {
    return generatePalette(colorState);
  }, [colorState]);

  // Get curve names for dropdowns
  const curveNames = getCurveNames();

  // Translation helper
  const t = (key: keyof import("./utils/translations").TranslationKeys) => getTranslation(language, key);

  // Toggle section collapse
  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Reset function
  const handleReset = () => {
    setColorState({
      steps: 11,
      hue: {
        start: 180,
        end: 270,
        curve: "Quad - EaseIn",
        longPath: false,
      },
      saturation: {
        start: 50,
        end: 80,
        curve: "Quad - EaseIn",
        rate: 1,
      },
      brightness: {
        start: 80,
        end: 20,
        curve: "Quad - EaseIn",
      },
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t("appName")}</h1>
        <div className="header-actions">
          <div className="language-selector">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.flag} {option.name}
                </option>
              ))}
            </select>
          </div>
          <button className="reset-btn" onClick={handleReset}>
            {t("reset")}
          </button>
          <button className="share-btn" onClick={() => setIsExportModalOpen(true)}>
            {t("export")}
          </button>
        </div>
      </header>

      <div className="app-content">
        {/* Left Panel - Controls */}
        <div className="left-panel">
          <div className="controls">
            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("steps")}>
                <h3>{t("numberOfColors")}</h3>
                <span className={`collapse-icon ${collapsedSections.has("steps") ? "collapsed" : ""}`}>▼</span>
              </div>
              <div className={`section-content ${collapsedSections.has("steps") ? "collapsed" : ""}`}>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("total")}</label>
                    <span className="slider-value">{colorState.steps}</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="3"
                      max="21"
                      value={colorState.steps}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          steps: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("hue")}>
                <h3>{t("hue")}</h3>
                <span className={`collapse-icon ${collapsedSections.has("hue") ? "collapsed" : ""}`}>▼</span>
              </div>
              <div className={`section-content ${collapsedSections.has("hue") ? "collapsed" : ""}`}>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("start")}</label>
                    <span className="slider-value">{colorState.hue.start}°</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      className="hue-slider"
                      min="0"
                      max="360"
                      value={colorState.hue.start}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          hue: { ...prev.hue, start: parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("end")}</label>
                    <span className="slider-value">{colorState.hue.end}°</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      className="hue-slider"
                      min="0"
                      max="360"
                      value={colorState.hue.end}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          hue: { ...prev.hue, end: parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="checkbox-container">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={colorState.hue.longPath}
                        onChange={(e) =>
                          setColorState((prev) => ({
                            ...prev,
                            hue: { ...prev.hue, longPath: e.target.checked },
                          }))
                        }
                      />
                      {t("longPathInterpolation")}
                    </label>
                  </div>
                </div>
                <div className="control-group">
                  <label>{t("curve")}</label>
                  <select
                    value={colorState.hue.curve}
                    onChange={(e) =>
                      setColorState((prev) => ({
                        ...prev,
                        hue: { ...prev.hue, curve: e.target.value },
                      }))
                    }
                  >
                    {curveNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {colorState.hue.curve === "Custom" && <BezierEditor value={colorState.hue.custom || { x1: 0.2, y1: 0, x2: 0.8, y2: 1 }} onChange={(custom) => setColorState((prev) => ({ ...prev, hue: { ...prev.hue, custom } }))} />}
                </div>
              </div>
            </div>

            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("saturation")}>
                <h3>{t("saturation")}</h3>
                <span className={`collapse-icon ${collapsedSections.has("saturation") ? "collapsed" : ""}`}>▼</span>
              </div>
              <div className={`section-content ${collapsedSections.has("saturation") ? "collapsed" : ""}`}>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("start")}</label>
                    <span className="slider-value">{colorState.saturation.start}%</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={colorState.saturation.start}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          saturation: { ...prev.saturation, start: parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("end")}</label>
                    <span className="slider-value">{colorState.saturation.end}%</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={colorState.saturation.end}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          saturation: { ...prev.saturation, end: parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("rate")}</label>
                    <span className="slider-value">{colorState.saturation.rate.toFixed(1)}</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={colorState.saturation.rate}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          saturation: { ...prev.saturation, rate: parseFloat(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <label>{t("curve")}</label>
                  <select
                    value={colorState.saturation.curve}
                    onChange={(e) =>
                      setColorState((prev) => ({
                        ...prev,
                        saturation: { ...prev.saturation, curve: e.target.value },
                      }))
                    }
                  >
                    {curveNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {colorState.saturation.curve === "Custom" && <BezierEditor value={colorState.saturation.custom || { x1: 0.25, y1: 0, x2: 0.75, y2: 1 }} onChange={(custom) => setColorState((prev) => ({ ...prev, saturation: { ...prev.saturation, custom } }))} />}
                </div>
              </div>
            </div>

            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("brightness")}>
                <h3>{t("brightness")}</h3>
                <span className={`collapse-icon ${collapsedSections.has("brightness") ? "collapsed" : ""}`}>▼</span>
              </div>
              <div className={`section-content ${collapsedSections.has("brightness") ? "collapsed" : ""}`}>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("start")}</label>
                    <span className="slider-value">{colorState.brightness.start}%</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={colorState.brightness.start}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          brightness: { ...prev.brightness, start: parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <div className="label-row">
                    <label>{t("end")}</label>
                    <span className="slider-value">{colorState.brightness.end}%</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={colorState.brightness.end}
                      onChange={(e) =>
                        setColorState((prev) => ({
                          ...prev,
                          brightness: { ...prev.brightness, end: parseInt(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <label>{t("curve")}</label>
                  <select
                    value={colorState.brightness.curve}
                    onChange={(e) =>
                      setColorState((prev) => ({
                        ...prev,
                        brightness: { ...prev.brightness, curve: e.target.value },
                      }))
                    }
                  >
                    {curveNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {colorState.brightness.curve === "Custom" && <BezierEditor value={colorState.brightness.custom || { x1: 0.25, y1: 0, x2: 0.75, y2: 1 }} onChange={(custom) => setColorState((prev) => ({ ...prev, brightness: { ...prev.brightness, custom } }))} />}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Graph */}
        <div className="middle-panel">
          <div className="graph-controls">
            <button className={activeGraph === "hue" ? "active" : ""} onClick={() => setActiveGraph("hue")}>
              {t("hue")}
            </button>
            <button className={activeGraph === "saturation" ? "active" : ""} onClick={() => setActiveGraph("saturation")}>
              {t("saturation")}
            </button>
            <button className={activeGraph === "brightness" ? "active" : ""} onClick={() => setActiveGraph("brightness")}>
              {t("brightness")}
            </button>
            <button className={activeGraph === "luminance" ? "active" : ""} onClick={() => setActiveGraph("luminance")}>
              {t("luminance")}
            </button>
            <button className={activeGraph === "sat-bri" ? "active" : ""} onClick={() => setActiveGraph("sat-bri")}>
              {t("satBri")}
            </button>
          </div>
          <Graph paletteData={paletteData} activeGraph={activeGraph} language={language} />
        </div>

        {/* Right Panel - Palette */}
        <div className="right-panel">
          <PalettePreview colors={paletteData.colors} language={language} />
        </div>
      </div>

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} paletteData={paletteData} colorState={colorState} language={language} />
    </div>
  );
}

export default App;
