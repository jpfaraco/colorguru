import React, { useState } from 'react';
import { PaletteData, exportAsCSS, exportAsJSON, exportAsPlainText, copyToClipboard } from '../utils/paletteGenerator';
import { ColorState } from '../App';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  paletteData: PaletteData;
  colorState: ColorState;
}

type ExportFormat = 'css' | 'json' | 'text';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  paletteData,
  colorState
}) => {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getExportData = () => {
    switch (activeFormat) {
      case 'css':
        return exportAsCSS(paletteData);
      case 'json':
        return exportAsJSON(paletteData, colorState);
      case 'text':
        return exportAsPlainText(paletteData);
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(getExportData());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownload = () => {
    const data = getExportData();
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
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
          <h2>Export Palette</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="export-format-tabs">
          <button
            className={`format-tab ${activeFormat === 'css' ? 'active' : ''}`}
            onClick={() => setActiveFormat('css')}
          >
            CSS Variables
          </button>
          <button
            className={`format-tab ${activeFormat === 'json' ? 'active' : ''}`}
            onClick={() => setActiveFormat('json')}
          >
            JSON
          </button>
          <button
            className={`format-tab ${activeFormat === 'text' ? 'active' : ''}`}
            onClick={() => setActiveFormat('text')}
          >
            Plain Text
          </button>
        </div>

        <div className="export-content">
          <div className="export-preview">
            <pre className="export-code">
              {getExportData()}
            </pre>
          </div>
        </div>

        <div className="export-actions">
          <button
            className="copy-button"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            className="download-button"
            onClick={handleDownload}
          >
            Download File
          </button>
        </div>

        <div className="palette-summary-export">
          <div className="summary-stats">
            <span className="stat">
              <strong>{paletteData.colors.length}</strong> colors
            </span>
            <span className="stat">
              <strong>{paletteData.colors.filter(c => Math.max(c.contrastRatioWhite, c.contrastRatioBlack) >= 4.5).length}</strong> WCAG AA compliant
            </span>
            <span className="stat">
              <strong>{paletteData.colors.filter(c => Math.max(c.contrastRatioWhite, c.contrastRatioBlack) >= 7).length}</strong> WCAG AAA compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};