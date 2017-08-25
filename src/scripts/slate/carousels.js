
/**
 * Carousels
 * ------------------------------------------------------------------------------
 *
 * Dependencies
 *  - slick.min.js
 *
 * @namespace - carousel
*/

slate.carousel = (function() {

  var selectors = {
    carouselContainer: '[data-js-carousel-container]',
    carouselSlide: '[data-js-carousel-slide]'
  };

  function carousel() {
    $(selectors.carouselContainer).each(function () {
      var slidesPerPage = $(this).data('js-slides-per-page') || 1;

      $(selectors.carouselContainer).slick({
        adaptiveHeight: true,
        arrows: false,
        dots: true,
        slidesToShow: slidesPerPage,
        slidesToScroll: slidesPerPage
      });
    });
  }

  carousel();
}());
