/**
 * Product Card Scripts
 * -----------------------------------------------------------------------------
 * Handles any events associated with the product card html (see snippets/product-card.liquid)
 */

slate.productCard = (function() {

  var selectors = {
    el: '[data-product-card]',
    altLazyImg: '[data-product-card-alt-lazy]'
  };

  var classes = {
    altLoaded: 'alt-loaded' // added to the product card once the alt image is loaded to avoid a flash of white while loading
  };

  var $productCard = $(selectors.el);

  if(!$productCard.length) {
    return;
  }
  
  var events = window.PointerEvent ? {
              end:   "pointerup",
              enter: "pointerenter",
              leave: "pointerleave"
            } : {
              end: "touchend",
              enter: "mouseenter",
              leave: "mouseleave"
            };


  $(selectors.el).one(events.enter, onEnter);

  function onEnter(e) {
    var $productCard = $(e.currentTarget);
    var $lazyImg = $productCard.find( selectors.altLazyImg );

    if($lazyImg.length) {
      $lazyImg.on('load', function() {
        $productCard.addClass(classes.altLoaded);
      });
      $lazyImg.attr('src', $lazyImg.data('src'));
      $lazyImg.removeAttr('data-src');
    }
  };

}());