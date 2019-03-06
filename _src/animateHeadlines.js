import splitter from 'text-split';
import { keyframes, styler } from 'popmotion';

function animateLetters(thisStyler, stagger) {
  const animation = keyframes({
    values: [
      { z: 0, rotateX: 0 },
      { z: 40, rotateX: -40 },
      { z: 0, rotateX: 0 },
      { z: 5, rotateX: -10 },
      { z: 0, rotateX: 0 },
    ],
    duration: 768,
    times: [0, 0.65, 0.75, 0.85, 1],
  });

  setTimeout(() => {
    animation.start(v => thisStyler.set(v));
  }, stagger);
}

export default function () {
  const headlines = document.querySelectorAll('.animated-headline');
  const elementStagger = 48;
  const letterStagger = 24;

  if (headlines) {
    headlines.forEach((headline, headlineIndex) => {
      if (headline) {
        const letters = splitter(headline, {
          delimeter: 'word',
          each: (node) => {
            node.getRootNode().style.marginRight = '8px';
          },
        });
        // const letters = splitter(headline);
        const elementStylers = Array.from(letters).map(styler);
        const preCalc = headlineIndex * elementStagger;

        elementStylers.forEach((thisStyler, i) => {
          const stagger = (i * letterStagger) + preCalc;
          animateLetters(thisStyler, stagger);

          const interval = setInterval(() => {
            try {
              animateLetters(thisStyler, stagger);
            } catch (e) {
              clearInterval(interval);
            }
          }, 15000);
        });
      }
    });
  }
}
