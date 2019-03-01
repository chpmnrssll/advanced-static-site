import page from 'page';
import animateHeadline from './animateHeadline';
import animateFooter from './animateFooter';
import { animateContentIn, animateContentOut } from './animateContent';

// Lazy load and animate in new content
page('*', (context) => {
  // Initial page load
  if (context.init) {
    animateHeadline();
    animateFooter();
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
    animateHeadline();
  };

  request.open('GET', `${context.path}`, true);
  request.send();
});

page.exit('*', (context, next) => {
  animateContentOut().then(next);
});

page();
