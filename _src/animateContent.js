import { easing, styler, tween } from 'popmotion';

const animationSpeed = 256;

function animateContentIn(newContent) {
  const oldContent = document.querySelector('.content');

  oldContent.parentNode.replaceChild(newContent, oldContent);

  const elementStyler = styler(newContent);
  const elementAnimation = tween({
    from: {
      opacity: 0,
      rotateX: 30,
      scaleY: 0,
      z: -1024,
    },
    to: {
      opacity: 1,
      rotateX: 0,
      scaleY: 1,
      z: 0,
    },
    ease: easing.easeInOut,
    duration: animationSpeed,
  });

  elementAnimation.start(v => elementStyler.set(v));
}


function animateContentOut() {
  const content = document.querySelector('.content');

  return new Promise((resolve) => {
    const elementStyler = styler(content);
    const elementAnimation = tween({
      from: {
        opacity: 1,
        rotateX: 0,
        scaleY: 1,
        z: 0,
      },
      to: {
        opacity: 0,
        rotateX: 30,
        scaleY: 0,
        z: -1024,
      },
      ease: easing.easeInOut,
      duration: animationSpeed,
    });

    elementAnimation.start({
      update: v => elementStyler.set(v),
      complete: () => {
        window.scroll(0, 0);
        resolve();
      },
    });
  });
}

export {
  animateContentIn,
  animateContentOut,
};
