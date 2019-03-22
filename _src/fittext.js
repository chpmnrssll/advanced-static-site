import PolynomialRegression from '../node_modules/js-polynomial-regression/dist/PolynomialRegression';

class TextMetrics {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  measureText(element, font) {
    this.context.font = `${font.style} ${font.variant} ${font.weight} ${font.size}px/${font.lineHeight}px ${font.family}`;
    return this.context.measureText(element.innerText).width;
  }
}


class TextElement {
  constructor(element) {
    this.element = element;
    this.font = {};
    this.parent = {
      element: element.parentElement,
      font: {},
    };
  }

  getStyles() {
    this.style = window.getComputedStyle(this.element);
    this.paddingLeft = parseFloat(this.style.paddingLeft, 10) || 0;
    this.paddingRight = parseFloat(this.style.paddingRight, 10) || 0;
    this.font.style = this.style.fontStyle;
    this.font.variant = this.style.fontVariant;
    this.font.weight = parseFloat(this.style.fontWeight, 10);
    this.font.size = parseFloat(this.style.fontSize, 10);
    this.font.lineHeight = parseFloat(this.style.lineHeight, 10);
    this.font.family = this.style.fontFamily;
    this.parent.style = window.getComputedStyle(this.element.parentElement);
    this.parent.width = parseFloat(this.parent.style.width, 10) || 0;
    this.parent.paddingLeft = parseFloat(this.parent.style.paddingLeft, 10) || 0;
    this.parent.paddingRight = parseFloat(this.parent.style.paddingRight, 10) || 0;
  }

  get desiredWidth() {
    return this.parent.width - (this.parent.paddingLeft + this.parent.paddingRight);
  }
}

const fudgeFactor = 4;

export default class FitText {
  constructor() {
    this.textMetrics = new TextMetrics();
    this.elements = [];
  }

  predictSize(element, compress = 1.0, minFontSize = 16, maxFontSize = 1024) {
    const textElement = new TextElement(element, compress, minFontSize, maxFontSize);

    textElement.resizeHandler = () => {
      textElement.getStyles();
      textElement.samples = textElement.samples || this.collectSamples(textElement, 3);
      const model = PolynomialRegression.read(textElement.samples, 2);
      const predictedSize = model.predictY(model.getTerms(), textElement.desiredWidth);
      const clampedSize = Math.max(minFontSize, Math.min(maxFontSize, predictedSize));

      textElement.element.style.fontSize = `${clampedSize - fudgeFactor}px`;
      textElement.element.style.lineHeight = `${clampedSize - fudgeFactor}px`;
      // textElement.element.style.border = '1px dashed black';
    };

    textElement.resizeHandler();
    this.elements.push(textElement);
    window.addEventListener('resize', textElement.resizeHandler, false);
    window.addEventListener('orientationchange', textElement.resizeHandler, false);
  }

  collectSamples(textElement, count) {
    const samples = [];
    for (let i = 0; i < count; i++) {
      const { font } = textElement;
      font.size += (i * count);
      samples.push({
        x: this.textMetrics.measureText(textElement.element, font),
        y: font.size,
      });
    }

    return samples;
  }

  removeAllEventListeners() {
    this.elements.forEach((element) => {
      window.removeEventListener('resize', element.resizeHandler, false);
      window.removeEventListener('orientationchange', element.resizeHandler, false);
    });
  }
}
