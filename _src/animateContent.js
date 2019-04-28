import { easing, styler, tween } from 'popmotion';

const animationSpeed = 256;

export function animateContentIn(newContent) {
  const oldContent = document.querySelector('.content');

  oldContent.parentNode.replaceChild(newContent, oldContent);

  const elementStyler = styler(newContent);
  const elementAnimation = tween({
    from: {
      opacity: 0,
      scaleY: 0,
      z: -128,
    },
    to: {
      opacity: 1,
      scaleY: 1,
      z: 0,
    },
    ease: easing.easeInOut,
    duration: animationSpeed,
  });

  elementAnimation.start(v => elementStyler.set(v));
}

export function animateContentOut() {
  const content = document.querySelector('.content');

  return new Promise((resolve) => {
    const elementStyler = styler(content);
    const elementAnimation = tween({
      from: {
        opacity: 1,
        scaleY: 1,
        z: 0,
      },
      to: {
        opacity: 0,
        scaleY: 0,
        z: -512,
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
