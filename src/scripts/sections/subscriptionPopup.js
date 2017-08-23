/**
 * Subscription Popup Section Script
 * ------------------------------------------------------------------------------
 * 
 * This implementation is incomplete, there are empty methods that need to be wired up and filled in.
 * Details are dependent on:
 *  - Modal / popup library being used
 *  - Mailing list provider (See settings_schema.json)
 *  - 3rd party ajax / validation scripts
 *
 * @namespace - subscriptionPopup
 */

theme.SubscriptionPopup = (function($) {

  var selectors = {
    popup: '.SubscriptionPopup',
    form: '[data-subscription-popup-form]',
    emailInput: '[data-subscription-popup-form] input[type="email"]',
    successMessage: '[data-subscription-popup-success]'
  };

  var insideThemeEditor = location.href.match(/myshopify.com/) && location.href.match(/theme_id/);

  /**
   * Subscription Popup section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function SubscriptionPopup(container) {
    this.$container = $(container);

    this.name = 'subscriptionPopup';
    this.namespace = '.'+this.name;

    this.settings = {
      delay          : 2000, // delay before showing the popup on pageload,
      seenExpiration : parseInt( this.$container.data('seen-expiration') ) || 30 // days before showing the popup again
    };

    /**
     * These are the cookies that we'll use to keep track of how much the user has seen / interacted with the popup
     */
    this.cookies = {
      seen: {
        name: '_subscriptionPopup',
        expires: this.settings.seenExpiration
      },
      emailCollected: {
        name: '_subscriptionPopup_emailCollected',
        expires: 60
      }
    };

    /**
     * Attach event handlers
     *
     * Unsure of exact popup implementation, but add onHidden / onClose events once this is figured out
     */
    $(selectors.form).on('submit', this.onFormSubmit.bind(this));
    // $(selectors.popup).on('shown', this.onShown.bind(this));
    // $(selectors.popup).on('hidden', this.onHidden.bind(this));

    /**
     * Checks the show logic and displays the popup if everything checks out
     */
    if(this.shouldShow()) {
      setTimeout(this.show.bind(this), this.settings.delay);
    }

  }

  SubscriptionPopup.prototype = $.extend({}, SubscriptionPopup.prototype, {

    /**
     * Sets a cookie in the browser
     *
     * @param {Object} cookie - plain object holding cookie properties
     * @param {string} cookie.name
     * @param {int} cookie.expires
     */
    setCookie: function(cookie) {
      var date = new Date();
      date.setTime(+ date + (cookie.expires * 86400000));
      document.cookie = cookie.name + '=true; expires=' + date.toGMTString() + '; path=/';
    },

    /**
     * Checks to see if the browser has the cookie passed in as parameter
     *
     * @param {Object} cookie - plain object holding cookie properties
     * @param {string} cookie.name
     * @param {int} cookie.expires
     */
    hasCookie: function(cookie) {
      return document.cookie.indexOf(cookie.name) !== -1;
    },

    onFormSubmit: function(e) {
      /**
       * STUB METHOD - You need to add implementation details
       */
      e.preventDefault();
      console.log('['+this.name+'] - onFormSubmit');
    },

    show: function() {
      /**
       * STUB METHOD - You need to add implementation details
       */
    },

    shouldShow: function() {
      if(this.hasCookie(this.cookies.seen) || this.hasCookie(this.cookies.emailCollected)) {
        return false
      }
      
      if(insideThemeEditor) {
        return false;
      }

      if(!this.$container.data('enabled')) {
        return false;
      }

      return true;
    },

    onShown: function() {
      // $(selectors.emailInput).focus();
    },

    onHidden: function() {
      if(!insideThemeEditor) {
        this.setCookie(this.cookies.seen);
      }
    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      console.log('['+this.name+'] - section:select');
    },

    onShow: function() {
      console.log('['+this.name+'] - section:show');
    },

    onLoad: function() {
      console.log('['+this.name+'] - section::load');
    },

    onUnload: function() {
      console.log('['+this.name+'] - section::unload');
    }
  });

  return SubscriptionPopup;
})(jQuery);
