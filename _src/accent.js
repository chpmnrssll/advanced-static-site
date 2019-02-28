import { easing, styler, tween } from 'popmotion';

const accent = document.querySelector('.accent');

if (accent) {
  const elementStyler = styler(accent);
  const elementAnimation = tween({
    from: { scale: 1 },
    to: { scale: 1.25 },
    ease: easing.easeInOut,
    flip: 1,
    duration: 100,
  });

  setInterval(() => {
    elementAnimation.start(v => elementStyler.set(v));
  }, 1000);
}
