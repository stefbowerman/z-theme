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

    this.slideshow = new slate.Slideshow( $(selectors.slideshowWrapper, this.$container));

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
