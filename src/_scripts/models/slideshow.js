const selectors = {
  slideshowWrapper: '[data-slideshow-wrapper]',
  slideshow: '[data-slideshow]'
};

const KEYS = {
  left: 37,
  right: 39
};

export default class Slideshow {
  /**
   * Slideshow constructor
   *
   * @param {HTMLElement | $} el - The actual slideshow element
   * @param {Object} options - Options passed into the slider initialize function
   */  
  constructor(el, options) {
    this.name = 'slideshow';

    const $el = $(el);

    this.$slideshow = $el;
    this.$wrapper   = $el.closest(selectors.slideShowWrapper);

    if (!this.$slideshow.length) {
      console.warn(`[${this.name}] - Slideshow element required to initialize`);
      return;
    }

    const fade = this.$slideshow.attr('data-fade') && this.$slideshow.attr('data-fade').length ?
      this.$slideshow.data('fade') :
      true; // Allows us to pass data-fade="false".  $.fn.attr coerces to string, $.fn.data does *not*

    const defaults = {
      accessibility: false, // prevents page from jumping on focus
      arrows: !Modernizr.touchevents,
      dots: this.$slideshow.data('dots'),
      fade: fade,
      draggable: true,
      touchThreshold: 20,
      slidesToShow: this.$slideshow.data('slides-to-show') || 1,
      slidesToScroll: this.$slideshow.data('slides-to-scroll') || 1,
      autoplay: this.$slideshow.data('autoplay') || false,
      autoplaySpeed: this.$slideshow.data('speed') || 5000,
      prevArrow: '<div class="slick-arrow slick-arrow--prev"><span class="arrow arrow--left"><span class="arrow__icon"></span></span></div>',
      nextArrow: '<div class="slick-arrow slick-arrow--next"><span class="arrow arrow--right"><span class="arrow__icon"></span></span></div>',

      // Options below here are not used in slick
      equalHeightSlides: this.$slideshow.data('equal-heights') || false
    };

    this.settings = $.extend({}, defaults, options);

    // Turn off dots if there's only one slide
    if (this.$slideshow.children().length <= 1) {
      this.settings.dots = false;
    }

    this.$slideshow.on('init', this.slideshowA11y.bind(this));
    this.$slideshow.slick(this.settings);

    if (this.settings.equalHeightSlides) {
      this.$slideshow.addClass('has-equal-height-slides');
    }
  }

  /**
   * Adds events to the slideshow for improved accessibility
   *
   * @param {Event} evt - window event w/ type "init"
   * @param {Object} slick
   */
  slideshowA11y(evt, slick) {
    const self     = this;
    const $list    = slick.$list;
    const $dots    = slick.$dots;
    const $wrapper = this.$wrapper;
    const autoplay = this.settings.autoplay;

    // Remove default Slick aria-live attr until slider is focused
    $list.removeAttr('aria-live');

    // When an element in the slider is focused
    // pause slideshow and set aria-live.
    $wrapper.on('focusin', (e) => {
      if (!$wrapper.has(evt.target).length) {
        return;
      }

      $list.attr('aria-live', 'polite');

      if (autoplay) {
        self.pause();
      }
    });

    // Resume autoplay
    $wrapper.on('focusout', (e) => {
      if (!$wrapper.has(e.target).length) {
        return;
      }

      $list.removeAttr('aria-live');

      if (autoplay) {
        self.play();
      }
    });

    // Add arrow key support when focused
    if ($dots) {
      $dots.on('keydown', (e) => {
        if (e.which === KEYS.left) {
          self.prev();
        }

        if (e.which === KEYS.right) {
          self.next();
        }

        // Update focus on newly selected tab
        if ((e.which === KEYS.left) || (evt.which === KEYS.right)) {
          $dots.find('.slick-active button').focus();
        }
      });
    }
  }

  next() {
    this.$slideshow.slick('slickNext');
  }

  prev() {
    this.$slideshow.slick('slickPrev');
  }

  pause() {
    this.$slideshow.slick('slickPause');
  }

  play() {
    this.$slideshow.slick('slickPlay');
  }

  unpause() {
    if (this.settings.autoplay) {
      this.play();
    }
  }

  goTo(index) {
    this.$slideshow.slick('slickGoTo', index);
  }

  /**
   * Finds and displays a slide associated with the blockId passed in.
   * Note:  Block IDs are not required on slides for the slideshow to work
   *        If used, the slide element must have the attribute - data-block-id="{{ block.id }}"
   *
   * @param {string} blockId
   */
  goToSlideByBlockId(blockId) {
    const slick = this.$slideshow.slick('getSlick');
    const $slide = slick.$slides.filter('[data-block-id="' + blockId + '"]:not(.slick-cloned)');
    
    this.$slideshow.slick('slickGoTo', $slide.data('slick-index'));
  }
}
