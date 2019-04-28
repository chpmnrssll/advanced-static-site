import { easing, styler, tween } from 'popmotion';

export default class Navigation {
  constructor() {
    // this.showButton = document.querySelector('.navigation__button--open');
    // this.hideButton = document.querySelector('.navigation__button--close');
    this.hamburgerButton = document.querySelector('.hamburger');
    this.topButton = document.querySelector('.navigation__button--top');
    this.navigation = document.querySelector('.navigation');

    this.toggle = this.toggle.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.showing = false;
    this.touching = false;
    this.currentX = 0;
    this.startX = 0;


    this.hamburgerButton.addEventListener('click', this.toggle);
    this.navigation.addEventListener('click', this.hide);
    this.navigation.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.navigation.addEventListener('touchmove', this.onTouchMove, { passive: true });
    this.navigation.addEventListener('touchend', this.onTouchEnd);
    this.topButton.addEventListener('click', () => {
      const viewportStyler = styler(window);
      const viewportAnimation = tween({
        from: window.scrollY,
        to: 0,
        ease: easing.easeInOut,
        duration: 512,
      });

      viewportAnimation.start({
        update: v => viewportStyler.set('scrollTop', v),
      });
    }, { passive: true });
  }

  onTouchStart(event) {
    if (this.navigation.classList.contains('navigation--showing')) {
      this.startX = event.touches[0].pageX;
      this.currentX = this.startX;
      this.touching = true;
    }
  }

  onTouchMove(event) {
    if (this.touching) {
      this.currentX = event.touches[0].pageX;
    }
  }

  onTouchEnd() {
    if (this.touching) {
      this.touching = false;
      if (Math.min(0, this.currentX - this.startX) < 0) {
        this.hide();
      }
    }
  }

  toggle() {
    if (this.showing) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    this.navigation.classList.remove('navigation--hidden');
    this.navigation.classList.add('navigation--showing');
    this.hamburgerButton.classList.add('is-active');
    this.showing = true;
  }

  hide() {
    this.navigation.classList.remove('navigation--showing');
    this.navigation.classList.add('navigation--hidden');
    this.hamburgerButton.classList.remove('is-active');
    this.showing = false;
  }
}
