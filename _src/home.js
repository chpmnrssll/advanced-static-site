import page from 'page';
import { easing, styler, tween } from 'popmotion';

page('/', () => {
  const logos = document.querySelectorAll('.home__logo-img');

  if (logos) {
    const elementStylers = Array.from(logos).map(styler);

    elementStylers.forEach((thisStyler) => {
      tween({
        from: { rotate: -3 },
        to: { rotate: 3 },
        ease: easing.easeInOut,
        flip: Infinity,
        duration: (Math.random() + 0.25) * 2000,
      }).start(v => thisStyler.set(v));
    });
  }
});
