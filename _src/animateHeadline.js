import splitter from 'text-split';
import { keyframes, styler } from 'popmotion';

function shuffleLetters(thisStyler, stagger) {
  const r = Math.random();
  const angle = (r - 0.5) * 15;
  const animation = keyframes({
    values: [
      { scale: 1 },
      { scale: 1.25 },
      { scale: 1, rotate: angle },
      { scale: 1.1, rotate: angle },
      { scale: 1, rotate: angle },
    ],
    duration: 384,
    times: [0, 0.7, 0.8, 0.9, 1],
  });

  setTimeout(() => {
    animation.start({
      update: v => thisStyler.set(v),
      complete: () => {
        thisStyler.set({ rotate: angle });
      },
    });
  }, stagger);
}

export default function () {
  const headline = document.querySelector('.home__headline');

  if (headline) {
    const letters = splitter(headline);
    const elementStylers = Array.from(letters).map(styler);

    elementStylers.forEach((thisStyler, i) => {
      shuffleLetters(thisStyler, i * 16);

      setInterval(() => {
        shuffleLetters(thisStyler, i * 16);
      }, 15000);
    });
  }
}
