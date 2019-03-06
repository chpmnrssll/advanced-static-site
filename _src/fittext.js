export default class FitText {
  constructor(compressor) {
    this.compressor = compressor || 1;
    this.maxFontSize = 128;
    this.minFontSize = 16;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  getTextWidth(element) {
    const elementStyle = window.getComputedStyle(element);
    this.context.font = elementStyle.font;

    return {
      fontSize: parseInt(elementStyle.fontSize, 10),
      width: this.context.measureText(element.innerText).width,
      computedStyle: elementStyle,
    };
  }

  fit(element, minFontSize = this.minFontSize, maxFontSize = this.maxFontSize, compress = 1) {
    const resizer = () => {
      const { fontSize, width } = this.getTextWidth(element);
      this.threshold = fontSize;
      this.minFontSize = minFontSize;
      this.maxFontSize = maxFontSize;
      const parentStyle = window.getComputedStyle(element.parentElement);
      const parentPadding = parseInt(parentStyle.padding, 10) || 0;
      const parentWidth = (parseInt(parentStyle.width, 10) || 0) - (parentPadding * 4);
      const diff = (parentWidth * compress) - width;

      if (diff > 0 && diff > this.threshold) {
        const fS = Math.max(Math.min(fontSize, maxFontSize), minFontSize);
        const size = `${fS * 1.1}px`;
        element.style.fontSize = size;
        element.style.lineHeight = size;
        window.requestAnimationFrame(resizer);
      } else if (diff < 0 && -diff > this.threshold) {
        const fS = Math.max(Math.min(fontSize, this.maxFontSize), this.minFontSize);
        const size = `${fS * 0.99}px`;
        element.style.fontSize = size;
        element.style.lineHeight = size;
        window.requestAnimationFrame(resizer);
      }
    };

    // Call once to set.
    resizer();

    // Bind events
    // If you have any js library which support Events, replace this part
    // and remove addEvent function (or use original jQuery version)
    if (window.addEventListener) {
      window.addEventListener('resize', resizer, false);
      window.addEventListener('orientationchange', resizer, false);
    } else {
      window.attachEvent('onresize', resizer);
      window.attachEvent('orientationchange', resizer);
    }
    return this;
  }
}
