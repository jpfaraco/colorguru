import React, { useState } from "react";
import { PaletteData, exportAsCSS, exportAsJSON, exportAsPlainText, exportAsSVG, copyToClipboard } from "../utils/paletteGenerator";
import { getTranslation } from "../utils/translations";
import { ColorState } from "../App";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("exportTitle")}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as ExportFormat)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="css">{t("css")}</TabsTrigger>
            <TabsTrigger value="json">{t("json")}</TabsTrigger>
            <TabsTrigger value="text">{t("plainText")}</TabsTrigger>
            <TabsTrigger value="svg">Figma</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto mt-4 bg-muted/30 rounded-lg">
            <TabsContent value="css" className="mt-0 h-full">
              <pre className="p-4 text-xs font-mono overflow-x-auto">{getExportData()}</pre>
            </TabsContent>
            <TabsContent value="json" className="mt-0 h-full">
              <pre className="p-4 text-xs font-mono overflow-x-auto">{getExportData()}</pre>
            </TabsContent>
            <TabsContent value="text" className="mt-0 h-full">
              <pre className="p-4 text-xs font-mono overflow-x-auto">{getExportData()}</pre>
            </TabsContent>
            <TabsContent value="svg" className="mt-0 h-full">
              <pre className="p-4 text-xs font-mono overflow-x-auto">{getExportData()}</pre>
            </TabsContent>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 pt-4 border-t">
            {activeFormat === "text" && (
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbered"
                    checked={plainTextNumbered}
                    onCheckedChange={(checked) => setPlainTextNumbered(checked as boolean)}
                  />
                  <Label htmlFor="numbered" className="cursor-pointer">
                    {t("numbered")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeHash"
                    checked={plainTextIncludeHash}
                    onCheckedChange={(checked) => setPlainTextIncludeHash(checked as boolean)}
                  />
                  <Label htmlFor="includeHash" className="cursor-pointer">
                    {t("includeHash")}
                  </Label>
                </div>
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleCopy} disabled={copied}>
                {copied ? `✓ ${t("copied")}` : t("copy")}
              </Button>
              <Button onClick={handleDownload}>{t("downloadFile")}</Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
