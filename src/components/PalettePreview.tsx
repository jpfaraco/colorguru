import React, { useState } from "react";
import { ColorStep, copyToClipboard } from "../utils/paletteGenerator";
import { getTranslation } from "../utils/translations";
import { Tooltip } from "./Tooltip";
import "./PalettePreview.css";

interface PalettePreviewProps {
  colors: ColorStep[];
  language?: string;
}

export const PalettePreview: React.FC<PalettePreviewProps> = ({ colors, language = "en" }) => {
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

  const getAccessibilityBadge = (color: ColorStep) => {
    const whiteLevel = color.wcagWhite;
    const blackLevel = color.wcagBlack;
    const bestLevel = color.contrastRatioWhite > color.contrastRatioBlack ? whiteLevel : blackLevel;

    return {
      level: bestLevel,
      ratio: color.contrastRatioWhite > color.contrastRatioBlack ? color.contrastRatioWhite : color.contrastRatioBlack,
      background: getBestContrastColor(color),
    };
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
          const accessibilityInfo = getAccessibilityBadge(color);
          const textColor = getBestContrastColor(color);

          return (
            <div key={`color-${index}`} className="color-swatch" style={{ backgroundColor: color.hex }}>
              <div className="color-content" style={{ color: textColor === "white" ? "#ffffff" : "#000000" }}>
                <div className="color-index">{index * 10}</div>

                <div className="color-info">
                  <div className="color-details">
                    <span className="lightness-value">{color.hsl.l.toFixed(0)}b</span>
                    <Tooltip content={`${t("contrastRatio")}: ${accessibilityInfo.ratio.toFixed(1)}:1 ${t("withBestBackground")}`}>
                      <span className="contrast-value">{accessibilityInfo.ratio.toFixed(1)}w</span>
                    </Tooltip>
                    <Tooltip content={getWcagTooltip(accessibilityInfo.level)}>
                      <span className={`wcag-rating wcag-${accessibilityInfo.level.toLowerCase()}`}>{accessibilityInfo.level}</span>
                    </Tooltip>
                    <span className={`color-hex ${copiedIndex === index ? "copied" : ""}`} onClick={() => handleCopyHex(color.hex, index)}>
                      {color.hex}
                      {copiedIndex === index && <span className="copy-feedback show">{t("copied")}</span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="palette-summary">
        <div className="summary-item">
          <span className="summary-label">{t("totalColors")}:</span>
          <span className="summary-value">{colors.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">WCAG AAA:</span>
          <span className="summary-value">{colors.filter((c) => Math.max(c.contrastRatioWhite, c.contrastRatioBlack) >= 7).length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">WCAG AA:</span>
          <span className="summary-value">{colors.filter((c) => Math.max(c.contrastRatioWhite, c.contrastRatioBlack) >= 4.5).length}</span>
        </div>
      </div>
    </div>
  );
};
