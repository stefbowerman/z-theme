/**
 * Slideshow Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - Slideshow
 */

theme.Slideshow = (function($) {

  var selectors = {
    slideshowWrapper: '[data-slideshow-wrapper]',
  };

  var classes = {

  };
  
  /**
   * Slideshow section constructor
   *
   * @param {string} container - selector for the section container DOM element
   */
  function Slideshow(container) {
    this.$container = $(container);

    this.name = 'slideshow';
    this.namespace = '.'+this.name;

    if( !$(selectors.slideshowWrapper, this.$container).length ){
      console.warn('['+this.name+'] - Element matching '+selectors.slideshowWrapper+' required to initialize');
      return;
    }

    var settings = {
      // Put your settings here
    };

    this.slideshow = new slate.models.Slideshow( $(selectors.slideshowWrapper, this.$container), settings);

  }

  Slideshow.prototype = $.extend({}, Slideshow.prototype, {
    /**
     * Theme Editor section events below
     */
    onBlockSelect: function(evt) {
      this.slideshow.goToSlideByBlockId( evt.detail.blockId );
      this.slideshow.pause();
    }
  });

  return Slideshow;
})(jQuery);
