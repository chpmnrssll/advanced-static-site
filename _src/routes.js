import page from 'page';
import { easing, styler, tween } from 'popmotion';
import './home';
import './accent';

const animationSpeed = 250;
const delaySpeed = 10;
const waitSpeed = 100;

// Gets the node depth of an DOM element
function getDOMElementDepth(parent, descendant) {
  let depth = 0;
  while (!descendant.isEqualNode(parent)) {
    depth++;
    descendant = descendant.parentElement;
  }

  return depth;
}

function attachDOMElement(element, delay) {
  const elementStyler = styler(element);
  const elementAnimation = tween({
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 },
    ease: easing.easeInOut,
    duration: animationSpeed,
  });

  // Use delay for staggered animation start
  setTimeout(() => {
    elementAnimation.start(v => elementStyler.set(v));
  }, delay * delaySpeed, 1);
}

function detachDOMElement(element, delay) {
  const elementStyler = styler(element);
  const elementAnimation = tween({
    from: { opacity: 1, scale: 1 },
    to: { opacity: 0, scale: 0 },
    ease: easing.easeInOut,
    duration: animationSpeed,
  });

  // Use delay for staggered animation start
  setTimeout(() => {
    elementAnimation.start(v => elementStyler.set(v));
  }, delay * delaySpeed, 1);
}

// Lazy load and animate in new content
page('*', (context) => {
  // Bail on initial page load
  if (context.init) {
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
    const newElements = [].slice.call(newContent.querySelectorAll('*'));

    // Set opacity to 0 for all elements on the new page
    newElements.forEach((element) => {
      element.style.opacity = 0;
    });

    const oldContent = document.querySelector('.content');
    oldContent.parentNode.replaceChild(newContent, oldContent);

    newElements.map((element) => {
      // Add DOM node depth to each element to sort by
      element.depth = getDOMElementDepth(newContent, element);
      return element;
    }).sort((a, b) => (a.depth > b.depth ? 1 : -1))
      .forEach((element, index) => {
        attachDOMElement(element, element.depth + index);
      });
  };

  request.open('GET', `${context.path}`, true);
  request.send();
});

// Animate out old content
page.exit('*', (context, next) => {
  const content = document.querySelector('.content');
  const elements = [].slice.call(content.querySelectorAll('*'));

  elements.map((element) => {
    // Add DOM node depth to each element for sorting
    element.depth = getDOMElementDepth(content, element);
    return element;
  }).sort((a, b) => (a.depth < b.depth ? 1 : -1))
    .forEach((element, index, list) => {
      detachDOMElement(element, element.depth + index);
      if (index + 1 === list.length) {
        setTimeout(next, (list.length * delaySpeed) + waitSpeed);
      }
    });
});

page();
