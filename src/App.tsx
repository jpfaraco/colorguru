import { useState, useMemo, useEffect } from "react";
import "./App.css";
import { Graph } from "./components/Graph";
import BezierEditor from "./components/BezierEditor";
import { CURVE_PRESETS, getCurveNames } from "./utils/easingCurves";
import { PalettePreview } from "./components/PalettePreview";
import { ExportModal } from "./components/ExportModal";
import { generatePalette } from "./utils/paletteGenerator";
import { getTranslation, languageOptions } from "./utils/translations";
import { ChevronDown } from "lucide-react";
import { HSL } from "./utils/colorMath";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Toaster } from "./components/ui/sonner";

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
  pinnedColor?: string;
  pinnedHSL?: HSL;
  pinnedIndex?: number;
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
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(["steps", "pinned", "saturation", "brightness"]));
  const [language, setLanguage] = useState("en");

  // Auto-expand corresponding sidebar section when graph tab changes
  useEffect(() => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);

      if (activeGraph === "sat-bri") {
        // Expand both saturation and brightness
        newSet.add("hue");
        newSet.delete("saturation");
        newSet.delete("brightness");
      } else if (activeGraph === "hue" || activeGraph === "saturation" || activeGraph === "brightness") {
        // Collapse all parameter sections
        newSet.add("hue");
        newSet.add("saturation");
        newSet.add("brightness");
        // Expand the selected one
        newSet.delete(activeGraph);
      }

      return newSet;
    });
  }, [activeGraph]);

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

  // Toggle pin/unpin for a color
  const handleTogglePin = (hexColor: string, hsl?: HSL) => {
    setColorState((prev) => {
      // Normalize hex colors for comparison (case-insensitive)
      const normalizedHex = hexColor.toLowerCase();
      const normalizedPinnedColor = prev.pinnedColor?.toLowerCase();

      // If clicking the already pinned color, unpin it
      if (normalizedPinnedColor === normalizedHex) {
        return { ...prev, pinnedColor: undefined, pinnedHSL: undefined, pinnedIndex: undefined };
      }
      // Otherwise, pin this color (store original HSL if provided to avoid conversion precision loss)
      return { ...prev, pinnedColor: normalizedHex, pinnedHSL: hsl, pinnedIndex: undefined };
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t("appName")}</h1>
        <div className="header-actions">
          <div className="language-selector">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    {option.flag} {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleReset}>
            {t("reset")}
          </Button>
          <Button onClick={() => setIsExportModalOpen(true)}>{t("export")}</Button>
        </div>
      </header>

      <div className="app-content">
        {/* Left Panel - Controls */}
        <div className="left-panel">
          <div className="controls">
            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("steps")}>
                <h3>{t("numberOfColors")}</h3>
                <ChevronDown className={`collapse-icon ${collapsedSections.has("steps") ? "collapsed" : ""}`} />
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
              <div className="section-header-collapsible" onClick={() => toggleSection("pinned")}>
                <h3>{t("pinnedColor")}</h3>
                <ChevronDown className={`collapse-icon ${collapsedSections.has("pinned") ? "collapsed" : ""}`} />
              </div>
              <div className={`section-content ${collapsedSections.has("pinned") ? "collapsed" : ""}`}>
                <div className="control-group">
                  <Label htmlFor="pinned-color">{t("hexValue")}</Label>
                  <Input
                    id="pinned-color"
                    type="text"
                    className="font-mono"
                    value={colorState.pinnedColor || ""}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      setColorState((prev) => ({
                        ...prev,
                        pinnedColor: value || undefined,
                        pinnedHSL: undefined, // Clear HSL when manually typing (will be converted from hex)
                        pinnedIndex: undefined, // Clear index when manually typing
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("hue")}>
                <h3>{t("hue")}</h3>
                <ChevronDown className={`collapse-icon ${collapsedSections.has("hue") ? "collapsed" : ""}`} />
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
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="longPath"
                      checked={colorState.hue.longPath}
                      onCheckedChange={(checked) =>
                        setColorState((prev) => ({
                          ...prev,
                          hue: { ...prev.hue, longPath: checked as boolean },
                        }))
                      }
                    />
                    <Label htmlFor="longPath" className="cursor-pointer">
                      {t("longPathInterpolation")}
                    </Label>
                  </div>
                </div>
                <div className="control-group">
                  <label>{t("curve")}</label>
                  <Select
                    value={colorState.hue.curve}
                    onValueChange={(curve) =>
                      setColorState((prev) => {
                        const preset = CURVE_PRESETS[curve];
                        return {
                          ...prev,
                          hue: preset ? { ...prev.hue, curve, custom: preset } : { ...prev.hue, curve },
                        };
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {curveNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <BezierEditor value={colorState.hue.custom || CURVE_PRESETS[colorState.hue.curve] || { x1: 0.25, y1: 0, x2: 0.75, y2: 1 }} onChange={(custom) => setColorState((prev) => ({ ...prev, hue: { ...prev.hue, custom } }))} />
                </div>
              </div>
            </div>

            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("saturation")}>
                <h3>{t("saturation")}</h3>
                <ChevronDown className={`collapse-icon ${collapsedSections.has("saturation") ? "collapsed" : ""}`} />
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
                  <Select
                    value={colorState.saturation.curve}
                    onValueChange={(curve) =>
                      setColorState((prev) => {
                        const preset = CURVE_PRESETS[curve];
                        return {
                          ...prev,
                          saturation: preset ? { ...prev.saturation, curve, custom: preset } : { ...prev.saturation, curve },
                        };
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {curveNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <BezierEditor value={colorState.saturation.custom || CURVE_PRESETS[colorState.saturation.curve] || { x1: 0.25, y1: 0, x2: 0.75, y2: 1 }} onChange={(custom) => setColorState((prev) => ({ ...prev, saturation: { ...prev.saturation, custom } }))} />
                </div>
              </div>
            </div>

            <div className="control-section">
              <div className="section-header-collapsible" onClick={() => toggleSection("brightness")}>
                <h3>{t("brightness")}</h3>
                <ChevronDown className={`collapse-icon ${collapsedSections.has("brightness") ? "collapsed" : ""}`} />
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
                  <Select
                    value={colorState.brightness.curve}
                    onValueChange={(curve) =>
                      setColorState((prev) => {
                        const preset = CURVE_PRESETS[curve];
                        return {
                          ...prev,
                          brightness: preset ? { ...prev.brightness, curve, custom: preset } : { ...prev.brightness, curve },
                        };
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {curveNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <BezierEditor value={colorState.brightness.custom || CURVE_PRESETS[colorState.brightness.curve] || { x1: 0.25, y1: 0, x2: 0.75, y2: 1 }} onChange={(custom) => setColorState((prev) => ({ ...prev, brightness: { ...prev.brightness, custom } }))} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Graph */}
        <div className="middle-panel">
          <Tabs value={activeGraph} onValueChange={(value) => setActiveGraph(value as typeof activeGraph)} className="flex flex-col h-full w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="hue" className="">
                  {t("hue")}
                </TabsTrigger>
                <TabsTrigger value="saturation" className="">
                  {t("saturation")}
                </TabsTrigger>
                <TabsTrigger value="brightness" className="">
                  {t("brightness")}
                </TabsTrigger>
                <TabsTrigger value="luminance" className="">
                  {t("luminance")}
                </TabsTrigger>
                <TabsTrigger value="sat-bri" className="">
                  {t("satBri")}
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1">
              <Graph paletteData={paletteData} activeGraph={activeGraph} language={language} onTogglePin={handleTogglePin} />
            </div>
          </Tabs>
        </div>

        {/* Right Panel - Palette */}
        <div className="right-panel">
          <PalettePreview colors={paletteData.colors} language={language} onTogglePin={handleTogglePin} />
        </div>
      </div>

      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} paletteData={paletteData} colorState={colorState} language={language} />
      <Toaster />
    </div>
  );
}

export default App;
