import FitText from './fittext';

const fitText = new FitText();

export function fitTextElements(compress) {
  const elements = document.querySelectorAll('.fit__text');
  elements.forEach((element) => {
    fitText.predictSize(element, compress);
  });
}

export function fitTextFatElements(compress) {
  const element = document.querySelector('.fit__text--fat');
  if (element) {
    fitText.predictSize(element, compress);
  }
}

export function stopFitting() {
  fitText.removeAllEventListeners();
}
