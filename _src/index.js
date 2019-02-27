// CSS and SASS files
import './index.scss';
import './routes';
import { easing, styler, tween } from 'popmotion';

const element = document.querySelector('.home__cta');
const elementStyler = styler(element);

if (element) {
  tween({
    from: { rotate: -3 },
    to: { rotate: 3 },
    ease: easing.easeInOut,
    flip: Infinity,
    duration: 1000,
  }).start(v => elementStyler.set(v));
}
