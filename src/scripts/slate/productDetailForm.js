/**
 * Product Detail Form Script
 * ------------------------------------------------------------------------------
 *
 * Handles all functionality related to contents of snippets/product-detail-form.liquid
 * Core functionality includes:
 *  - Variant selecting + callbacks
 *  - Variant galleries + slideshow initializing
 *
 * Requires:
 *  - jQuery
 *  - Modernizr (for Modernizr.touchevents)
 *  - Slate (for slate.Currency)
 */

// Requires slate for slate.Currency

slate.ProductDetailForm = (function($, Modernizr, slate) {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productZoomButton: '[data-zoom-button]',
    productGallery: '[data-product-gallery]',
    productGallerySlideshow: '[data-product-gallery-slideshow]',
    productGallerySlideLink: '[data-product-gallery-slide-link]',
    productGalleryThumbnail: '[data-product-gallery-thumbnail]',
    productGalleryThumbnailSlide: '[data-product-gallery-thumbnail-slide]',    
    initialSlide: '[data-initial-slide]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    singleOptionSelector: '[data-single-option-selector]',
    variantOptionValueList: '[data-variant-option-value-list]',
    variantOptionValue: '[data-variant-option-value]',
    quantitySelect: '[data-product-quantity-select]',
    fullDetailsLink: '[data-full-details-link]'
  };


  var classes = {
    hide: 'hide',
    variantOptionValueActive: 'is-active',
    zoomReady: 'is-zoomable',
    zoomedIn: 'is-zoomed'
  };

  var $window   = $(window);

  /**
   * ProductDetailForm constructor
   *
   * @param { Object } config
   * @param { jQuery } config.$el - Main element, see snippets/product-detail-form.liquid
   * @param { jQuery } config.$container - Container to listen to scope events / element to listen to events on.  Defaults to config.$el
   * @param { Boolean } config.enableZoom - Toggle zoom capabilities on / off
   * @param { Boolean } config.enableHistoryState - If set to "true", turns on URL updating when switching variants
   * @param { Function } config.onReady -  Called after the product form is initialized.
   */
  function ProductDetailForm(config) {

    this.settings = {};
    this.name = 'productDetailForm';
    this.namespace = '.'+this.name;

    this.events = {
      RESIZE: 'resize' + this.namespace,
      CLICK:  'click'  + this.namespace,
      READY:  'ready'  + this.namespace
    };
    
    var ready = false;
    var options = options || {};
    var defaults = {
      enableZoom: true,
      enableHistoryState: true
    };

    this.initialize = function() {
      if(ready) {
        return;
      }

      this.settings = $.extend({}, defaults, config);

      if (!this.settings.$el || this.settings.$el == undefined) {
        console.warn('['+this.name+'] - $el required to initialize');
        return;
      }

      this.$el = this.settings.$el;
      this.$container = this.settings.$container;

      if (!this.$container || this.$container == undefined) {
        this.$container = this.$el;
      }

      this.productSingleObject  = JSON.parse($(selectors.productJson, this.$container).html());

      slate.utils.chosenSelects(this.$container);

      var variantOptions = {
        $container: this.$container,
        enableHistoryState: this.settings.enableHistoryState,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.QUANTITY_SELECT_LIMIT = this.$container.find(selectors.quantitySelect).first().data('max') || 4;

      this.variants = new slate.Variants(variantOptions);

      // See slate.Variants
      this.$container.on('variantChange' + this.namespace, this.onVariantChange.bind(this));

      this.initGalleries();

      this.$container.on(this.events.CLICK, selectors.variantOptionValue, this.onVariantOptionValueClick.bind(this));

      var e = $.Event(this.events.READY);
      this.$el.trigger(e);

      ready = true;
    };

    return this;
  };

  ProductDetailForm.prototype = $.extend({}, ProductDetailForm.prototype, {

    initGalleries: function() {
      var self = this;
      var $galleries = $(selectors.productGallery, this.$container);

      // Lifecycle methods for handling slideshow changes + hoverzoom initialization
      function initHoverZoom($zoomTarget) {
        var opts = {
          url: $zoomTarget.find(selectors.productGallerySlideLink).attr('href'),
          on: 'click',
          touch: false,
          escToClose: true,
          zoomMagnify: 0.8,
          zoomDuration: 300,
          callback: function() {
            $zoomTarget.addClass(classes.zoomReady);
          },
          onZoomIn: function() {
            $zoomTarget.addClass(classes.zoomedIn);
          },
          onZoomOut: function() {
            $zoomTarget.removeClass(classes.zoomedIn);
          }
        };

        $zoomTarget.zoom(opts);

        $zoomTarget.find(selectors.productZoomButton).on('click', function(e){
          $zoomTarget.trigger('click');
          return false;
        });

      }

      function destroyHoverZoom($zoomTarget) {
        $zoomTarget.trigger('zoom.destroy');
        $zoomTarget.find(selectors.productZoomButton).off('click');
      }

      function onSlideshowSlickBeforeChange(e, slick) {
        var $zoomTarget = $(slick.$slides[ slick.currentSlide ]);
        if(self.settings.enableZoom) {
          destroyHoverZoom($zoomTarget);
        }
      }

      function onSlideshowSlickAfterChange(e, slick) {
        var $zoomTarget = $(slick.$slides[ slick.currentSlide ]);
        if(self.settings.enableZoom) {
          initHoverZoom($zoomTarget);
        }
      }

      function onSlideshowSlickInit(e, slick) {
        var $zoomTarget = $(slick.$slides[ slick.currentSlide ]);
        if(self.settings.enableZoom) {
          initHoverZoom($zoomTarget);
        }
      }

      $galleries.each(function() {
        var $slideshow  = $(this).find(selectors.productGallerySlideshow);
        var $thumbnail = $(this).find(selectors.productGalleryThumbnail);

        // Look for element with the initialSlide selector.
        var initialSlide = $(this).find(selectors.initialSlide).length ? $(this).find(selectors.initialSlide).index() : 0;

        $slideshow.on({
          init: onSlideshowSlickInit,
          beforeChange: onSlideshowSlickBeforeChange,
          afterChange: onSlideshowSlickAfterChange
        });

        $slideshow.slick({
          speed: 600,
          dots: false,
          swipe: Modernizr.touchevents,
          arrows: !Modernizr.touchevents,
          asNavFor: '#' + $thumbnail.attr('id'),
          prevArrow: '<div class="product-gallery__arrow-wrapper product-gallery__arrow-wrapper--left"><a class="arrow arrow--transparent arrow--left"><span class="arrow__icon"><~</span></a></div>',
          nextArrow: '<div class="product-gallery__arrow-wrapper product-gallery__arrow-wrapper--right"><a class="arrow arrow--transparent"><span class="arrow__icon">~></span></a></div>',
          initialSlide: initialSlide,
          accessibility: false,
          draggable: true
        });

        $thumbnail.on('click', selectors.productGalleryThumbnailSlide, function() {
          $slideshow.slick('slickGoTo', $(this).data('slick-index'));
        });

        $thumbnail.slick({
          speed: 600,
          slidesToShow: $thumbnail.find(selectors.productGalleryThumbnailSlide).length == 4 ? 3 : 4, // Slick has trouble when slidesToShow = slide number
          slidestoScroll: 1,
          arrows: false,
          asNavFor: '#' + $slideshow.attr('id'),
          initialSlide: initialSlide,
          accessibility: false,
          draggable: false
        });        
      });

      // Because slick can get weird on initialization, make sure we call `refresh` on any visible galleries
      $galleries.not('.hide').each(function() {
        var $variantGallery = $(this);
        $variantGallery.find(selectors.productGallerySlideshow).slick('getSlick').refresh();
        $variantGallery.find(selectors.productGalleryThumbnail).slick('getSlick').refresh();
      });
    },

    /**
     * Slick sliders are annoying and sometimes need an ass kicking
     *
     */
    resizeGalleries: function() {
      $('.slick-slider', this.$container).resize();
    },

    onVariantChange: function(evt) {
      var variant = evt.variant;

      this.updateProductPrices(variant);
      this.updateAddToCartState(variant);
      this.updateQuantityDropdown(variant);
      this.updateVariantOptionValues(variant);
      this.updateFullDetailsLink(variant);
      this.updateGalleries(variant);

      $(selectors.singleOptionSelector, this.$container).trigger('chosen:updated');
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {Object} variant - Shopify variant object
     */
    updateAddToCartState: function(variant) {

      var $addToCartBtn     = $(selectors.addToCart, this.$container);
      var $addToCartBtnText = $(selectors.addToCartText, this.$container);
      var $priceWrapper     = $(selectors.priceWrapper, this.$container);

      if (variant) {
        $priceWrapper.removeClass(classes.hide);
      } else {
        $addToCartBtn.prop('disabled', true);
        $addToCartBtnText.html(theme.strings.unavailable);
        $priceWrapper.addClass(classes.hide);
        return;
      }

      if (variant.available) {
        $addToCartBtn.prop('disabled', false);
        $addToCartBtnText.html(theme.strings.addToCart);
      } else {
        $addToCartBtn.prop('disabled', true);
        $addToCartBtnText.html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the quantity select dropdown based on the available quantity and inventory management setting of the selected variant
     *
     * @param {Object} variant - Shopify variant object
     */
    updateQuantityDropdown: function(variant) {

      var $select = $(selectors.quantitySelect, this.$container);

      // Close the dropdown while we make changes to it
      $select.trigger('chosen:close');

      if(variant && variant.inventory_management && variant.inventory_policy == "deny") {
        if(variant.inventory_quantity > 0) {
          $select.prop('disabled', false);
          
          // Update the select box to max out at the limit if less than 5?
          var limit = (variant.inventory_quantity > this.QUANTITY_SELECT_LIMIT ? this.QUANTITY_SELECT_LIMIT : variant.inventory_quantity);
          
          $select.empty();

          for (var i = 1; i <= limit; i++) {
            
            var option = document.createElement('option');
                option.value = i;
                option.text  = i;

            $select.append(option);
          }
        }
        else {
          $select.prop('disabled', true);
        }
      }
      else {
        $select.prop('disabled', false);
      }

      $select.trigger('chosen:updated');
      
    },    

    /**
     * Updates the DOM with specified prices
     *
     * @param {Object} variant - Shopify variant object
     */
    updateProductPrices: function(variant) {
      var $productPrice = $(selectors.productPrice, this.$container);
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls   = $comparePrice.add( $(selectors.comparePriceText, this.$container) );

      if(variant) {
        $productPrice.html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

        // look for recharge stuff
        // if recharge form -> look for selected radio on current variant

        if (variant.compare_at_price > variant.price) {
          $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
          $compareEls.removeClass(classes.hide);
        } else {
          $comparePrice.html('');
          $compareEls.addClass(classes.hide);
        }
      }
    },

    /**
     * Updates the DOM state of the elements matching the variantOption Value selector based on the currently selected variant
     *
     * @param {Object} variant - Shopify variant object
     */
    updateVariantOptionValues: function(variant) {
      if(variant) {
        // Loop through all the options and update the option value
        for (var i = 3; i >= 1; i--) {
          var variantOptionValue = variant['option' + i];
          var $variantOptionValueUI = $('[data-variant-option-value="'+variantOptionValue+'"]', this.$container);

          $variantOptionValueUI.addClass( classes.variantOptionValueActive );
          $variantOptionValueUI.siblings().removeClass( classes.variantOptionValueActive );
        }
      }
    },

    /**
     * Used on quick view, updates the "view full details" link to point to the currently selected variant
     *
     * @param {Object} variant - Shopify variant object
     */
    updateFullDetailsLink: function(variant) {
      var $fullDetailsLink = $(selectors.fullDetailsLink, this.$container);
      var updatedUrl;

      if(variant && $fullDetailsLink.length) {
        updatedUrl = slate.utils.getUrlWithUpdatedQueryStringParameter('variant', variant.id, $fullDetailsLink.attr('href'));
        $fullDetailsLink.attr('href', updatedUrl);
      }
    },

    /**
     * Look for a gallery matching one of the selected variant's options and switch to that gallery
     * If a matching gallery doesn't exist, look for the variant's featured image in the main gallery and switch to that
     *
     * @param {Object} variant - Shopify variant object
     */
    updateGalleries: function(variant) {

      var $galleries = $(selectors.productGallery, this.$container);

      if (variant) {
        if ($galleries.length > 1) {
          for (var i = 3; i >= 1; i--) {
            var option = variant['option' + i];
            var $variantGallery = $galleries.filter(function() {
              return $(this).data('variant-gallery') == option;
            });

            if ($variantGallery.length && $variantGallery.hasClass(classes.hide)) {
              $galleries.not($variantGallery).addClass(classes.hide);
              $variantGallery.removeClass(classes.hide);
              // Slick needs to make a lot of measurements in order to work, calling `refresh` forces this to happen
              $variantGallery.find(selectors.productGallerySlideshow).slick('getSlick').refresh();
              $variantGallery.find(selectors.productGalleryThumbnail).slick('getSlick').refresh();
            }
          }
        }
        else {
          // $galleries is just a single gallery
          // Slide to featured image for selected variant
          if (variant.featured_image) {
            var $imageSlide = $galleries.find('[data-image="'+variant.featured_image.id+'"]').first();

            if ($imageSlide.length) {
              $galleries.find(selectors.productGallerySlideshow).slick('slickGoTo', $imageSlide.data('slick-index'));
            }
          }
        }
      }
      else {
        // No variant - Don't do anything?
      }
    },

    /**
     * Handle variant option value click event.
     * Update the associated select tag and update the UI for this value
     *
     * @param {event} evt
     */
    onVariantOptionValueClick: function(e) {

      var $option = $(e.currentTarget);

      if ($option.hasClass(classes.variantOptionValueActive)) {
        return;
      }

      var value     = $option.data('variant-option-value');
      var position  = $option.parents(selectors.variantOptionValueList).data('option-position');
      var $selector = $(selectors.singleOptionSelector, this.$container).filter('[data-index="option'+position+'"]');

      $selector.val(value);
      $selector.trigger('change');

      $option.addClass(classes.variantOptionValueActive);
      $option.siblings().removeClass( classes.variantOptionValueActive );      

    }
  });

  return ProductDetailForm;

})(jQuery, Modernizr, slate)