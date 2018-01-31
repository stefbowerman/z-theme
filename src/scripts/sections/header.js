/**
 * Header Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - header
 */

theme.Header = (function($) {

  var $window = $(window);

  var selectors = {

  };

  var classes = {

  };

  function Header(container) {

    this.$container = $(container);

    this.name = 'header';
    this.namespace = '.'+this.name;

  };

  Header.prototype = $.extend({}, Header.prototype, {

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

  return Header;
})(jQuery);
