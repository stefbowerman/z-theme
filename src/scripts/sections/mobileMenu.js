/**
 * Mobile menu Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the mobile menu
 *
 * @namespace - mobileMenu
 */

theme.MobileMenu = (function($) {

  var $window = $(window);
  var $body = $(document.body);

  var selectors = {
    toggle: '[data-mobile-menu-toggle]'
  };

  var classes = {
    isVisible: 'is-visible'
  };

  function MobileMenu(container) {
    this.$container = $(container);

    this.name = 'mobileMenu';
    this.namespace = '.'+this.name;

    $(selectors.toggle).on('click', this.onToggleClick.bind(this));
  }

  MobileMenu.prototype = $.extend({}, MobileMenu.prototype, {

    onToggleClick: function(e) {
      e.preventDefault();
      console.log('['+this.name+'] - toggleMenu');
      this.$container.toggleClass(classes.isVisible);
    },


    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      console.log('['+this.name+'] - section:select');
      console.log('['+this.name+'] - open');
      this.$container.addClass(classes.isVisible);
    },

    onDeselect: function() {
      console.log('['+this.name+'] - section:deselect');
      console.log('['+this.name+'] - close');
      this.$container.removeClass(classes.isVisible);
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

  return MobileMenu;
})(jQuery);
