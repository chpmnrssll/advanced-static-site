import page from 'page';

const animationSpeed = 1000;
const delaySpeed = 10;
const waitSpeed = 100;

// const easeInBack = 'cubic-bezier(0.600, -0.280, 0.735, 0.045)';
// const easeOutBack = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)';
const easeInOutBack = 'cubic-bezier(0.680, -0.550, 0.265, 1.550)';

function getElementDepth(parent, descendant) {
  let depth = 0;
  while (!descendant.isEqualNode(parent)) {
    depth++;
    descendant = descendant.parentElement;
  }

  return depth;
}

function transition(element, keyframes, duration, iterations, delay, easing) {
  const timing = {
    delay: delaySpeed * delay,
    duration,
    iterations,
    easing,
  };

  return element.animate(keyframes, timing);
}

function attachElement(element, delay) {
  const keyframes = [
    { opacity: 0, transform: 'scale(0, 0)' },
    { opacity: 1, transform: 'none' },
  ];

  transition(element, keyframes, animationSpeed, 1, delay, easeInOutBack)
    .onfinish = () => { element.style.opacity = 1; };
}

function detachElement(element, delay) {
  const keyframes = [
    { opacity: 1, transform: 'none' },
    { opacity: 0, transform: 'scale(0, 0)' },
  ];

  transition(element, keyframes, animationSpeed, 1, delay, easeInOutBack)
    .onfinish = () => { element.style.opacity = 0; };
}

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

    newElements.forEach((element) => {
      element.style.opacity = 0;
    });

    const oldContent = document.querySelector('.content');
    oldContent.parentNode.replaceChild(newContent, oldContent);

    newElements.map((element) => {
      element.depth = getElementDepth(newContent, element);
      return element;
    }).sort((a, b) => (a.depth > b.depth ? 1 : -1))
      .forEach((element, index) => {
        attachElement(element, element.depth + index);
      });
  };

  request.open('GET', `${context.path}`, true);
  request.send();
});

page.exit('*', (context, next) => {
  const content = document.querySelector('.content');
  const elements = [].slice.call(content.querySelectorAll('*'));

  elements.map((element) => {
    element.depth = getElementDepth(content, element);
    return element;
  }).sort((a, b) => (a.depth < b.depth ? 1 : -1))
    .forEach((element, index, list) => {
      detachElement(element, element.depth + index);
      if (index + 1 === list.length) {
        setTimeout(next, (list.length * delaySpeed) + waitSpeed);
      }
    });
});

page();
