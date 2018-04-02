/**
 * Slideshow
 * ------------------------------------------------------------------------------
 *
 * Requires:
 *  - slick.min.js
 *  - Modernizr
 *
 * @namespace - models.Slideshow
*/

slate.models = slate.models || {};

slate.models.Slideshow = (function($, Modernizr) {

  var selectors = {
    slideshowWrapper: '[data-slideshow-wrapper]',
    slideshow: '[data-slideshow]',
    slide: '[data-slideshow-slide]'
  };

  var KEYS = {
    left: 37,
    right: 39
  };

 /**
  * Slideshow constructor
  *
  * @param {HTMLElement | $} el - The actual slideshow or slideshow wrapper
  * @param {Object} options - Options passed into the slider initialize function
  */
  function Slideshow(el, options) {

    var $el = $(el);

    this.$wrapper   = $el.is(selectors.slideshowWrapper) ? $el : $el.closest(selectors.slideShowWrapper);
    this.$slideshow = this.$wrapper.find(selectors.slideshow);

    var fade = this.$slideshow.attr('data-fade') && this.$slideshow.attr('data-fade').length ? this.$slideshow.data('fade') : true; // Allows us to pass data-fade="false".  $.fn.attr coerces to string, $.fn.data does *not*

    var defaults = {
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

    this.$wrapper.on('click', selectors.pauseToggle, this.onPauseToggleClick.bind(this));    
    this.$slideshow.on('init', this.slideshowA11y.bind(this));
    this.$slideshow.slick(this.settings);

    if(this.settings.equalHeightSlides) {
      this.$slideshow.addClass('has-equal-height-slides');
    }
  }

  Slideshow.prototype = $.extend({}, Slideshow.prototype, {
   /**
    * Adds events to the slideshow for improved accessibility
    *
    * @param {Event} evt - window event w/ type "init"
    * @param {Object} slick
    */
    slideshowA11y: function(evt, slick) {
      var self     = this;
      var $list    = slick.$list;
      var $dots    = slick.$dots;
      var $wrapper = this.$wrapper;
      var autoplay = this.settings.autoplay;

      // Remove default Slick aria-live attr until slider is focused
      $list.removeAttr('aria-live');

      // When an element in the slider is focused
      // pause slideshow and set aria-live.
      $wrapper.on('focusin', function(evt) {
        if (!$wrapper.has(evt.target).length) {
          return;
        }

        $list.attr('aria-live', 'polite');

        if (autoplay) {
          self.pause();
        }
      });

      // Resume autoplay
      $wrapper.on('focusout', function(evt) {
        if (!$wrapper.has(evt.target).length) {
          return;
        }

        $list.removeAttr('aria-live');

        if (autoplay) {
          self.play();
        }
      });

      // Add arrow key support when focused
      if ($dots) {
        $dots.on('keydown', function(evt) {
          if (evt.which === KEYS.left) {
            self.prev();
          }

          if (evt.which === KEYS.right) {
            self.next();
          }

          // Update focus on newly selected tab
          if ((evt.which === KEYS.left) || (evt.which === KEYS.right)) {
            $dots.find('.slick-active button').focus();
          }
        });
      }
    },

    next: function() {
      this.$slideshow.slick('slickNext');
    },

    prev: function() {
      this.$slideshow.slick('slickPrev');
    },

    pause: function() {
      this.$slideshow.slick('slickPause');
    },

    play: function() {
      this.$slideshow.slick('slickPlay');
    },

    unpause: function() {
      if(this.settings.autoplay) {
        this.play();
      }
    },

    togglePause: function() {
      var slick = this.$slideshow.slick('getSlick');

      if(this.settings.autoplay){
        if(slick.paused){
          this.unpause();
        }
        else {
          this.pause();
        }
      }
    },

   /**
    * Finds and displays a slide associated with the blockId passed in.
    * Note:  Block IDs are not required on slides for the slideshow to work
    *        If used, the element matching `selectors.slide` must have a data-block-id attribute
    *
    * @param {string} blockId
    */
    goToSlideByBlockId: function(blockId) {
      var $slide = $(selectors.slide, this.$slideshow).filter('[data-block-id="' + blockId + '"]:not(.slick-cloned)');
      
      this.$slideshow.slick('slickGoTo', $slide.data('slick-index') );
    },

    onPauseToggleClick: function(evt) {
      evt.preventDefault();
      this.togglePause();
    }
  });

  return Slideshow;
}(jQuery, Modernizr));
