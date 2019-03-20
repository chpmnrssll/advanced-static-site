import page from 'page';
import mediumZoom from 'medium-zoom';
import animateHeadlines from './animateHeadlines';
import animateFooter from './animateFooter';
import { animateContentIn, animateContentOut } from './animateContent';
import { fitTextElements, fitTextFatElements, stopFitting } from './featured';
import runDemos from './canvasDemos';

let zoom = null;

// Lazy load and animate in new content
page('*', (context) => {
  zoom = mediumZoom('.image__thumb, .image__thumb--alt', {
    background: '#000000aa',
  });

  // Initial page load
  if (context.init) {
    fitTextElements();
    fitTextFatElements();
    animateHeadlines();
    animateFooter();
    runDemos(context);
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
    fitTextElements();
    fitTextFatElements();
    animateHeadlines();
    animateFooter();
    runDemos(context);
  };

  request.open('GET', `${context.path}`, true);
  request.send();
});

page.exit('*', (context, next) => {
  animateContentOut().then(() => {
    stopFitting();
    zoom.detach();
    if (window.demo && window.demo.stop) {
      window.demo.stop();
    }
  }).then(next);
});

page();
