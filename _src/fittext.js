import PolynomialRegression from '../node_modules/js-polynomial-regression/dist/PolynomialRegression';
// import nextFrame from './nextFrame';

function getParentWidth(element, compress) {
  const style = window.getComputedStyle(element.parentElement);
  const paddingLeft = parseFloat(style.paddingLeft, 10) || 0;
  const paddingRight = parseFloat(style.paddingRight, 10) || 0;
  const width = parseFloat(style.width, 10) || 0;
  return width - ((paddingLeft + paddingRight) * compress);
}

function joinFontArray(fontArray, fontSize) {
  fontArray[4] = `${fontSize}px`;
  return fontArray.join(' ');
}

function splitFontString(fontString) {
  const fontArray = fontString.split(' ');
  fontArray[4] = parseFloat(fontArray[4], 10);
  return fontArray;
}

export default class FitText {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.elements = [];
  }

  getTextWidth(element, fontString) {
    this.context.font = fontString;
    return this.context.measureText(element.innerText).width;
  }

  * getFittedSize(element, fontString, desiredWidth) {
    const fontArray = splitFontString(fontString);
    let fontSize = fontArray[4];
    const width = this.getTextWidth(element, fontString);
    const difference = desiredWidth - width;
    const threshold = 1;
    const stepSize = 1;

    if (difference > threshold) {
      fontSize += stepSize;
    } else if (difference < -threshold) {
      fontSize -= stepSize;
    }

    yield {
      difference,
      fontSize,
      fontString: joinFontArray(fontArray, fontSize),
      width,
    };
  }

  fit(element, compress = 1.0, minFontSize = 16, maxFontSize = 1024) {
    const style = window.getComputedStyle(element);
    let fontString = style.font;
    const fontArray = splitFontString(fontString);
    let fontSize = fontArray[4];
    let width = 0;
    const data = [];

    const newElement = {
      element,
      resizer: async () => {
        const desiredWidth = getParentWidth(element, compress);

        for (let i = 0; i < 3; i++) {
          const { value } = this.getFittedSize(element, fontString, desiredWidth).next();
          ({ fontString, fontSize, width } = value);
          data.push({ x: width, y: fontSize });
        }

        const model = PolynomialRegression.read(data, 2);
        const terms = model.getTerms();
        const predictedSize = model.predictY(terms, desiredWidth * 0.95);
        const maxSize = Math.min(maxFontSize, predictedSize);
        const finalSize = Math.max(minFontSize, maxSize);
        element.style.fontSize = `${finalSize}px`;
        element.style.lineHeight = `${finalSize}px`;
      },
    };

    newElement.resizer();
    this.elements.push(newElement);
    window.addEventListener('resize', newElement.resizer, false);
    window.addEventListener('orientationchange', newElement.resizer, false);
  }

  removeAllEventListeners() {
    this.elements.forEach((element) => {
      window.removeEventListener('resize', element.resizer, false);
      window.removeEventListener('orientationchange', element.resizer, false);
    });
  }
}
