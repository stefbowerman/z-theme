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

  var $document = $(document);

  var selectors = {
    close: '[data-slideup-close]',
  };

  var classes = {
    slideup: 'slideup',
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
    this.stateIsOpen            = false;
    this.transitionEndEvent     = slate.utils.whichTransitionEnd();    
    this.supportsCssTransitions = Modernizr.hasOwnProperty('csstransitions') && Modernizr.csstransitions;


    if (this.$el == undefined || !this.$el.hasClass(classes.slideup)) {
      console.warn('['+this.name+'] - Element with class `'+classes.slideup+'` required to initialize.');
      return;
    }    

    var defaults = {
      closeSelector: selectors.close
    };

    this.settings = $.extend({}, defaults, options);

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
      this.stateIsOpen = false;
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

      if(this.stateIsOpen) {  
        this.$el.removeClass(classes.visible);

        if(this.supportsCssTransitions) {
          this.$el.one(this.transitionEndEvent, this.onHidden.bind(this));
        }
        else {
          this.onHidden();
        }
      }   
    },

    show: function() {
      var e = $.Event(this.events.SHOW);
      this.$el.trigger(e);

      if(!this.stateIsOpen) {
        this.stateIsOpen = true;

        this.$el.addClass(classes.visible);

        if(this.supportsCssTransitions) {
          this.$el.one(this.transitionEndEvent, this.onShown.bind(this));
        }
        else {
          this.onShown();
        }
      }
    },

    toggle: function() {
      return this.stateIsOpen ? this.hide() : this.show();
    },    

    onCloseClick: function(e) {
      e.preventDefault();
      this.hide();
    }
  });

  // SLIDEUP DATA-API
  // ===============

  $document.on('click.slideup', '[data-toggle="slideup"]', function (e) {

    var $this   = $(this);
    var $target = $($this.attr('data-target'));
    var options = $.extend($target.data(), $this.data());
    var data    = $this.data('slideup');

    if ($this.is('a')) e.preventDefault();

    if(!data) {
      $this.data('slideup', (data = new Slideup($target, options)));
      data.show();
    }
    else {
      data.toggle();
    }

  });   

  return Slideup;
}(jQuery, Modernizr));
