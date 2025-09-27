# Color Guru

A powerful web application for generating accessible, visually consistent color palettes and gradients for UI design.

## Features

- **Interactive Controls**: Adjust steps, hue, saturation, and luminosity with real-time updates
- **Curve Types**: 22+ easing curve options for smooth color transitions
- **Dynamic Graph Visualization**: Toggle between hue, saturation, and luminosity graphs
- **Accessibility**: WCAG compliance indicators and contrast ratio calculations
- **Export Options**: CSS variables, JSON, and plain text formats
- **Copy to Clipboard**: One-click copying of individual hex values
- **Professional UI**: Clean, modern interface optimized for designers and developers

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be available in the `dist` directory.

## Usage

1. **Steps Control**: Use the slider to set how many colors (3-21) you want in your palette
2. **Hue Settings**: Set start and end hue values (0-360°) and choose an easing curve
3. **Saturation Settings**: Control saturation start/end values and rate multiplier
4. **Luminosity Settings**: Adjust brightness levels for the palette
5. **Graph View**: Switch between hue, saturation, and luminosity visualizations
6. **Palette Preview**: View generated colors with accessibility information
7. **Export**: Click the "Export" button to save your palette in various formats

## Color Math

The application uses advanced color interpolation with:

- HSL to RGB conversion for accurate color representation
- Multiple easing curves for smooth transitions
- Contrast ratio calculations following WCAG 2.0 standards
- Intelligent hue interpolation around the color wheel

## Accessibility

Each generated color includes:

- Contrast ratios against white and black backgrounds
- WCAG 2.0 compliance levels (AAA, AA, A, or Fail)
- Visual indicators for accessibility standards

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **CSS3** with custom properties
- **SVG** for graph visualizations
- **Modern JavaScript** (ES2020+)

## License

This project is open source and available under the MIT License.