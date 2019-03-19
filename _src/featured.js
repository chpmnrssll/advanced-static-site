import FitText from './fittext';

const textFitter = new FitText();

export function fitTextElements(compress) {
  const elements = document.querySelectorAll('.fit__text');
  elements.forEach((element) => {
    textFitter.fit(element, compress);
  });
}

export function fitTextFatElements(compress) {
  const element = document.querySelector('.fit__text--fat');
  if (element) {
    textFitter.fit(element, compress);
  }
}

export function stopFitting() {
  textFitter.removeAllEventListeners();
}
