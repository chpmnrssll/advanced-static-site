import { easing, styler, tween } from 'popmotion';

const animationSpeed = 250;
const delaySpeed = 10;
const waitSpeed = 100;

function attachDOMElement(element, delay) {
  const elementStyler = styler(element);
  const elementAnimation = tween({
    from: {
      opacity: 0,
      scale: 0,
    },
    to: {
      opacity: 1,
      scale: 1,
    },
    ease: easing.easeInOut,
    duration: animationSpeed,
  });

  // Use delay to staggered animation start
  setTimeout(() => {
    elementAnimation.start(v => elementStyler.set(v));
  }, delay * delaySpeed, 1);
}

function detachDOMElement(element, delay) {
  const elementStyler = styler(element);
  const elementAnimation = tween({
    from: {
      opacity: 1,
      scale: 1,
    },
    to: {
      opacity: 0,
      scale: 0,
    },
    ease: easing.easeInOut,
    duration: animationSpeed,
  });

  // Use delay to staggered animation start
  setTimeout(() => {
    elementAnimation.start(v => elementStyler.set(v));
  }, delay * delaySpeed, 1);
}

// Gets the node depth of an DOM element from it's parent
function sortByDOMDepth(parent, elementA, elementB) {
  let depthA = 0;
  while (!elementA.isEqualNode(parent)) {
    depthA++;
    elementA = elementA.parentElement;
  }

  let depthB = 0;
  while (!elementB.isEqualNode(parent)) {
    depthB++;
    elementB = elementB.parentElement;
  }

  return depthA < depthB ? 1 : -1;
}

function animateContentIn(newContent) {
  const oldContent = document.querySelector('.content');
  const newElements = [].slice.call(newContent.querySelectorAll('*'));

  // Set opacity to 0 for all elements on the new page
  newElements.forEach((element) => {
    element.style.opacity = 0;
  });

  oldContent.parentNode.replaceChild(newContent, oldContent);

  newElements
    .sort((a, b) => sortByDOMDepth(newContent, a, b))
    .forEach((element, index) => {
      attachDOMElement(element, element.depth + index);
    });
}


function animateContentOut() {
  const content = document.querySelector('.content');
  const elements = [].slice.call(content.querySelectorAll('*'));

  return new Promise((resolve) => {
    elements
      .sort((a, b) => sortByDOMDepth(content, a, b))
      .forEach((element, index, list) => {
        detachDOMElement(element, element.depth + index);

        if (index + 1 === list.length) {
          setTimeout(resolve, (list.length * delaySpeed) + waitSpeed);
        }
      });
  });
}

export {
  animateContentIn,
  animateContentOut,
};
