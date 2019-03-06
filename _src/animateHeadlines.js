import splitter from 'text-split';
import { keyframes, styler } from 'popmotion';

function shuffleLetters(thisStyler, stagger) {
  const r = Math.random();
  const angle = (r - 0.5) * 15;
  const animation = keyframes({
    values: [
      { z: 0, rotateX: 0 },
      { z: 50, rotateX: -15 },
      { z: 0, rotateX: 0, rotate: angle * 0.25 },
      { z: 10, rotateX: -5, rotate: angle * 0.5 },
      { z: 0, rotateX: 0, rotate: angle },
    ],
    duration: 768,
    times: [0, 0.65, 0.75, 0.85, 1],
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
  const headlines = document.querySelectorAll('.animated-headline');

  if (headlines) {
    headlines.forEach((headline) => {
      if (headline) {
        const letters = splitter(headline);
        const elementStylers = Array.from(letters).map(styler);

        elementStylers.forEach((thisStyler, i) => {
          shuffleLetters(thisStyler, i * 12);

          const interval = setInterval(() => {
            try {
              shuffleLetters(thisStyler, i * 12);
            } catch (e) {
              clearInterval(interval);
            }
          }, 15000);
        });
      }
    });
  }
}
