// CSS and SASS files
import './index.scss';
import { easing, styler, tween } from 'popmotion';

const element = document.querySelector('.home__cta');
const elementStyler = styler(element);

tween({
  from: { rotate: -5 },
  to: { rotate: 5 },
  ease: easing.easeInOut,
  flip: Infinity,
  duration: 1500,
}).start(v => elementStyler.set(v));
