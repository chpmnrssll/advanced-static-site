import page from 'page';
import animateHeadlines from './animateHeadlines';
import animateFooter from './animateFooter';
import { animateContentIn, animateContentOut } from './animateContent';
import { fitTextElements, fitTextFatElements } from './featured';
import runDemos from './canvasDemos';

// Lazy load and animate in new content
page('*', (context) => {
  // Initial page load
  if (context.init) {
    fitTextElements(16, 128);
    fitTextFatElements(16, 128, 1.0);
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
    fitTextElements(24, 128);
    fitTextFatElements(64, 128, 0.7);
    animateHeadlines();
    animateFooter();
    runDemos(context);
  };

  request.open('GET', `${context.path}`, true);
  request.send();
});

page.exit('*', (context, next) => {
  animateContentOut().then(() => {
    if (window.demo && window.demo.stop) {
      window.demo.stop();
    }
  }).then(next);
});

page();
