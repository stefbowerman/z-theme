import $ from 'jquery';

const selectors = {
  productGallery: '[data-product-gallery]',
  productGallerySlideshow: '[data-product-gallery-slideshow]',
  productGallerySlideLink: '[data-product-gallery-slide-link]',
  productGalleryThumbnails: '[data-product-gallery-thumbnails]',
  productGalleryThumbnailsSlide: '[data-product-gallery-thumbnails-slide]',
  initialSlide: '[data-initial-slide]'
};

const classes = {
  hide: 'hide',
  zoomReady: 'is-zoomable',
  zoomedIn: 'is-zoomed'
};

export default class ProductDetailGalleries {
  /**
   * ProductDetailGalleries constructor
   *
   * @param {Object} config   
   * @param {jQuery} config.$container - Main element, see snippets/product-detail-galleries.liquid
   */
  constructor(config) {
    this.settings = {};
    this.name = 'productDetailGalleries';
    this.namespace = `.${this.name}`;

    // Kind of pointless to have a defaults object like this
    // But doing it to keep consistent with productDetailForm
    const defaults = {
      $container: null
    };

    this.settings = $.extend({}, defaults, config);

    if (!this.settings.$container || this.settings.$container.length === 0) {
      console.warn(`[${this.name}] - config.$container required to initialize`);
      return;
    }

    this.$container = this.settings.$container; // Scoping element for all DOM lookups
    this.$galleries = $(selectors.productGallery, this.$container);

    // Lifecycle methods for handling slideshow changes + hoverzoom initialization
    function initHoverZoom($zoomTarget) {
      const opts = {
        url: $zoomTarget.find(selectors.productGallerySlideLink).attr('href'),
        on: 'click',
        touch: false,
        escToClose: true,
        magnify: 1.2,
        duration: 300,
        callback: () => {
          $zoomTarget.addClass(classes.zoomReady);
        },
        onZoomIn: () => {
          $zoomTarget.addClass(classes.zoomedIn);
        },
        onZoomOut: () => {
          $zoomTarget.removeClass(classes.zoomedIn);
        }
      };

      $zoomTarget.zoom(opts);
    }

    function destroyHoverZoom($zoomTarget) {
      $zoomTarget.trigger('zoom.destroy');
    }

    function onSlideshowSlickBeforeChange(e, slick) {
      const $zoomTarget = $(slick.$slides[slick.currentSlide]);
      destroyHoverZoom($zoomTarget);
    }

    function onSlideshowSlickAfterChange(e, slick) {
      const $zoomTarget = $(slick.$slides[slick.currentSlide]);
      initHoverZoom($zoomTarget);
    }

    function onSlideshowSlickInit(e, slick) {
      const $zoomTarget = $(slick.$slides[slick.currentSlide]);
      initHoverZoom($zoomTarget);
    }

    this.$galleries.each(function() {
      const $gallery    = $(this);
      const $slideshow  = $gallery.find(selectors.productGallerySlideshow);
      const $thumbnails = $gallery.find(selectors.productGalleryThumbnails);

      // Look for element with the initialSlide selector.
      const initialSlide = $gallery.find(selectors.initialSlide).length ? $gallery.find(selectors.initialSlide).index() : 0;

      let thumbnailsSlidesToShow;
      const thumbnailsSlidesCount = $thumbnails.children().length;

      // Slick has trouble when slideToShow === slideCount
      if (thumbnailsSlidesCount < 4) {
        thumbnailsSlidesToShow = Math.max(thumbnailsSlidesCount - 1, 1);
      }
      else {
        thumbnailsSlidesToShow = thumbnailsSlidesCount === 4 ? 3 : 4;
      }

      $slideshow.on({
        init: onSlideshowSlickInit,
        beforeChange: onSlideshowSlickBeforeChange,
        afterChange: onSlideshowSlickAfterChange
      });

      const slideshowOpts = {
        speed: 600,
        dots: false,
        swipe: Modernizr.touchevents,
        arrows: !Modernizr.touchevents,
        prevArrow: '<div class="slick-arrow slick-arrow--prev"><span class="arrow arrow--left"><span class="arrow__icon"></span></span></div>',
        nextArrow: '<div class="slick-arrow slick-arrow--next"><span class="arrow arrow--right"><span class="arrow__icon"></span></span></div>',
        initialSlide: initialSlide,
        accessibility: false,
        draggable: true
      };

      // You can only add this option *if* the thumbnails exist, slick has no graceful fallback
      if ($thumbnails.length) {
        slideshowOpts.asNavFor = `#${$thumbnails.attr('id')}`;
      }

      $slideshow.slick(slideshowOpts);

      if ($thumbnails.length) {
        $thumbnails.on('click', selectors.productGalleryThumbnailsSlide, function() {
          $slideshow.slick('slickGoTo', $(this).data('slick-index'));
        });

        $thumbnails.slick({
          speed: 600,
          slidesToShow: thumbnailsSlidesToShow,
          slidestoScroll: 1,
          arrows: false,
          asNavFor: `#${$slideshow.attr('id')}`,
          initialSlide: initialSlide,
          accessibility: false,
          draggable: false
        });
      }
    });
  }

  getVariantGalleryForOption(option) {
    return this.$galleries.filter(function() {
      return $(this).data('variant-gallery') === option;
    });
  }

  /**
   * Look for a gallery matching one of the selected variant's options and switch to that gallery
   * If a matching gallery doesn't exist, look for the variant's featured image in the main gallery and switch to that
   *
   * @param {Object} variant - Shopify variant object
   */
  updateForVariant(variant) {
    if (variant) {
      if (this.$galleries.length > 1) {
        for (let i = 3; i >= 1; i--) {
          const $variantGallery = this.getVariantGalleryForOption(variant['option' + i]);

          if ($variantGallery.length && $variantGallery.hasClass(classes.hide)) {
            this.$galleries.addClass(classes.hide);
            $variantGallery.removeClass(classes.hide);

            // Slick needs to make a lot of measurements in order to work, calling `refresh` forces this to happen
            $variantGallery.find(selectors.productGallerySlideshow).slick('refresh');
            $variantGallery.find(selectors.productGalleryThumbnails).slick('refresh');
          }
        }
      }
      else {
        // this.$galleries is just a single gallery
        // Slide to featured image for selected variant but only if we're not already on it.
        // Have to check this way because slick clones slides so even if we're currently on it -
        // there can be a cloned slide that also has the correct data-image attribute
        if (variant.featured_image && this.$galleries.find('.slick-current').data('image') !== variant.featured_image.id) { // eslint-disable-line
          const $imageSlide = this.$galleries.find(`[data-image="${variant.featured_image.id}"]`).first();

          if ($imageSlide.length) {
            this.$galleries.find(selectors.productGallerySlideshow).slick('slickGoTo', $imageSlide.data('slick-index'));
          }
        }
      }
    }
    else {
      // No variant - Don't do anything?
    }
  }
}
