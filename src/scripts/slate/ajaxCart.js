/**
 * AJAX Cart scripts
 * ------------------------------------------------------------------------------
 *
 * This is a bare-bones but completely usable implementation of an AJAX enabled cart
 * 
 * Usage: slate.AjaxCart.init(options);
 *
 * See the following list of stubbed / incomplete methods that need to be filled in
 *
 *   - AjaxCart.onOpenClick
 *   - AjaxCart.onCloseClick
 *   - AjaxCart.open
 *   - AjaxCart.close
 *   - AjaxCart.onItemAddFail
 *   - AjaxCart.buildCart
 *
 */

(function($, Handlebars, slate){

  if ((typeof ShopifyAPI) === 'undefined') { ShopifyAPI = {}; }

  /*============================================================================
    API Functions
  ==============================================================================*/

 /**
  * AJAX submit an 'add to cart' form
  *
  * @param {jQuery} $form - jQuery instance of the form
  * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
  */
  ShopifyAPI.addItemFromForm = function($form) {
    var promise = $.Deferred();

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/add.js',
      data: $form.serialize(),
      success: function () {
        ShopifyAPI.getCart().then(function (data) {
          promise.resolve(data);
        });
      },
      error: function () {
        promise.reject({
          message: 'The quantity you entered is not available.'
        });
      }
    });

    return promise;
  };

 /**
  * Retrieve a JSON respresentation of the users cart
  *
  * @return {Promise} - JSON cart
  */
  ShopifyAPI.getCart = function() {
    return $.getJSON('/cart.js');
  };

 /**
  * Retrieve a JSON respresentation of the users cart
  *
  * @return {Promise} - JSON cart
  */
  ShopifyAPI.getProduct = function(handle) {
    return $.getJSON('/products/' + handle + '.js');
  };  

 /**
  * Change the quantity of an item in the users cart
  *
  * @param {int} variantId - Variant to be adjust
  * @param {int} qty - New quantity of the variant
  * @return {Promise} - JSON cart
  */
  ShopifyAPI.changeItemQuantity = function(variantId, qty) {
    return $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/cart/change.js',
      data: 'quantity=' + qty + '&id=' + variantId
    });
  };

  /*============================================================================
    Ajax Shopify Add To Cart
  ==============================================================================*/
  slate.AjaxCart = (function() {
    
    var $window = $(window);
    var $body = $('body');

    var selectors = {
      container: '[data-ajax-cart-container]',
      template: 'script[data-ajax-cart-template]',
      trigger: '[data-ajax-cart-trigger]',
      close: '[data-ajax-cart-close]',
      addForm: 'form[action^="/cart/add"]',
      addToCart: '[data-add-to-cart]',
      addToCartText: '[data-add-to-cart-text]',
      header: '[data-ajax-cart-header]',
      body: '[data-ajax-cart-body]',
      footer: '[data-ajax-cart-footer]',
      item: '[data-ajax-item][data-id][data-qty]',
      itemRemove: '[data-ajax-cart-item-remove]',
      itemIncrement: '[data-ajax-cart-item-increment]',
      itemDecrement: '[data-ajax-cart-item-decrement]',
      cartBadge: '[data-cart-badge]',
      cartBadgeCount: '[data-cart-badge-count]'
    };

    var classes = {
      cartOpen: 'is-open',
      cartBadgeHasItems: 'has-items'
    };

   /**
    * AjaxCart constructor
    *
    * Adds an `init` method with access to private variables inside the contructor
    */
    function AjaxCart() {
      this.name = 'ajaxCart';
      this.namespace = '.' + this.name;
      this.events = {
        RENDER:  'render'  + this.namespace,
        DESTROY: 'destroy' + this.namespace,
        SCROLL:  'scroll'  + this.namespace,
        UPDATE:  'update'  + this.namespace //  Use this as a global event to hook into whenever the cart changes
      };

      // Cache products here as we fetch them via ajax so we can make less successive requests
      this.productStore = {};      

      var initialized = false;
      var settings = {
        disableAjaxCart: false
      };

      this.$el         = $(selectors.container);
      this.stateIsOpen = null;

     /**
      * Initialize the cart
      *
      * @param {object} options - see `settings` variable above
      */
      this.init = function(options) {
        if(initialized) return;

        this.settings = $.extend(settings, options);

        if(!$(selectors.template).length){
          console.warn('['+this.name+'] - Handlebars template required to initialize');
          return;
        }

        this.$container      = $(selectors.container);
        this.$cartBadge      = $(selectors.cartBadge);
        this.$cartBadgeCount = $(selectors.cartBadgeCount);        

        // Compile this once during initialization
        this.template = Handlebars.compile($(selectors.template).html());

        // Add the AJAX part
        if(!this.settings.disableAjaxCart) {
          this._formOverride();
        }

        // Add event handlers here
        $body.on('click', selectors.trigger, this.onTriggerClick.bind(this));
        $body.on('click', selectors.close, this.onCloseClick.bind(this));
        $body.on('click', selectors.itemRemove, this.onItemRemoveClick.bind(this));
        $body.on('click', selectors.itemIncrement, this.onItemIncrementClick.bind(this));
        $body.on('click', selectors.itemDecrement, this.onItemDecrementClick.bind(this));
        $window.on(this.events.RENDER, this.onCartRender.bind(this));
        $window.on(this.events.DESTROY, this.onCartDestroy.bind(this));

        // Get the cart data when we initialize the instance
        ShopifyAPI.getCart().then(this._getCartTemplateData.bind(this)).then(this.buildCart.bind(this));

        initialized = true;

        return initialized;
      };

      return this;
    }

    AjaxCart.prototype = $.extend({}, AjaxCart.prototype, {

     /**
      * Call this function to AJAX-ify any add to cart forms on the page
      */
      _formOverride: function() {
        var _this = this;

        $body.on('submit', selectors.addForm, function(e) {
          e.preventDefault();

          var $submitButton = $(e.target).find(selectors.addToCart);
          var $submitButtonText = $submitButton.find(selectors.addToCartText);

          // Update the submit button text and disable the button so the user knows the form is being submitted
          $submitButton.prop('disabled', true);
          $submitButtonText.html(theme.strings.adding);

          ShopifyAPI.addItemFromForm( $(e.target) )
            .then(function(data) {
              // Reset button state
              $submitButton.prop('disabled', false);
              $submitButtonText.html(theme.strings.addToCart);
              _this.onItemAddSuccess.call(_this, data);
            })
            .fail(function(data) {
              // Reset button state
              $submitButton.prop('disabled', false);
              $submitButtonText.html(theme.strings.addToCart);
              _this.onItemAddFail.call(_this, data) ;
            });
        }.bind(this));
      },

     /**
      * Gets data necessary to build the cart HTML.
      * Not only do we need the JSON cart, we need the JSON for all products in the cart too.
      * Check the productStore instance variable first, and then fetch JSON for each product that doesn't exist in the store
      *
      * @param {Object} cart - JSON representation of the cart.
      * @return {$.Deferred} promise
      */
      _getCartTemplateData: function(cart){
        
        var _this = this;
        var promise = $.Deferred();
        var requests = [];
        var templateData = {
          cart: cart,
          products: []
        };

        for (var i = cart.items.length - 1; i >= 0; i--) {
          if(!_this.productStore.hasOwnProperty(cart.items[i].product_id)) {
            requests.push(ShopifyAPI.getProduct(cart.items[i].handle));
          }
        }

        $.when.apply($, requests).then(function(resp){

          var products = arguments;

          // If we make one request, we get returned an array of plain objects
          // If we make more than one request, we get returned an array of arrays (of plain objects)
          // We have an array of arrays
          if($.isArray(arguments[0])){
            products = $.map(arguments, function (arg) { return arg[0]; });
          }

          // Update our product store with any products that don't already exist in there
          if(products && products.length) {
            for (var i = products.length - 1; i >= 0; i--) {
              var p = products[i];
              _this.productStore[p.id] = p;
            }            
          }

          templateData.products = _this.productStore;
          promise.resolve(templateData);
        });

        return promise;
      },      

     /**
      * Ensure we are working with a valid number
      *
      * @param {int|string} qty
      * @return {int} - Integer quantity.  Defaults to 1
      */
      _validateQty: function(qty) {
        return (parseFloat(qty) == parseInt(qty)) && !isNaN(qty) ? qty : 1;
      },

      _getItemRowAttributes: function(el) {
        var $el = $(el);
        var $row = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

        return {
          $row: $row,
          id:  $row.data('id'),
          qty: this._validateQty($row.data('qty'))
        };
      },

     /**
      * Callback when adding an item is successful
      *
      * @param {Object} cart - JSON representation of the cart.
      */
      onItemAddSuccess: function(cart){
        this._getCartTemplateData(cart).then(function(data){
          this.buildCart(data);
          this.open();
        }.bind(this));
      },

     /**
      * STUB - Callback when adding an item fails

      * @param {Object} data
      * @param {string} data.message - error message
      */
      onItemAddFail: function(data){
        console.log('['+this.name+'] - onItemAddFail');
        console.warn('['+this.name+'] - ' + data.message);
      },

      /**
      * Callback for when the cart HTML is rendered to the page
      * Allows us to add event handlers for events that don't bubble
      */
      onCartRender: function(e) {
        console.log('['+this.name+'] - onCartRender');
      },

     /**
      * Callback for when the cart HTML is removed from the page
      * Allows us to do cleanup on any event handlers applied post-render
      */
      onCartDestroy: function(e) {
        console.log('['+this.name+'] - onCartDestroy');
      },

     /**
      * Builds the HTML for the ajax cart.
      * Modifies the JSON cart for consumption by our handlebars template
      *
      * @param {object} cartTemplateData
      * @param {object} cartTemplateData.cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
      * @param {object} cartTemplateData.products - Plain object of product JSON values, keyed with the product ID.
      * @return ??
      */
      buildCart: function(cartTemplateData) {

        var cart     = cartTemplateData.cart;
        var products = cartTemplateData.products;

        // Make adjustments to the cart object contents before we pass it off to the handlebars template
        cart.total_price = slate.Currency.formatMoney(cart.total_price, theme.moneyFormat);
        cart.items.map(function(item){
          item.image    = slate.Image.getSizedImageUrl(item.image, '200x');
          item.price    = slate.Currency.formatMoney(item.price, theme.moneyFormat);

          // Adjust the item's variant options to add "name" and "value" properties
          if(products.hasOwnProperty(item.product_id)) {
            var product = products[item.product_id];
            for (var i = item.variant_options.length - 1; i >= 0; i--) {
              var name  = product.options[i].name;
              var value = item.variant_options[i];

              item.variant_options[i] = {
                name: name,
                value: value
              };

              // Don't show this info if it's the default variant that Shopify creates
              if(value == "Default Title") {
                delete item.variant_options[i];
              }
            }
          }

          return item;
        });

        /**
         *  You can also use this as an intermediate step to constructing the AJAX cart DOM
         *  by returning an HTML string and using another function to do the DOM updating
         *
         *  return this.template(cart)
         *
         *  The code below isn't the most elegant way to update the cart but it works...
         */        

        $window.trigger(this.events.DESTROY);
        this.$container.empty().append( this.template(cart) );
        $window.trigger(this.events.RENDER);
        $window.trigger(this.events.UPDATE);

        this.updateCartCount(cart);
      },

     /**
      * Update the cart badge + count here
      *
      * @param {Object} cart - JSON representation of the cart.
      */
      updateCartCount: function(cart) {

        this.$cartBadgeCount.html(cart.item_count);

        if(cart.item_count) {
          this.$cartBadge.addClass(classes.cartBadgeHasItems);
        }
        else {
          this.$cartBadge.removeClass(classes.cartBadgeHasItems);
        }
      },

     /**
      * Remove the item from the cart.  Extract this into a separate method if there becomes more ways to delete an item
      *
      * @param {event} e - Click event
      */
      onItemRemoveClick: function(e) {
        e.preventDefault();

        var attrs = this._getItemRowAttributes(e.target);
        ShopifyAPI.changeItemQuantity(attrs.id, 0).then(this._getCartTemplateData.bind(this)).then(this.buildCart.bind(this));
      },

     /**
      * Increase the quantity of an item by 1
      *
      * @param {event} e - Click event
      */
      onItemIncrementClick: function(e) {
        e.preventDefault();
        console.log('['+this.name+'] - onItemIncrementClick');

        var attrs = this._getItemRowAttributes(e.target);
        
        ShopifyAPI.changeItemQuantity(attrs.id, attrs.qty + 1).then(this._getCartTemplateData.bind(this)).then(this.buildCart.bind(this));
      },

     /**
      * Decrease the quantity of an item by 1
      *
      * @param {event} e - Click event
      */
      onItemDecrementClick: function(e) {
        e.preventDefault();
        console.log('['+this.name+'] - onItemDecrementClick');

        var attrs = this._getItemRowAttributes(e.target);
        var newQty = (attrs.qty < 1 ? 0 : attrs.qty - 1);

        ShopifyAPI.changeItemQuantity(attrs.id, newQty).then(this._getCartTemplateData.bind(this)).then(this.buildCart.bind(this));
      },

     /**
      * Click the 'ajaxCart - trigger' selector
      *
      * @param {event} e - Click event
      */
      onTriggerClick: function(e) {
        e.preventDefault();
        this.toggleVisibility();
      },

     /**
      * Click the 'ajaxCart - close' selector
      *
      * @param {event} e - Click event
      */
      onCloseClick: function(e) {
        e.preventDefault();
        console.log('['+this.name+'] - onCloseClick');

        // Do any cleanup before closing the cart
        this.close();
      },

     /**
      * Opens / closes the cart depending on state
      *
      */
      toggleVisibility: function() {
        return this.stateIsOpen ? this.close() : this.open();
      },

     /**
      * Check the open / closed state of the cart
      *
      * @return {bool}
      */
      isOpen: function() {
        return this.stateIsOpen;
      },

     /**
      * Returns true is the cart is closed.
      *
      * @return {bool}
      */
      isClosed: function() {
        return !this.stateIsOpen;
      },

     /**
      * STUB METHOD - Code for opening the cart
      */
      open: function() {
        if(this.stateIsOpen) return;
        console.log('['+this.name+'] - open');
        this.stateIsOpen = true;

        this.$el.addClass(classes.cartOpen);
      },

     /**
      * STUB METHOD - Code for closing the cart
      */
      close: function() {
        if(!this.stateIsOpen) return;

        console.log('['+this.name+'] - close');
        this.stateIsOpen = false;

        this.$el.removeClass(classes.cartOpen);
      }
    });

    return AjaxCart;
  })();

})(jQuery, Handlebars, slate);

