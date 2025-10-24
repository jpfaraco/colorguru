export interface TranslationKeys {
  // Header
  appName: string;
  reset: string;
  export: string;
  
  // Control Sections
  numberOfColors: string;
  hue: string;
  saturation: string;
  brightness: string;
  pinnedColor: string;

  // Control Labels
  total: string;
  start: string;
  end: string;
  rate: string;
  curve: string;
  longPathInterpolation: string;
  enablePinnedColor: string;
  hexValue: string;
  
  // Graph Tabs
  luminance: string;
  satBri: string;
  
  // Graph Labels
  hueLabel: string;
  saturationLabel: string;
  brightnessLabel: string;
  luminanceLabel: string;
  saturationBrightnessLabel: string;
  
  // Palette
  totalColors: string;
  
  // Tooltips
  contrastRatio: string;
  wcagAAA: string;
  wcagAA: string;
  wcagA: string;
  wcagFail: string;
  withBestBackground: string;
  
  // Export Modal
  exportTitle: string;
  css: string;
  json: string;
  plainText: string;
  close: string;
  copy: string;
  copied: string;
  downloadFile: string;
  numbered: string;
  includeHash: string;
  
  // Language
  language: string;
}

export const translations: Record<string, TranslationKeys> = {
  en: {
    appName: "🌈️ Color Guru",
    reset: "Reset",
    export: "Export",

    numberOfColors: "Number of colors",
    hue: "Hue",
    saturation: "Saturation",
    brightness: "Brightness",
    pinnedColor: "Pinned color",

    total: "Total",
    start: "Start",
    end: "End",
    rate: "Rate",
    curve: "Curve",
    longPathInterpolation: "Long path interpolation",
    enablePinnedColor: "Pin a specific color",
    hexValue: "Hex value",
    
    luminance: "Luminance",
    satBri: "Sat × Bri",
    
    hueLabel: "Hue",
    saturationLabel: "Saturation",
    brightnessLabel: "Brightness",
    luminanceLabel: "Luminance",
    saturationBrightnessLabel: "Saturation × Brightness",
    
    totalColors: "Total Colors",
    
    contrastRatio: "Contrast ratio",
    wcagAAA: "AAA: Enhanced contrast (7:1+ ratio)",
    wcagAA: "AA: Standard contrast (4.5:1+ ratio)",
    wcagA: "A: Minimum contrast (3:1+ ratio)",
    wcagFail: "Fail: Below minimum contrast (<3:1)",
    withBestBackground: "with the best background",
    
    exportTitle: "Export Palette",
    css: "CSS",
    json: "JSON",
    plainText: "Plain Text",
    close: "Close",
    copy: "Copy",
    copied: "Copied!",
    downloadFile: "Download File",
    numbered: "Numbered",
    includeHash: "Include #",

    language: "Language",
  },
  es: {
    appName: "🌈️ Color Guru",
    reset: "Restablecer",
    export: "Exportar",

    numberOfColors: "Número de colores",
    hue: "Matiz",
    saturation: "Saturación",
    brightness: "Brillo",
    pinnedColor: "Color fijado",

    total: "Total",
    start: "Inicio",
    end: "Fin",
    rate: "Tasa",
    curve: "Curva",
    longPathInterpolation: "Interpolación de ruta larga",
    enablePinnedColor: "Fijar un color específico",
    hexValue: "Valor hexadecimal",
    
    luminance: "Luminancia",
    satBri: "Sat × Bri",
    
    hueLabel: "Matiz",
    saturationLabel: "Saturación",
    brightnessLabel: "Brillo",
    luminanceLabel: "Luminancia",
    saturationBrightnessLabel: "Saturación × Brillo",
    
    totalColors: "Total de Colores",
    
    contrastRatio: "Relación de contraste",
    wcagAAA: "AAA: Contraste mejorado (relación 7:1+)",
    wcagAA: "AA: Contraste estándar (relación 4.5:1+)",
    wcagA: "A: Contraste mínimo (relación 3:1+)",
    wcagFail: "Fallo: Por debajo del contraste mínimo (<3:1)",
    withBestBackground: "con el mejor fondo",
    
    exportTitle: "Exportar Paleta",
    css: "CSS",
    json: "JSON",
    plainText: "Texto Plano",
    close: "Cerrar",
    copy: "Copiar",
   copied: "¡Copiado!",
   downloadFile: "Descargar archivo",
    numbered: "Numerado",
    includeHash: "Incluir #",

    language: "Idioma",
  },
  fr: {
    appName: "🌈️ Color Guru",
    reset: "Réinitialiser",
    export: "Exporter",

    numberOfColors: "Nombre de couleurs",
    hue: "Teinte",
    saturation: "Saturation",
    brightness: "Luminosité",
    pinnedColor: "Couleur épinglée",

    total: "Total",
    start: "Début",
    end: "Fin",
    rate: "Taux",
    curve: "Courbe",
    longPathInterpolation: "Interpolation de chemin long",
    enablePinnedColor: "Épingler une couleur spécifique",
    hexValue: "Valeur hexadécimale",
    
    luminance: "Luminance",
    satBri: "Sat × Lum",
    
    hueLabel: "Teinte",
    saturationLabel: "Saturation",
    brightnessLabel: "Luminosité",
    luminanceLabel: "Luminance",
    saturationBrightnessLabel: "Saturation × Luminosité",
    
    totalColors: "Total des Couleurs",
    
    contrastRatio: "Ratio de contraste",
    wcagAAA: "AAA: Contraste amélioré (ratio 7:1+)",
    wcagAA: "AA: Contraste standard (ratio 4.5:1+)",
    wcagA: "A: Contraste minimum (ratio 3:1+)",
    wcagFail: "Échec: En dessous du contraste minimum (<3:1)",
    withBestBackground: "avec le meilleur arrière-plan",
    
    exportTitle: "Exporter la Palette",
    css: "CSS",
    json: "JSON",
    plainText: "Texte Brut",
    close: "Fermer",
    copy: "Copier",
    copied: "Copié!",
    downloadFile: "Télécharger le fichier",
    numbered: "Numéroté",
    includeHash: "Inclure #",

    language: "Langue",
  },
  de: {
    appName: "🌈️ Color Guru",
    reset: "Zurücksetzen",
    export: "Exportieren",

    numberOfColors: "Anzahl der Farben",
    hue: "Farbton",
    saturation: "Sättigung",
    brightness: "Helligkeit",
    pinnedColor: "Angeheftete farbe",

    total: "Gesamt",
    start: "Start",
    end: "Ende",
    rate: "Rate",
    curve: "Kurve",
    longPathInterpolation: "Lange Pfad Interpolation",
    enablePinnedColor: "Eine bestimmte Farbe anheften",
    hexValue: "Hex-Wert",
    
    luminance: "Luminanz",
    satBri: "Sätt × Hell",
    
    hueLabel: "Farbton",
    saturationLabel: "Sättigung",
    brightnessLabel: "Helligkeit",
    luminanceLabel: "Luminanz",
    saturationBrightnessLabel: "Sättigung × Helligkeit",
    
    totalColors: "Gesamtfarben",
    
    contrastRatio: "Kontrastverhältnis",
    wcagAAA: "AAA: Verbesserter Kontrast (7:1+ Verhältnis)",
    wcagAA: "AA: Standard Kontrast (4.5:1+ Verhältnis)",
    wcagA: "A: Mindestkontrast (3:1+ Verhältnis)",
    wcagFail: "Fehlgeschlagen: Unter Mindestkontrast (<3:1)",
    withBestBackground: "mit dem besten Hintergrund",
    
    exportTitle: "Palette Exportieren",
    css: "CSS",
    json: "JSON",
    plainText: "Reiner Text",
    close: "Schließen",
    copy: "Kopieren",
    copied: "Kopiert!",
    downloadFile: "Datei herunterladen",
    numbered: "Nummeriert",
    includeHash: "Mit #",

    language: "Sprache",
  },
  "pt-br": {
    appName: "🌈️ Color Guru",
    reset: "Redefinir",
    export: "Exportar",

    numberOfColors: "Número de cores",
    hue: "Matiz",
    saturation: "Saturação",
    brightness: "Brilho",
    pinnedColor: "Cor fixada",

    total: "Total",
    start: "Início",
    end: "Fim",
    rate: "Taxa",
    curve: "Curva",
    longPathInterpolation: "Interpolar no sentido mais longo",
    enablePinnedColor: "Fixar uma cor específica",
    hexValue: "Valor hexadecimal",
    
    luminance: "Luminância",
    satBri: "Sat × Bri",
    
    hueLabel: "Matiz",
    saturationLabel: "Saturação",
    brightnessLabel: "Brilho",
    luminanceLabel: "Luminância",
    saturationBrightnessLabel: "Saturação × Brilho",
    
    totalColors: "Total de Cores",
    
    contrastRatio: "Proporção de contraste",
    wcagAAA: "AAA: Contraste aprimorado (proporção 7:1+)",
    wcagAA: "AA: Contraste padrão (proporção 4.5:1+)",
    wcagA: "A: Contraste mínimo (proporção 3:1+)",
    wcagFail: "Falha: Abaixo do contraste mínimo (<3:1)",
    withBestBackground: "com o melhor fundo",
    
    exportTitle: "Exportar Paleta",
    css: "CSS",
    json: "JSON",
    plainText: "Texto Simples",
    close: "Fechar",
    copy: "Copiar",
    copied: "Copiado!",
    downloadFile: "Baixar arquivo",
    numbered: "Numerado",
    includeHash: "Incluir #",

    language: "Idioma",
  },
  zh: {
    appName: "🌈️ 色彩大师",
    reset: "重置",
    export: "导出",

    numberOfColors: "颜色数量",
    hue: "色相",
    saturation: "饱和度",
    brightness: "亮度",
    pinnedColor: "固定颜色",

    total: "总计",
    start: "开始",
    end: "结束",
    rate: "比率",
    curve: "曲线",
    longPathInterpolation: "长路径插值",
    enablePinnedColor: "固定特定颜色",
    hexValue: "十六进制值",
    
    luminance: "明度",
    satBri: "饱和 × 亮度",
    
    hueLabel: "色相",
    saturationLabel: "饱和度",
    brightnessLabel: "亮度",
    luminanceLabel: "明度",
    saturationBrightnessLabel: "饱和度 × 亮度",
    
    totalColors: "总颜色数",
    
    contrastRatio: "对比度比例",
    wcagAAA: "AAA: 增强对比度 (7:1+ 比例)",
    wcagAA: "AA: 标准对比度 (4.5:1+ 比例)",
    wcagA: "A: 最小对比度 (3:1+ 比例)",
    wcagFail: "失败: 低于最小对比度 (<3:1)",
    withBestBackground: "在最佳背景下",
    
    exportTitle: "导出调色板",
    css: "CSS",
    json: "JSON",
    plainText: "纯文本",
    close: "关闭",
    copy: "复制",
    copied: "已复制！",
    downloadFile: "下载文件",
    numbered: "编号",
    includeHash: "包含#",

    language: "语言",
  },
  ja: {
    appName: "🌈️ カラーグル",
    reset: "リセット",
    export: "エクスポート",

    numberOfColors: "色の数",
    hue: "色相",
    saturation: "彩度",
    brightness: "明度",
    pinnedColor: "固定色",

    total: "合計",
    start: "開始",
    end: "終了",
    rate: "レート",
    curve: "曲線",
    longPathInterpolation: "長経路補間",
    enablePinnedColor: "特定の色を固定",
    hexValue: "16進数値",
    
    luminance: "輝度",
    satBri: "彩度 × 明度",
    
    hueLabel: "色相",
    saturationLabel: "彩度",
    brightnessLabel: "明度",
    luminanceLabel: "輝度",
    saturationBrightnessLabel: "彩度 × 明度",
    
    totalColors: "総色数",
    
    contrastRatio: "コントラスト比",
    wcagAAA: "AAA: 拡張コントラスト (7:1+ 比)",
    wcagAA: "AA: 標準コントラスト (4.5:1+ 比)",
    wcagA: "A: 最小コントラスト (3:1+ 比)",
    wcagFail: "不合格: 最小コントラスト未満 (<3:1)",
    withBestBackground: "最適な背景で",
    
    exportTitle: "パレットをエクスポート",
    css: "CSS",
    json: "JSON",
    plainText: "プレーンテキスト",
    close: "閉じる",
    copy: "コピー",
    copied: "コピーしました！",
    downloadFile: "ファイルをダウンロード",
    numbered: "番号付き",
    includeHash: "「#」を含める",

    language: "言語",
  },
  hi: {
    appName: "🌈️ रंग गुरु",
    reset: "रीसेट",
    export: "निर्यात",

    numberOfColors: "रंगों की संख्या",
    hue: "रंग",
    saturation: "संतृप्ति",
    brightness: "चमक",
    pinnedColor: "निश्चित रंग",

    total: "कुल",
    start: "शुरू",
    end: "अंत",
    rate: "दर",
    curve: "वक्र",
    longPathInterpolation: "लंबा पथ इंटरपोलेशन",
    enablePinnedColor: "एक विशिष्ट रंग निश्चित करें",
    hexValue: "हेक्स मान",
    
    luminance: "प्रकाश",
    satBri: "सैट × चमक",
    
    hueLabel: "रंग",
    saturationLabel: "संतृप्ति",
    brightnessLabel: "चमक",
    luminanceLabel: "प्रकाश",
    saturationBrightnessLabel: "संतृप्ति × चमक",
    
    totalColors: "कुल रंग",
    
    contrastRatio: "कंट्रास्ट अनुपात",
    wcagAAA: "AAA: उन्नत कंट्रास्ट (7:1+ अनुपात)",
    wcagAA: "AA: मानक कंट्रास्ट (4.5:1+ अनुपात)",
    wcagA: "A: न्यूनतम कंट्रास्ट (3:1+ अनुपात)",
    wcagFail: "असफल: न्यूनतम कंट्रास्ट से कम (<3:1)",
    withBestBackground: "सर्वोत्तम पृष्ठभूमि के साथ",
    
    exportTitle: "पैलेट निर्यात करें",
    css: "CSS",
    json: "JSON",
    plainText: "सादा पाठ",
    close: "बंद करें",
    copy: "कॉपी",
    copied: "कॉपी किया गया!",
    downloadFile: "फ़ाइल डाउनलोड करें",
    numbered: "क्रमांकित",
    includeHash: "# शामिल करें",

    language: "भाषा",
  },
  ru: {
    appName: "🌈️ Цветовой Гуру",
    reset: "Сброс",
    export: "Экспорт",

    numberOfColors: "Количество Цветов",
    hue: "Оттенок",
    saturation: "Насыщенность",
    brightness: "Яркость",
    pinnedColor: "Закрепленный Цвет",

    total: "Всего",
    start: "Начало",
    end: "Конец",
    rate: "Скорость",
    curve: "Кривая",
    longPathInterpolation: "Интерполяция длинного пути",
    enablePinnedColor: "Закрепить определенный цвет",
    hexValue: "Шестнадцатеричное значение",
    
    luminance: "Светимость",
    satBri: "Нас × Ярк",
    
    hueLabel: "Оттенок",
    saturationLabel: "Насыщенность",
    brightnessLabel: "Яркость",
    luminanceLabel: "Светимость",
    saturationBrightnessLabel: "Насыщенность × Яркость",
    
    totalColors: "Всего Цветов",
    
    contrastRatio: "Коэффициент контрастности",
    wcagAAA: "AAA: Улучшенный контраст (соотношение 7:1+)",
    wcagAA: "AA: Стандартный контраст (соотношение 4.5:1+)",
    wcagA: "A: Минимальный контраст (соотношение 3:1+)",
    wcagFail: "Неудача: Ниже минимального контраста (<3:1)",
    withBestBackground: "с лучшим фоном",
    
    exportTitle: "Экспорт Палитры",
    css: "CSS",
    json: "JSON",
    plainText: "Обычный Текст",
    close: "Закрыть",
    copy: "Копировать",
    copied: "Скопировано!",
    downloadFile: "Скачать файл",
    numbered: "Нумерованный",
    includeHash: "Включать #",

    language: "Язык",
  },
};

export const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt-br', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export const getTranslation = (language: string, key: keyof TranslationKeys): string => {
  return translations[language]?.[key] || translations.en[key];
};
