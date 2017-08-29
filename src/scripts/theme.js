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
// =require slate/slideshow.js

/*================ Sections ================*/
// =require sections/product.js
// =require sections/collection.js
// =require sections/pencilBanner.js
// =require sections/subscriptionPopup.js
// =require sections/instagramFeed.js
// =require sections/slideshow.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js


$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);
  sections.register('collection', theme.Collection);
  sections.register('pencil-banner', theme.PencilBanner);
  sections.register('subscription-popup', theme.SubscriptionPopup);
  sections.register('instagram-feed', theme.InstagramFeed);
  sections.register('slideshow', theme.Slideshow);

  // slate.AjaxCart.init({});

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Wrap videos in div to force responsive layout.
  slate.rte.wrapTable();
  slate.rte.iframeReset();

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

});
