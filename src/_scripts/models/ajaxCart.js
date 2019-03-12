import $ from 'jquery';
import Handlebars from 'handlebars';
import * as Utils from '../core/utils';
import * as ShopifyAPI from '../core/shopifyAPI';
import * as Currency from '../core/currency';
import * as Image from '../core/image';

const $window = $(window);
const $body = $(document.body);

const selectors = {
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

const classes = {
  bodyCartOpen: 'ajax-cart-open',
  backdrop: 'ajax-cart-backdrop',
  backdropVisible: 'is-visible',
  cartOpen: 'is-open',
  cartBadgeHasItems: 'has-items',
  cartRequestInProgress: 'request-in-progress'
};

export default class AJAXCart {
  constructor() {
    this.name = 'ajaxCart';
    this.namespace = `.${this.name}`;
    this.events = {
      RENDER:  'render'  + this.namespace,
      DESTROY: 'destroy' + this.namespace,
      SCROLL:  'scroll'  + this.namespace,
      UPDATE:  'update'  + this.namespace //  Use this as a global event to hook into whenever the cart changes
    };

    let initialized = false;
    const settings = {
      disableAjaxCart: false,
      backdrop: true
    };

    this.$el                = $(selectors.container);
    this.$backdrop          = null;
    this.stateIsOpen        = null;
    this.transitionEndEvent = Utils.whichTransitionEnd();
    this.requestInProgress  = false;

    /**
     * Initialize the cart
     *
     * @param {object} options - see `settings` variable above
     */
    this.init = (options) => {
      if (initialized) return;

      this.settings = $.extend(settings, options);

      if (!$(selectors.template).length) {
        console.warn('['+this.name+'] - Handlebars template required to initialize');
        return;
      }

      this.$container      = $(selectors.container);
      this.$cartBadge      = $(selectors.cartBadge);
      this.$cartBadgeCount = $(selectors.cartBadgeCount);

      // Compile this once during initialization
      this.template = Handlebars.compile($(selectors.template).html());

      // Add the AJAX part
      if (!this.settings.disableAjaxCart) {
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
      ShopifyAPI.getCart().then(this.buildCart.bind(this));

      initialized = true;
    };
  }

  /**
   * Call this function to AJAX-ify any add to cart forms on the page
   */
  _formOverride() {
    $body.on('submit', selectors.addForm, (e) => {
      e.preventDefault();

      if (this.requestInProgress) return;

      const $submitButton = $(e.target).find(selectors.addToCart);
      const $submitButtonText = $submitButton.find(selectors.addToCartText);

      // Update the submit button text and disable the button so the user knows the form is being submitted
      $submitButton.prop('disabled', true);
      $submitButtonText.html(theme.strings.adding);

      this._onRequestStart();

      ShopifyAPI.addItemFromForm($(e.target))
        .then((data) => {
          this._onRequestFinish();
          // Reset button state
          $submitButton.prop('disabled', false);
          $submitButtonText.html(theme.strings.addToCart);
          this.onItemAddSuccess.call(this, data);
        })
        .fail((data) => {
          this._onRequestFinish();
          // Reset button state
          $submitButton.prop('disabled', false);
          $submitButtonText.html(theme.strings.addToCart);
          this.onItemAddFail.call(this, data);
        });
    });
  }

  /**
   * Ensure we are working with a valid number
   *
   * @param {int|string} qty
   * @return {int} - Integer quantity.  Defaults to 1
   */
  _validateQty(qty) {
    return (parseFloat(qty) === parseInt(qty)) && !Number.isNaN(qty) ? qty : 1;
  }

  /**
   * Ensure we are working with a valid number
   *
   * @param {element} el - cart item row or child element
   * @return {obj}
   */
  _getItemRowAttributes(el) {
    const $el = $(el);
    const $row = $el.is(selectors.item) ? $el : $el.parents(selectors.item);

    return {
      $row: $row,
      id:  $row.data('id'),
      line: ($row.index() + 1),
      qty: this._validateQty($row.data('qty'))
    };
  }

  _onRequestStart() {
    this.requestInProgress = true;
    this.$el.addClass(classes.cartRequestInProgress);
  }

  _onRequestFinish() {
    this.requestInProgress = false;
    this.$el.removeClass(classes.cartRequestInProgress);
  }

  addBackdrop(callback) {
    const cb = callback || $.noop;

    if (this.stateIsOpen) {
      this.$backdrop = $(document.createElement('div'));

      this.$backdrop.addClass(classes.backdrop).appendTo($body);

      this.$backdrop.one(this.transitionEndEvent, cb);
      this.$backdrop.one('click', this.close.bind(this));

      // debug this...
      setTimeout(() => {
        this.$backdrop.addClass(classes.backdropVisible);
      }, 10);
    }
    else {
      cb();
    }
  }

  removeBackdrop(callback) {
    const cb    = callback || $.noop;

    if (!this.stateIsOpen && this.$backdrop) {
      this.$backdrop.one(this.transitionEndEvent, () => {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
        cb();
      });

      setTimeout(() => {
        this.$backdrop.removeClass(classes.backdropVisible);
      }, 10);
    }
    else {
      cb();
    }
  }

  /**
   * Callback when adding an item is successful
   *
   * @param {Object} cart - JSON representation of the cart.
   */
  onItemAddSuccess(cart) {
    this.buildCart(cart);
    this.open();
  }

  /**
   * STUB - Callback when adding an item fails
   *
   * @param {Object} data
   * @param {string} data.message - error message
   */
  onItemAddFail(data) {
    console.warn('['+this.name+'] - onItemAddFail');
    console.warn('['+this.name+'] - ' + data.message);
  }

  /**
   * Callback for when the cart HTML is rendered to the page
   * Allows us to add event handlers for events that don't bubble
   */
  onCartRender(e) {
    // console.log('['+this.name+'] - onCartRender');
  }

  /**
   * Callback for when the cart HTML is removed from the page
   * Allows us to do cleanup on any event handlers applied post-render
   */
  onCartDestroy(e) {
    // console.log('['+this.name+'] - onCartDestroy');
  }

  /**
   * Builds the HTML for the ajax cart.
   * Modifies the JSON cart for consumption by our handlebars template
   *
   * @param {object} cart - JSON representation of the cart.  See https://help.shopify.com/themes/development/getting-started/using-ajax-api#get-cart
   * @return ??
   */
  buildCart(cart) {
    // All AJAX Cart requests finish with rebuilding the cart
    // So this is a good place to add this code
    this._onRequestFinish();

    // Make adjustments to the cart object contents before we pass it off to the handlebars template
    cart.total_price = Currency.formatMoney(cart.total_price, theme.moneyFormat);
    // cart.total_price = Currency.stripZeroCents(cart.total_price);

    cart.items.map((item) => {
      item.image    = Image.getSizedImageUrl(item.image, '200x');
      item.price    = Currency.formatMoney(item.price, theme.moneyFormat);
      // item.price = Currency.stripZeroCents(item.price);

      // Adjust the item's variant options to add "name" and "value" properties
      if (item.hasOwnProperty('product')) {
        const product = item.product;
        for (let i = item.variant_options.length - 1; i >= 0; i--) {
          const name  = product.options[i];
          const value = item.variant_options[i];

          item.variant_options[i] = { name, value };

          // Don't show this info if it's the default variant that Shopify creates
          if (value === 'Default Title') {
            delete item.variant_options[i];
          }
        }
      }
      else {
        delete item.variant_options; // skip it and use the variant title instead
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
    this.$container.empty().append(this.template(cart));
    $window.trigger(this.events.RENDER);
    $window.trigger(this.events.UPDATE);

    this.updateCartCount(cart);
  }

  /**
   * Update the cart badge + count here
   *
   * @param {Object} cart - JSON representation of the cart.
   */
  updateCartCount(cart) {
    this.$cartBadgeCount.html(cart.item_count);

    if (cart.item_count) {
      this.$cartBadge.addClass(classes.cartBadgeHasItems);
    }
    else {
      this.$cartBadge.removeClass(classes.cartBadgeHasItems);
    }
  }

  /**
   * Remove the item from the cart.  Extract this into a separate method if there becomes more ways to delete an item
   *
   * @param {event} e - Click event
   */
  onItemRemoveClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    const attrs = this._getItemRowAttributes(e.target);

    this._onRequestStart();
    ShopifyAPI.changeLineItemQuantity(attrs.line, 0).then(ShopifyAPI.getCart).then(this.buildCart.bind(this));
  }

  /**
   * Increase the quantity of an item by 1
   *
   * @param {event} e - Click event
   */
  onItemIncrementClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    const attrs = this._getItemRowAttributes(e.target);

    this._onRequestStart();
    ShopifyAPI.changeLineItemQuantity(attrs.line, attrs.qty + 1).then(ShopifyAPI.getCart).then(this.buildCart.bind(this));
  }

  /**
   * Decrease the quantity of an item by 1
   *
   * @param {event} e - Click event
   */
  onItemDecrementClick(e) {
    e.preventDefault();

    if (this.requestInProgress) return;

    const attrs = this._getItemRowAttributes(e.target);
    const newQty = (attrs.qty < 1 ? 0 : attrs.qty - 1);

    this._onRequestStart();
    ShopifyAPI.changeLineItemQuantity(attrs.line, newQty).then(ShopifyAPI.getCart).then(this.buildCart.bind(this));
  }

  /**
   * Click the 'ajaxCart - trigger' selector
   *
   * @param {event} e - Click event
   */
  onTriggerClick(e) {
    e.preventDefault();
    this.toggleVisibility();
  }

  /**
   * Click the 'ajaxCart - close' selector
   *
   * @param {event} e - Click event
   */
  onCloseClick(e) {
    e.preventDefault();

    // Do any cleanup before closing the cart
    this.close();
  }

  /**
   * Opens / closes the cart depending on state
   *
   */
  toggleVisibility() {
    return this.stateIsOpen ? this.close() : this.open();
  }

  /**
   * Check the open / closed state of the cart
   *
   * @return {bool}
   */
  isOpen() {
    return this.stateIsOpen;
  }

  /**
   * Returns true is the cart is closed.
   *
   * @return {bool}
   */
  isClosed() {
    return !this.stateIsOpen;
  }

  /**
   * STUB METHOD - Code for opening the cart
   */
  open() {
    if (this.stateIsOpen) return;
    this.stateIsOpen = true;

    if (this.settings.backdrop) {
      $body.addClass(classes.bodyCartOpen);
      this.addBackdrop();
    }

    this.$el.addClass(classes.cartOpen);
  }

  /**
   * STUB METHOD - Code for closing the cart
   */
  close() {
    if (!this.stateIsOpen) return;

    this.stateIsOpen = false;

    this.$el.removeClass(classes.cartOpen);

    if (this.settings.backdrop) {
      this.removeBackdrop(() => {
        $body.removeClass(classes.bodyCartOpen);
      });
    }
  }
}
