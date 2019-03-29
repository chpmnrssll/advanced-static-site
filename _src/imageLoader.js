export default class ImageLoader {
  constructor(options = {
    rootMargin: '0% 0% 0% 0%',
    threshold: 0,
    imageClass: '.image--lazyload',
    imageVisibleClass: 'image--visible',
  }) {
    this.options = options;

    const handler = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.srcset = entry.target.getAttribute('data-srcset') || '';
          entry.target.src = entry.target.getAttribute('data-src') || '';
          entry.target.classList.add(this.options.imageVisibleClass);
          observer.unobserve(entry.target);
        }
      });
    };

    this.observer = new window.IntersectionObserver(handler, this.options);
  }

  lazyLoad() {
    this.images = document.querySelectorAll(this.options.imageClass);
    this.images.forEach(img => this.observer.observe(img));
  }
}
