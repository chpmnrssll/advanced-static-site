import page from 'page';
import mediumZoom from 'medium-zoom';
import animateHeadlines from './animateHeadlines';
import animateFooter from './animateFooter';
import { animateContentIn, animateContentOut } from './animateContent';
import { fitTextElements, fitTextFatElements, stopFitting } from './featured';
import runDemos from './canvasDemos';

const zoom = mediumZoom({
  background: '#000000aa',
});

// Lazy load and animate in new content
page('*', (context) => {
  // Initial page load
  if (context.init) {
    zoom.attach('.image__thumb, .image__thumb--alt');
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
    zoom.attach('.image__thumb, .image__thumb--alt');
  };

  request.open('GET', `${context.path}`, true);
  request.send();
});

page.exit('*', (context, next) => {
  animateContentOut().then(() => {
    stopFitting();
    if (window.demo && window.demo.stop) {
      window.demo.stop();
    }
    zoom.detach();
  }).then(next);
});

page();
