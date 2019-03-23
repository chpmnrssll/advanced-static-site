import PolynomialRegression from '../node_modules/js-polynomial-regression/dist/PolynomialRegression';

class TextElement {
  constructor(element, compress = 1.0) {
    this.element = element;
    this.style = window.getComputedStyle(this.element);
    this.paddingLeft = parseFloat(this.style.paddingLeft, 10) || 0;
    this.paddingRight = parseFloat(this.style.paddingRight, 10) || 0;
    this.padding = this.paddingLeft + this.paddingRight;
    this.width = (parseFloat(this.style.width, 10) || 0) + this.padding;

    const parentStyle = window.getComputedStyle(this.element.parentElement);
    this.parent = {
      element: element.parentElement,
      style: parentStyle,
      paddingLeft: parseFloat(parentStyle.paddingLeft, 10) || 0,
      paddingRight: parseFloat(parentStyle.paddingRight, 10) || 0,
    };
    this.parent.padding = this.parent.paddingLeft + this.parent.paddingRight;
    this.parent.width = ((parseFloat(parentStyle.width, 10) || 0) - this.parent.padding) * compress;

    this.font = {
      style: this.style.fontStyle,
      variant: this.style.fontVariant,
      weight: parseFloat(this.style.fontWeight, 10),
      size: parseFloat(this.style.fontSize, 10),
      lineHeight: parseFloat(this.style.lineHeight, 10),
      family: this.style.fontFamily,
    };
  }
}

class TextMetrics {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  measureText({ element, font, padding }) {
    const {
      style,
      variant,
      weight,
      size,
      lineHeight,
      family,
    } = font;
    this.context.font = `${style} ${variant} ${weight} ${size}px/${lineHeight}px ${family}`;
    return this.context.measureText(element.innerText).width + padding;
  }
}

export default class FitText {
  constructor() {
    this.textMetrics = new TextMetrics();
  }

  fit(element, compress = 1.0, minFontSize = 16, maxFontSize = 1024) {
    const textElement = new TextElement(element, compress);
    const samples = [];

    // sample font widths
    for (let i = 0; i < 3; i++) {
      textElement.font.size += i;
      const magic = (textElement.font.size / 10); // tweak magic number for best fit
      samples.push({
        x: this.textMetrics.measureText(textElement),
        y: textElement.font.size - magic,
      });
    }

    textElement.model = PolynomialRegression.read(samples, 2);
    textElement.terms = textElement.model.getTerms();

    const predictedSize = textElement.model.predictY(textElement.terms, textElement.parent.width);
    const clampedSize = Math.max(minFontSize, Math.min(maxFontSize, predictedSize));
    const vwSize = (100 * clampedSize) / window.innerWidth;
    textElement.element.style.fontSize = `${vwSize}vw`;
    textElement.element.style.lineHeight = `${vwSize}vw`;
  }
}
