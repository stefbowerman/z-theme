/**
 * Carousel
 * ------------------------------------------------------------------------------
 *
 * This is a barebones implementation of Slick carousel.
 *
 * Usage:
 *
 * See the following list of stubbed / incomplete methods that need to be filled in
 *
 *   - AjaxCart.onOpenClick
 *
 */

slate.carousels = (function () {
  var selectors = {
    carouselContainer: '[data-js-carousel-container]',
    hideOnCarousel: '[data-js-carousel-hide]',
    carouselSlide: '[data-js-carousel-slide]',
    // The real carousel container
    actualCarousel: '.js-carousel-container'
  };

  var hideClass = 'hidden';

  var DESKTOP_MIN = 992;

  function shouldMakeCarousel () {
    var width = $(window).width();

    if (width < DESKTOP_MIN) {
      return true;
    }

    return false;
  }

  function makeCarousel () {
    $(selectors.carouselContainer).each(function () {
      var actualCarousel = $(this).find(selectors.actualCarousel), slidesPerPage;

      if (actualCarousel.length === 0) {
        // I have to init the carousel
        actualCarousel = $(this).append('<div class="js-carousel-container"></div>').find(selectors.actualCarousel);

        actualCarousel.append($(this).find(selectors.carouselSlide));

        slidesPerPage = $(this).data('js-slides-per-page') || 1;

        actualCarousel.slick({
          adaptiveHeight: true,
          arrows: false,
          dots: true,
          slidesToShow: slidesPerPage,
          slidesToScroll: slidesPerPage
        });
      }
    });

    $(selectors.actualCarousel).removeClass(hideClass);
    $(selectors.hideOnCarousel).addClass(hideClass);
  }

  function showDefaultContainer () {
    $(selectors.actualCarousel).addClass(hideClass);
    $(selectors.hideOnCarousel).removeClass(hideClass);
  }

  function doCarousels () {
    if (shouldMakeCarousel()) {
      makeCarousel();
    } else {
      showDefaultContainer();
    }
  }

  $(window).on('resize', doCarousels);

  doCarousels();
}());
