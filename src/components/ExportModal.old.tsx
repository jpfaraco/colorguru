import React, { useState } from "react";
import { PaletteData, exportAsCSS, exportAsJSON, exportAsPlainText, exportAsSVG, copyToClipboard } from "../utils/paletteGenerator";
import { getTranslation } from "../utils/translations";
import { ColorState } from "../App";
import "./ExportModal.css";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  paletteData: PaletteData;
  colorState: ColorState;
  language?: string;
}

type ExportFormat = "css" | "json" | "text" | "svg";

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, paletteData, colorState, language = "en" }) => {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);
  const [plainTextNumbered, setPlainTextNumbered] = useState(true);
  const [plainTextIncludeHash, setPlainTextIncludeHash] = useState(true);

  const t = (key: keyof import("../utils/translations").TranslationKeys) => getTranslation(language, key);

  if (!isOpen) return null;

  const getExportData = () => {
    switch (activeFormat) {
      case "css":
        return exportAsCSS(paletteData);
      case "json":
        return exportAsJSON(paletteData, colorState);
      case "text":
        return exportAsPlainText(paletteData, {
          numbered: plainTextNumbered,
          includeHash: plainTextIncludeHash,
        });
      case "svg":
        return exportAsSVG(paletteData);
      default:
        return "";
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(getExportData());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleDownload = () => {
    const data = getExportData();
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `color-palette.${activeFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="export-modal-backdrop" onClick={handleBackdropClick}>
      <div className="export-modal">
        <div className="export-modal-header">
          <h2>{t("exportTitle")}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="export-format-tabs">
          <button className={`format-tab ${activeFormat === "css" ? "active" : ""}`} onClick={() => setActiveFormat("css")}>
            {t("css")}
          </button>
          <button className={`format-tab ${activeFormat === "json" ? "active" : ""}`} onClick={() => setActiveFormat("json")}>
            {t("json")}
          </button>
          <button className={`format-tab ${activeFormat === "text" ? "active" : ""}`} onClick={() => setActiveFormat("text")}>
            {t("plainText")}
          </button>
          <button className={`format-tab ${activeFormat === "svg" ? "active" : ""}`} onClick={() => setActiveFormat("svg")}>
            Figma
          </button>
        </div>

        <div className="export-content">
          <div className="export-preview">
            <pre className="export-code">{getExportData()}</pre>
          </div>
        </div>

        <div className="export-actions">
          {activeFormat === "text" && (
            <div className="export-options">
              <label className="export-option">
                <input
                  type="checkbox"
                  checked={plainTextNumbered}
                  onChange={(event) => setPlainTextNumbered(event.target.checked)}
                />
                {t("numbered")}
              </label>
              <label className="export-option">
                <input
                  type="checkbox"
                  checked={plainTextIncludeHash}
                  onChange={(event) => setPlainTextIncludeHash(event.target.checked)}
                />
                {t("includeHash")}
              </label>
            </div>
          )}
          <div className="export-buttons">
            <button className="copy-button" onClick={handleCopy} disabled={copied}>
              {copied ? `✓ ${t("copied")}` : t("copy")}
            </button>
            <button className="download-button" onClick={handleDownload}>
              {t("downloadFile")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
