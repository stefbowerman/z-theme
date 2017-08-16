/**
 * Pencil Banner Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the opening and closing of the banner
 *
 * @namespace - pencilBanner
 */

theme.PencilBanner = (function($) {

  var selectors = {
    close: '[data-pencil-banner-close]'
  };

  /**
   * Pencil Banner section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function PencilBanner(container) {
    this.$container = $(container);

    this.namespace = '.pencilBanner';

    this.events = {
      SHOW: 'show'   + this.namespace,
      CLOSE: 'close' + this.namespace
    };

    $(selectors.close).on('click', this.close.bind(this));
  }

  PencilBanner.prototype = $.extend({}, PencilBanner.prototype, {

    /**
     * Allows you to run specific code when viewing this section inside the theme editor for a more pleasant experience
     * To use, call this at the end of the constructor method
     */
    initForThemeEditor: function() {
      var insideThemeEditor = location.href.match(/myshopify.com/) && location.href.match(/theme_id/);
     
      if(insideThemeEditor){
        // Hide the close button to make life simpler
        // $(selectors.close).hide();
      }
    },

    /**
     * Generates a string of integers unique to the text contents of the banner
     * Useful for setting a cookie associated with the banner that invalidates when the contents are changed
     * Reference - https://stackoverflow.com/a/7616484
     *
     * @return {string}
     */
    generateHashCodeForText: function() {
      var str = this.$container.text();
      var hash = 0, i, chr;

      if (str.length === 0) return hash;

      for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash  = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString();
    },

    /**
     * STUB METHOD - You need to add implementation details
     * Call this to show the banner
     */
    show: function() {
      console.log('show' + this.namespace);
      $(window).trigger( $.Event(this.events.SHOW) );
    },

    /**
     * STUB METHOD - You need to add implementation details
     * Call this to close the banner
     */
    close: function() {
      console.log('close' + this.namespace);
      $(window).trigger( $.Event(this.events.CLOSE) );
    },

    onCloseClick: function(e){
      e.preventDefault();
      this.close();
    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      console.log('[PencilBanner] - section:select');
    },

    onShow: function() {
      console.log('[PencilBanner] - section:show');
    },

    onLoad: function() {
      console.log('[PencilBanner] - section::load');
    },

    onUnload: function() {
      console.log('[PencilBanner] - section::unload');
    }
  });

  return PencilBanner;
})(jQuery);
