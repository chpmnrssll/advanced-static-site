import FitText from './fittext';

const ft = new FitText();

export function fitTextElements(minFontSize, maxFontSize, compress = 1) {
  const elements = document.querySelectorAll('.fit__text');
  elements.forEach(element => ft.fit(element, minFontSize, maxFontSize, compress));
}

export function fitTextFatElements(minFontSize, maxFontSize, compress = 1) {
  const element = document.querySelector('.fit__text--fat');
  if (element) {
    ft.fit(element, minFontSize, maxFontSize, compress);
  }
}
