/**
 * Slidesup
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
    slideupVisible: 'is-visible'
  };

 /**
  * Slideup constructor
  *
  * @param {HTMLElement | $} el - The slideup element
  * @param {Object} options - Options passed into the slider initialize function
  */
  function Slideup(el, options) {

    this.name = 'slideup';
    this.namespace = '.'+this.name;

    this.$el = $(el);

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

      this.$el.removeClass(classes.slideupVisible);

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

      this.$el.addClass(classes.slideupVisible);

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
