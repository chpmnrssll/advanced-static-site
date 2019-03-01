import { easing, styler, tween } from 'popmotion';

export default function () {
  const logos = document.querySelectorAll('.footer__logo-img');

  if (logos) {
    const elementStylers = Array.from(logos).map(styler);

    elementStylers.forEach((thisStyler, index) => {
      thisStyler.set({ y: -(index * 2) });
      tween({
        from: { rotate: -3, x: (Math.random() - 0.5) * 10 },
        to: { rotate: 3, x: (Math.random() - 0.5) * 10 },
        ease: easing.easeInOut,
        flip: Infinity,
        duration: 1000 + Math.random() * 4000,
      }).start(v => thisStyler.set(v));

      const pulseAnimation = tween({
        from: { scale: 1 },
        to: { scale: 1.05 },
        ease: easing.easeInOut,
        flip: 1,
        duration: 500,
      });

      setInterval(() => {
        pulseAnimation.start(v => thisStyler.set(v));
      }, 2000 + Math.random() * 8000);
    });
  }
}
