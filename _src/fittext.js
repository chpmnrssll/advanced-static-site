export default class FitText {
  constructor(compressor) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.compressor = compressor || 1;
    this.maxFontSize = 128;
    this.minFontSize = 8;
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

  fit(element, minFontSize, maxFontSize, compressor) {
    this.minFontSize = minFontSize || this.minFontSize;
    this.maxFontSize = maxFontSize || this.maxFontSize;
    this.compressor = compressor || this.compressor;
    const minPadding = 16;

    const resizer = () => {
      const { fontSize, width } = this.getTextWidth(element);
      const parentStyle = window.getComputedStyle(element.parentElement);
      const parentPadding = parseInt(parentStyle.padding, 10) + minPadding || minPadding;
      const parentWidth = (parseInt(parentStyle.width, 10) - parentPadding) || 0;
      const diff = (parentWidth * this.compressor) - width;
      const clampedSize = Math.max(Math.min(fontSize, this.maxFontSize), this.minFontSize);

      if (diff > fontSize) {
        const size = `${clampedSize * 1.1}px`;
        element.style.fontSize = size;
        element.style.lineHeight = size;
        window.requestAnimationFrame(resizer);
      } else if (-diff > fontSize) {
        const size = `${clampedSize * 0.99}px`;
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
