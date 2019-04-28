import page from 'page';
import mediumZoom from 'medium-zoom';
import animateFooter from './animateFooter';
import animateHeadlines from './animateHeadlines';
import { animateContentIn, animateContentOut } from './animateContent';
import runDemos from './canvasDemos';
import FitText from './fittext';
import ImageLoader from './imageLoader';

const fitText = new FitText();
const imageLoader = new ImageLoader();
const zoom = mediumZoom({ background: '#000000aa' });

function fitTextElements() {
  const elements = document.querySelectorAll('.fit__text');
  elements.forEach((element) => {
    const compress = element.getAttribute('compress') || 1.0;
    const minFontSize = element.getAttribute('minFontSize') || 16;
    const maxFontSize = element.getAttribute('maxFontSize') || 1024;
    fitText.fit(element, compress, minFontSize, maxFontSize);
  });
}

function pageSetup() {
  fitTextElements();
  animateHeadlines();
  animateFooter();
  runDemos();
  imageLoader.lazyLoad();
  zoom.attach('.image__thumb, .image__thumb--alt');
}

// Lazy load and animate in new content
page('*', (context) => {
  // Initial page load
  if (context.init) {
    pageSetup();
    return;
  }

  const request = new window.XMLHttpRequest();
  request.onloadend = (event) => {
    if (event.target.status === 404) {
      page('/404');
    }

    const parser = new window.DOMParser();
    const newDocument = parser.parseFromString(event.target.response, 'text/html');
    const newContent = newDocument.querySelector('.content');

    animateContentIn(newContent);
    pageSetup();
  };

  request.open('GET', `${context.path}`, true);
  request.send();
});

page.exit('*', (context, next) => {
  animateContentOut().then(() => {
    zoom.detach();
    if (window.demo && window.demo.stop) {
      window.demo.stop();
    }
  }).then(next);
});

page();
