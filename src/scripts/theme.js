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
// =require slate/ajaxCart.js

/*================ Sections ================*/
// =require sections/product.js
// =require sections/pencilBanner.js
// =require sections/instagramFeed.js

/*================ Templates ================*/
// =require templates/customers-addresses.js
// =require templates/customers-login.js
// =require templates/filters.js

$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);
  sections.register('pencil-banner', theme.PencilBanner);
  sections.register('instagram-feed', theme.InstagramFeed);

  slate.AjaxCart.init({});

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  var filter_scene, mobile_scene;
  var $filter_el = $('.js-filter-main-container');

  var responsive =  {
    _ww: function () {
      var newW = $(window).width();
      return newW;
    },
    _bp: {
      small: 576
    },
    _bp_check: function () {
      if (this._ww() > this._bp.small) {
        return 'SMALL-UP'
      } else {
        return 'SMALL'
      }
    }
  };

  var filters_setup = {
    windowBindings: function () {
      var self = this;

      $(window).on('resize', function(){
        if (responsive._bp_check() === 'SMALL-UP') {
          if ($filter_el.length > 0) {
            if (filter_scene) {
              filter_scene.destroy(true);  
            }
            self.filters();
          }
        } else if (responsive._bp_check() === 'SMALL') {
          if ($filter_el.length > 0) {
            if (filter_scene) {
              filter_scene.destroy(true);
            }
          }
        }
      })
    }
  }

  // Wrap videos in div to force responsive layout.
  slate.rte.wrapTable();
  slate.rte.iframeReset();

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // initialize bootstrap popovers
  $(function () {
    $('[data-toggle="popover"]').popover()
  })
});
