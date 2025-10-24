import React, { useState } from "react";
import { ColorStep, copyToClipboard } from "../utils/paletteGenerator";
import { getTranslation } from "../utils/translations";
import { Tooltip } from "./Tooltip";
import "./PalettePreview.css";

interface PalettePreviewProps {
  colors: ColorStep[];
  language?: string;
  onTogglePin?: (hexColor: string, index: number) => void;
}

export const PalettePreview: React.FC<PalettePreviewProps> = ({ colors, language = "en", onTogglePin }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const t = (key: keyof import("../utils/translations").TranslationKeys) => getTranslation(language, key);

  const handleCopyHex = async (hex: string, index: number) => {
    try {
      await copyToClipboard(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
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

  const getWcagBadgeColor = (level: string) => {
    switch (level) {
      case "AAA":
        return "#428d1c";
      case "AA":
        return "#e0b700";
      case "A":
        return "#e0b700";
      case "Fail":
        return "#bf321f";
      default:
        return "#428d1c";
    }
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
      <div className="palette-colors">
        {colors.map((color, index) => {
          const textColor = getBestContrastColor(color);

          return (
            <div
              key={`color-${index}`}
              className="color-swatch"
              style={{
                backgroundColor: color.hex,
                ...(color.isPinned && { border: '2px solid white' }),
                cursor: onTogglePin ? 'pointer' : 'default'
              }}
              onClick={() => onTogglePin?.(color.hex, index)}
            >
              <div className="color-content" style={{ color: textColor === "white" ? "#ffffff" : "#000000" }}>
                <div className="color-index">
                  {index * 10}
                </div>

                <div className="contrast-scores">
                  <div className="contrast-score">
                    <span className="contrast-value contrast-value-white">{color.contrastRatioWhite.toFixed(2)}</span>
                    <Tooltip content={getWcagTooltip(color.wcagWhite)}>
                      <div className="wcag-badge" style={{ backgroundColor: getWcagBadgeColor(color.wcagWhite) }}>
                        <span>{color.wcagWhite}</span>
                      </div>
                    </Tooltip>
                  </div>

                  <div className="contrast-score">
                    <span className="contrast-value contrast-value-black">{color.contrastRatioBlack.toFixed(2)}</span>
                    <Tooltip content={getWcagTooltip(color.wcagBlack)}>
                      <div className="wcag-badge" style={{ backgroundColor: getWcagBadgeColor(color.wcagBlack) }}>
                        <span>{color.wcagBlack}</span>
                      </div>
                    </Tooltip>
                  </div>
                </div>

                <span
                  className={`color-hex ${copiedIndex === index ? "copied" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyHex(color.hex, index);
                  }}
                >
                  {color.hex.toUpperCase()}
                  {copiedIndex === index && <span className="copy-feedback show">{t("copied")}</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
