import React from "react";
import { ColorStep, copyToClipboard } from "../utils/paletteGenerator";
import { getTranslation } from "../utils/translations";
import { Tooltip } from "./Tooltip";
import { Pin } from "lucide-react";
import { HSL } from "../utils/colorMath";
import { toast } from "sonner";
import "./PalettePreview.css";

interface PalettePreviewProps {
  colors: ColorStep[];
  language?: string;
  onTogglePin?: (hexColor: string, hsl?: HSL) => void;
}

export const PalettePreview: React.FC<PalettePreviewProps> = ({ colors, language = "en", onTogglePin }) => {
  const t = (key: keyof import("../utils/translations").TranslationKeys) => getTranslation(language, key);

  const handleCopyHex = async (hex: string) => {
    try {
      await copyToClipboard(hex);
      toast.success(t("copied"));
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy");
    }
  };

  const getBestContrastColor = (color: ColorStep): "white" | "black" => {
    return color.contrastRatioWhite > color.contrastRatioBlack ? "white" : "black";
  };

  const getWcagTooltip = (level: string) => {
    switch (level) {
      case "AAA":
        return t("wcagAAA");
      case "AA":
        return t("wcagAA");
      case "A":
        return t("wcagA");
      case "Fail":
        return t("wcagFail");
      default:
        return `WCAG ${level} compliance level`;
    }
  };

  const getWcagBadgeClass = (level: string, isLightBackground: boolean) => {
    const base = (() => {
      switch (level) {
        case "AAA":
          return "wcag-aaa";
        case "AA":
          return "wcag-aa";
        case "A":
          return "wcag-a";
        case "Fail":
          return "wcag-fail";
        default:
          return "wcag-aaa";
      }
    })();
    return isLightBackground ? `${base}-light` : base;
  };

  if (!colors.length) {
    return (
      <div className="palette-preview">
        <div className="palette-placeholder">{t("totalColors")}: 0</div>
      </div>
    );
  }

  return (
    <div className="palette-preview">
      <div className="palette-colors p-4">
        {colors.map((color, index) => {
          const textColor = getBestContrastColor(color);
          const isLightBackground = textColor === "black";

          return (
            <div
              key={`color-${index}`}
              className="color-swatch"
              style={{
                backgroundColor: color.hex,
                ...(color.isPinned && { border: "2px solid white" }),
                cursor: onTogglePin ? "pointer" : "default",
              }}
              onClick={() => onTogglePin?.(color.hex, color.hsl)}
            >
              <div className="color-content" style={{ color: textColor === "white" ? "#ffffff" : "#000000" }}>
                <div className="color-index" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {index * 10}
                  {color.isPinned && (
                    <Pin
                      size={12}
                      style={{
                        opacity: 0.9,
                      }}
                    />
                  )}
                </div>

                <div className="contrast-scores">
                  <div className="contrast-score">
                    <span className="contrast-value contrast-value-white">{color.contrastRatioWhite.toFixed(2)}</span>
                    <Tooltip content={getWcagTooltip(color.wcagWhite)}>
                      <div className={`wcag-badge ${getWcagBadgeClass(color.wcagWhite, isLightBackground)}`}>
                        <span>{color.wcagWhite}</span>
                      </div>
                    </Tooltip>
                  </div>

                  <div className="contrast-score">
                    <span className="contrast-value contrast-value-black">{color.contrastRatioBlack.toFixed(2)}</span>
                    <Tooltip content={getWcagTooltip(color.wcagBlack)}>
                      <div className={`wcag-badge ${getWcagBadgeClass(color.wcagBlack, isLightBackground)}`}>
                        <span>{color.wcagBlack}</span>
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <span
                  className="color-hex"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyHex(color.hex);
                  }}
                >
                  {color.hex.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
