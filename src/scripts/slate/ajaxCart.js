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
      data: 'quantity=' + qty + '&id=' + variantId,
      dataType: 'json'
    });
  };

  /*============================================================================
    Ajax Shopify Add To Cart
  ==============================================================================*/
  slate.AjaxCart = (function() {

    var $body = $('body');

    var selectors = {
      container: '[data-ajax-cart-container]',
      template: 'script[data-ajax-cart-template]',
      open: '[data-ajax-cart-open]',
      close: '[data-ajax-cart-close]',
      addForm: 'form[action^="/cart/add"]',
      item: '[data-ajax-item][data-id][data-qty]',
      itemRemove: '[data-ajax-cart-item-remove]',
      itemQuantity: 'input[data-ajax-cart-item-quantity]',
      itemIncrement: '[data-ajax-cart-item-increment]',
      itemDecrement: '[data-ajax-cart-item-decrement]'
    };

   /**
    * AjaxCart constructor
    *
    * Adds an `init` method with access to private variables inside the contructor
    */
    function AjaxCart() {
      this.name = 'ajaxCart'
      this.namespace = '.' + this.name;

      var initialized = false;
      var settings = {
        disableAjaxCart: false,
        emptyMessage: 'Your Cart is Empty'
      };


     /**
      * Call this from the main theme.js file to initialize the ajaxCart
      *
      * @param {object} options - see `settings` variable above
      */
      this.init = function(options) {
        if(initialized) return;

        this.settings = $.extend(settings, options);

        if(!$(selectors.template).length){
          console.warn('['+this.name+'] - Handlebars template required to initialize AjaxCart');
          return;
        }

        // Compile this once during initialization
        this.template = Handlebars.compile($(selectors.template).html());

        // Add the AJAX part
        if(!this.settings.disableAjaxCart && $(selectors.addForm).length) {
          this._formOverride();
        }

        // Add event handlers here
        $body.on('click', selectors.open, this.onOpenClick.bind(this));
        $body.on('click', selectors.close, this.onCloseClick.bind(this));
        $body.on('click', selectors.itemRemove, this.onItemRemoveClick.bind(this));
        $body.on('click', selectors.itemIncrement, this.onItemIncrementClick.bind(this));
        $body.on('click', selectors.itemDecrement, this.onItemDecrementClick.bind(this));
        $body.on('change', selectors.itemQuantity, this.onItemQuantityInputChange.bind(this));

        // Get the cart data when we initialize the instance
        ShopifyAPI.getCart().then(this.buildCart.bind(this));

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
        $body.on('submit', selectors.addForm, function(e) {
          e.preventDefault();

          ShopifyAPI.addItemFromForm( $(e.target) )
            .then( this.onItemAddSuccess.bind(this) )
            .fail( this.onItemAddFail.bind(this) );
        }.bind(this));
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
        var $line = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

        return {
          id:  $line.data('id'),
          qty: this._validateQty($line.data('qty'))
        };
      },

     /**
      * Callback when adding an item is successful
      *
      * @param {Object} cart - JSON representation of the cart.
      */
      onItemAddSuccess: function(cart){
        this.buildCart(cart);
        this.open();
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
      * Builds the HTML for the ajax cart.
      *
      * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
      * @return ??
      */
      buildCart: function(cart) {
        // Make adjustments to the cart object contents before we pass it off to the handlebars template
        cart.total_price = slate.Currency.formatMoney(cart.total_price, theme.moneyFormat);
        cart.emptyMessage = this.settings.emptyMessage
        cart.items.map(function(item){
          item.image = slate.Image.getSizedImageUrl(item.image, '200x');
          item.price = slate.Currency.formatMoney(item.price, theme.moneyFormat);
          return item;
        });

        /**
         *  You can also use this as an intermediate step to constructing the AJAX cart DOM
         *  by returning an HTML string and using another function to do the DOM updating
         *
         *  return this.template(cart)
         *
         *  The code below isn't the most elegent way to update the cart but it works...
         */

         $(selectors.container).empty().append( this.template(cart) );
      },

     /**
      * Remove the item from the cart.  Extract this into a separate method if there becomes more ways to delete an item
      *
      * @param {event} e - Click event
      */
      onItemRemoveClick: function(e) {
        e.preventDefault();
        console.log('['+this.name+'] - onItemRemoveClick');

        var id = $(e.target).parents(selectors.item).attr('data-id');
        ShopifyAPI.changeItemQuantity(id, 0).then(this.buildCart.bind(this));
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
        
        ShopifyAPI.changeItemQuantity(attrs.id, attrs.qty + 1).then(this.buildCart.bind(this));
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
        var newQty = (attrs.qty <= 1 ? 1 : attrs.qty - 1);

        ShopifyAPI.changeItemQuantity(attrs.id, newQty).then(this.buildCart.bind(this));
      },

     /**
      * Callback for changing the quantity of an item in the cart
      *
      * @param {event} e - Input change event
      */
      onItemQuantityInputChange: function(e) {
        var attrs = this._getItemRowAttributes(e.target);
        var qty = this._validateQty( $input.val() );

        ShopifyAPI.changeItemQuantity(attrs.id, qty).then(this.buildCart.bind(this));
      },

     /**
      * STUB METHOD - Click the 'ajaxCart - open' selector
      *
      * @param {event} e - Click event
      */
      onOpenClick: function(e) {
        e.preventDefault();
        console.log('['+this.name+'] - onOpenClick');
      },

     /**
      * STUB METHOD - Click the 'ajaxCart - close' selector
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
      * STUB METHOD - Code for opening the cart
      */
      open: function() {
        console.log('['+this.name+'] - open');
        $(selectors.container).show();
      },

     /**
      * STUB METHOD - Code for closing the cart
      */
      close: function() {
        console.log('['+this.name+'] - close');
        $(selectors.container).hide();
      }
    });

    return new AjaxCart();
  })();

})(jQuery, Handlebars, slate);

