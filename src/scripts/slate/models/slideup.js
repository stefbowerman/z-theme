/**
 * Slideup
 * ------------------------------------------------------------------------------
 *
 * Requires:
 *  - Modernizr
 *
 * @namespace - models.Slideup
*/

slate.models = slate.models || {};

slate.models.Slideup = (function($, Modernizr) {

  var classes = {
    slideup: 'slide-up',
    visible: 'is-visible'
  };

 /**
  * Slideup constructor
  *
  * @param {HTMLElement | $} el - The slideup element
  * @param {Object} options
  */
  function Slideup(el, options) {

    this.name = 'slideup';
    this.namespace = '.'+this.name;

    this.$el = $(el);

    if (!this.$el || this.$el == undefined) {
      console.warn('['+this.name+'] - Element with class `'+classes.slideup+'` required to initialize.');
      return;
    }    

    var defaults = {
      closeSelector: '[data-slideup-close]'
    };

    this.settings = $.extend({}, defaults, options);

    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;

    this.events = {
      HIDE:   'hide'   + this.namespace,
      HIDDEN: 'hidden' + this.namespace,
      SHOW:   'show'   + this.namespace,
      SHOWN:  'shown'  + this.namespace
    };    

    this.$el.on('click', this.settings.closeSelector, this.onCloseClick.bind(this));

  }

  Slideup.prototype = $.extend({}, Slideup.prototype, {
    
    /**
     * Called after the closing animation has run
     */    
    onHidden: function() {
      var e = $.Event(this.events.HIDDEN);
      this.$el.trigger(e);
    },

    /**
     * Called after the opening animation has run
     */
    onShown: function() {
      var e = $.Event(this.events.SHOWN);
      this.$el.trigger(e);
    },

    hide: function() {
      var e = $.Event(this.events.HIDE);
      this.$el.trigger(e);

      this.$el.removeClass(classes.visible);

      if(this.supportsCssTransitions) {
        this.$el.one(slate.utils.whichTransitionEnd(), this.onHidden.bind(this));
      }
      else {
        this.onHidden();
      }      
    },

    show: function() {
      var e = $.Event(this.events.SHOW);
      this.$el.trigger(e);

      this.$el.addClass(classes.visible);

      if(this.supportsCssTransitions) {
        this.$el.one(slate.utils.whichTransitionEnd(), this.onShown.bind(this));
      }
      else {
        this.onShown();
      }
    },

    onCloseClick: function(e) {
      e.preventDefault();
      this.hide();
    }
  });

  return Slideup;
}(jQuery, Modernizr));
