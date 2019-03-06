// Core
import * as Image from './core/image';

(($, Modernizr) => {
  const $document = $(document);
  const $body = $(document.body);

  const selectors = {
    productThumbnailImage: '.product-thumbnail__image'
  };

  const classes = {
    checkoutReady: 'checkout-ready'
  };

  // eslint-disable-next-line no-unused-vars
  const steps = {
    CONTACT: 'contact_information',
    SHIPPING: 'shipping_method',
    PAYMENT: 'payment_method',
    PROCESSING: 'processing',
    REVIEW: 'review'
  };

  // eslint-disable-next-line no-unused-vars
  const pages = {
    SHOW: 'show',
    STOCK_PROBLEMS: 'stock_problems',
    PROCESSING: 'processing',
    FORWARD: 'forward',
    THANK_YOU: 'thank_you'
  };

  // eslint-disable-next-line no-unused-vars
  function createSectionHeader(text) {
    return `<div class="section__header">
        <h2 class="section__title">${text}</h2>
      </div>`;
  }

  $document.on('page:load page:change', () => {
    // Replace sidebar images with bigger versions
    $(selectors.productThumbnailImage).each((i, el) => {
      const $img = $(el);
      const $replaceImg = $(document.createElement('img'));
      const ogSrc = $img.attr('src');
      const size = Image.imageSize(ogSrc);

      // For some reason, simply updating the src attribute wasn't working so I'm resorting to creating another image and swapping it in
      if (size) {
        $replaceImg.attr('src', ogSrc.replace(size, 'large'));
        $replaceImg.attr('class', $img.attr('class'));
        $replaceImg.attr('alt', $img.attr('alt'));
        $img.replaceWith($replaceImg);
      }
    });

    $body.addClass(classes.checkoutReady);
  });
})(jQuery, Modernizr);
