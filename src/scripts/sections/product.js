/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * - Attaches the `Product` constructor to window.theme.Product.
 * - Also defines the ProductImageZoomController class which is consumed exclusively by the Product class.
 *
 * Requires:
 *  - jQuery
 *  - jQuery.fn.zoom - http://www.jacklmoore.com/zoom/
 *  - Slate
 *
 * @namespace product
 */

theme.Product = (function($, slate) {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImageWrapper: '[data-product-featured-image-wrapper]',
    productFeaturedImageLink: '[data-product-featured-image-link]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]'
  };


  /**
   * Used to control the image zoom behavior on the product page.
   *
   * It lazy loads the zoom images whenever it's initialization method is called.
   * The zoom functionality is then added as a callback to this image loading.
   * If you don't really care about this, you could load *all* zoom images upfront (inside the main Product constructor)
   * and then clear out the lazy load code ( see - ProductImageZoomController.initHoverZoom )
   *
   * @constructor
   * @param {Object} options - Configuration
   * @param {bool} options.touch - Enables touch support
   * @param {bool} options.escToClose - When enabled, pressing escape will kill the hover
   * @param {number} options.zoomMagnify - Magnification scale for hover image
   * @param {integer} options.zoomDuration - Duration for zoom in/out effect
   * @param {function} options.onHoverZoomReady
   * @param {function} options.onHoverZoomIn
   * @param {function} options.onHoverZoomOut
   */
  function ProductImageZoomController(options) {
    
    var _this = this;
    var ESC_KEY = 27;
    var zoomReadyClass = 'is-zoomable';
    var zoomedInClass  = 'is-zoomed';
    
    var defaults = {
      touch: false,
      escToClose: true,
      zoomMagnify: 0.8,
      zoomDuration: 150,
      onHoverZoomReady: $.noop,
      onHoverZoomIn: $.noop,
      onHoverZoomOut: $.noop,
    };

    var $zoomTarget = $(selectors.productFeaturedImageWrapper);

    this.settings = $.extend({}, defaults, options || {});
    this.name = 'productImageZoomController';
    this.namespace = '.'+this.name;

    /**
     * Initializer function called only once when creating an instance.
     * Use zoom init / destroy lifecycle events for more control
     *
     * @return {self}
     */
    this.init = function() {

      this.initHoverZoom();

      /**
       *  If you wanted, you could use this area to initalize different zoom behavior depending on the controller settings
       *  For example, implement a different zoom functionality for touch devices
       *
       *  e.g. - this.settings.touch ? this.initTouchZoom() : this.initHoverZoom();
       */

      return this;
    };

    /**
     * Initializes hover zoom based on the instance settings and the zoom image src set in $(selectors.productFeaturedImageLink)
     * This method must be called *every* time the image is changed
     */
    this.initHoverZoom = function() {
      
      // Return early if we're already initialized
      if($zoomTarget.hasClass(zoomReadyClass)) {
        return;
      }

      var loadTest = new Image();
      var zoomSrc = $(selectors.productFeaturedImageLink).attr('href');

      // Callback for initializing hoverzoom once the zoom image has been downloaded and is ready to be displayed
      function callback() {
        $zoomTarget.zoom({
          url: zoomSrc,
          on: 'click',
          magnify: _this.settings.zoomMagnify,
          duration: _this.settings.zoomDuration,
          touch: _this.settings.touch,
          callback: _this.onHoverZoomReady.bind(_this),
          onZoomIn: _this.onHoverZoomIn.bind(_this),
          onZoomOut: _this.onHoverZoomOut.bind(_this)
        });
      };

      // Kill the zoom once you mouseout of the image
      $zoomTarget.on('mouseleave' + this.namespace, _this.hoverZoomOut.bind(_this));

      if(loadTest.addEventListener) {
        loadTest.addEventListener('load', callback);
      }
      else {
        loadTest.attachEvent('onload', callback);
      }

      loadTest.src = zoomSrc;
    };

    /**
     * Clean up any event bindings from initHoverZoom
     */
    this.destroyHoverZoom = function() {
      $zoomTarget.trigger('zoom.destroy');
      $zoomTarget.removeClass(zoomReadyClass);
      $zoomTarget.removeClass(zoomedInClass);
      $zoomTarget.off('mouseleave' + this.namespace);
    };

    /**
     * Call this method after changing image srcs to re-initialize the hover zoom
     */
    this.reInitHoverZoom = function(){
      this.destroyHoverZoom();
      this.initHoverZoom();
    }

    /**
     * Programatically undo the zoom by triggering a click since there is no way in the zoom API to do it
     */
    this.hoverZoomOut = function() {
      if($zoomTarget.hasClass(zoomedInClass)) {
        $zoomTarget.trigger('click');
      }
    }

    /**
     * Callback after hover zoom is done initializing.
     */
    this.onHoverZoomReady = function() {
      $zoomTarget.addClass(zoomReadyClass); // Let the dom know that zoom is enabled
      
      console.log('['+this.name+'] - onHoverZoomReady');
      this.settings.onHoverZoomReady.call(this);
    };

    /**
     * Callback for hover zoom *in*
     */
    this.onHoverZoomIn = function() {
      $zoomTarget.addClass(zoomedInClass);
      
      if(this.settings.escToClose) {
        $(document).on('keyup' + this.namespace, function(e) {
          if(e.keyCode === ESC_KEY) {
            _this.hoverZoomOut.apply(_this);
          }
        });
      }

      console.log('['+this.name+'] - onHoverZoomIn');
      this.settings.onHoverZoomIn.call(this);
    };

    /**
     * Callback for hover zoom *out*
     */
    this.onHoverZoomOut = function() {
      $zoomTarget.removeClass(zoomedInClass);

      if(this.settings.escToClose) {
        $(document).off('keyup' + this.namespace);
      }

      console.log('['+this.name+'] - onHoverZoomOut');
      this.settings.onHoverZoomOut.call(this);
    };

    /**
     * Update the elements used by the zoom library to display a new image.
     *
     * NOTE - This method may actually go beyond the concerns of this module.
     *        It may make more sense to handle all image update logic (elements / srcs / hrefs) 
     *        outside this class and simply call ProductImageZoomController.reInitHoverZoom() when ready.
     *        It all depends on how complex your image updating logic is.
     *
     * @param {string} src - Image displayed as the feature image
     * @param {string} srcZoom - Image used as the zoomed image
     */
    this.changeImage = function(src, srcZoom) {
      this.destroyHoverZoom();
      $(selectors.productFeaturedImage).attr('src', src);
      $(selectors.productFeaturedImageLink).attr('href', srcZoom);
      this.initHoverZoom();
    };

    return this.init();
  }

  /* END ProductImageZoomController class definition */



  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    this.settings = {};
    this.name = 'product';
    this.namespace = '.'+this.name;

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject  = JSON.parse($(selectors.productJson, this.$container).html());
    this.settings.imageSize   = slate.Image.imageSize($(selectors.productFeaturedImage, this.$container).attr('src'));
    this.settings.zoomEnabled = this.$container.data('zoom-enabled'); // $.data coerces to boolean whereas $.attr('data-*') doesn't

    slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

    this.initVariants();

    this.$container.on('click', selectors.productThumbs, this.onProductThumbClick.bind(this));

    if(this.settings.zoomEnabled) {
      this.productImageZoomController = new ProductImageZoomController();
    }
  }

  Product.prototype = $.extend({}, Product.prototype, {

    /**
     * Handles change events from the variant inputs
     */
    initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };

      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
      this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {event} evt
     * @param {object} evt.variant - Shopify variant JSON
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;

      console.group('['+this.name+'] - updateProductImage');
        console.log('evt.variant - ', variant);
      console.groupEnd();
      
      /**
       *  Change the featured product image here - e.g.
       *
       *  var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);
       *  $(selectors.productFeaturedImage, this.$container).attr('src', sizedImgUrl);
       */
    },

    /**
     * Handle thumbnail click event.  Update the gallery to display the selected thumbnail (and whatever else you want)
     *
     * @param {event} evt
     */
    onProductThumbClick: function(evt) {
      evt.preventDefault();

      var $thumb  = $(evt.currentTarget);
      var src     = $thumb.attr('href');
      var zoomSrc = $thumb.data('zoom');
      var index   = $thumb.data('index');

     /**
      *  Do some stuff with this info here
      */
      console.group('['+this.name+'] - onProductThumbClick');
        console.log('$thumb - ', $thumb);
        console.log('index - ', index);
        console.log('src - ', src);
        console.log('zoomSrc - ', zoomSrc);
      console.groupEnd();
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})(jQuery, slate);
