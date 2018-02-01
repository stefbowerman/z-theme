window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js
// =require slate/collectionFilters.js
// =require slate/collectionSort.js
// =require slate/ajaxCart.js
// =require slate/ajaxChimp.js
// =require slate/slideshow.js
// =require slate/animations.js
// =require slate/user.js
// =require slate/breakpoints.js

/*================ Sections ================*/
// =require sections/product.js
// =require sections/collection.js
// =require sections/pencilBanner.js
// =require sections/subscriptionModal.js
// =require sections/instagramFeed.js
// =require sections/slideshow.js
// =require sections/header.js
// =require sections/footer.js
// =require sections/ajaxCart.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js

(function($) {

  var $window       = $(window);
  var $document     = $(document);
  var $body         = $(document.body);

  $(document).ready(function() {
    var sections = new slate.Sections();
    sections.register('product', theme.Product);
    sections.register('collection', theme.Collection);
    sections.register('pencil-banner', theme.PencilBanner);
    sections.register('subscription-modal', theme.SubscriptionModal);
    sections.register('instagram-feed', theme.InstagramFeed);
    sections.register('slideshow', theme.Slideshow);
    sections.register('header', theme.Header);
    sections.register('footer', theme.Footer);
    sections.register('ajax-cart', theme.AjaxCart);    

    $('.in-page-link').on('click', function(evt) {
      slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
    });

    // Common a11y fixes
    slate.a11y.pageLinkFocus($(window.location.hash));    

    // Wrap RTE videos and tables to force responsive layout.
    slate.rte.fixTables();
    slate.rte.iframeReset();

    // Apply UA classes to the document
    slate.utils.userAgentBodyClass();    

    // Apply a specific class to the html element for browser support of cookies.
    if (slate.cart.cookiesEnabled()) {
      document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
    }

  });

}(jQuery));
