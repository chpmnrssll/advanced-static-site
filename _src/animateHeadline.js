import { easing, styler, tween } from 'popmotion';
import splitter from 'text-split';

export default function () {
  const headline = document.querySelector('.home__headline');

  if (headline) {
    const letters = splitter(headline);
    const elementStylers = Array.from(letters).map(styler);

    elementStylers.forEach((thisStyler) => {
      const r = Math.random();
      const angle = 3 + (r - 0.5) * 12;

      tween({
        from: { rotate: -angle },
        to: { rotate: angle },
        ease: easing.easeInOut,
        flip: Infinity,
        duration: 1000 + r * 500,
      }).start(v => thisStyler.set(v));
    });
  }
}
