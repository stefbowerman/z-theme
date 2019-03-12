// jQuery
import $ from 'jquery';
import 'jquery-zoom';
import 'chosen-js';
import 'jquery-unveil';
import 'slick-carousel';

// Bootstrap JS
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';

// Core
import * as Utils       from './core/utils';
import * as RTE         from './core/rte';
import * as A11Y        from './core/a11y';
import * as Animations  from './core/animations';
import * as Breakpoints from './core/breakpoints';

// UI - Import all to enable data API
import './ui/drawer';
import './ui/overlay';
import './ui/slideup';
import './ui/tabs';
import './ui/quantityAdjuster';

// Sections
import SectionManager             from './sections/sectionManager';
import HeaderSection              from './sections/header';
import FooterSection              from './sections/footer';
import MobileMenuSection          from './sections/mobileMenu';
import ProductSection             from './sections/product';
import CartSection                from './sections/cart';
import AJAXCartSection            from './sections/ajaxCart';
import PencilBannerSection        from './sections/pencilBanner';
import CollectionSection          from './sections/collection';
import BlogSection                from './sections/blog';
import ArticleSection             from './sections/article';
import InstagramFeedSection       from './sections/instagramFeed';
import SubscriptionModalSection   from './sections/subscriptionModal';
import SubscriptionSlideupSection from './sections/subscriptionSlideup';
import SlideshowSection           from './sections/slideshow';
import CustomersLoginSection      from './sections/customersLogin';

// Models
import ProductCard from './models/productCard';
import quickViewManager from './models/quickViewManager';

// Templates
import './templates/pageStyles';
import './templates/pageComponents';

// Do this ASAP
Animations.initialize();
Breakpoints.initialize();

((Modernizr) => {
  const $document = $(document);
  const $body = $(document.body);

  const sectionManager = new SectionManager();

  sectionManager.register('header', HeaderSection);
  sectionManager.register('footer', FooterSection);
  sectionManager.register('mobile-menu', MobileMenuSection);
  sectionManager.register('product', ProductSection);
  sectionManager.register('cart', CartSection);
  sectionManager.register('ajax-cart', AJAXCartSection);
  sectionManager.register('pencil-banner', PencilBannerSection);
  sectionManager.register('collection', CollectionSection);
  sectionManager.register('blog', BlogSection);
  sectionManager.register('article', ArticleSection);
  sectionManager.register('instagram-feed', InstagramFeedSection);
  sectionManager.register('subscription-modal', SubscriptionModalSection);
  sectionManager.register('subscription-slideup', SubscriptionSlideupSection);
  sectionManager.register('slideshow', SlideshowSection);
  sectionManager.register('customers-login', CustomersLoginSection);

  $('.in-page-link').on('click', (evt) => {
    A11Y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Common a11y fixes
  A11Y.pageLinkFocus($(window.location.hash));

  // Target tables to make them scrollable
  RTE.wrapTables({
    $tables: $('.rte table'),
    tableWrapperClass: 'table-responsive'
  });

  // Target iframes to make them responsive
  const iframeSelectors = '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]';

  RTE.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply UA classes to the document
  Utils.userAgentBodyClass();

  // Apply a specific class to the html element for browser support of cookies.
  if (Utils.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

  // Chosen JS plugin for select boxes
  Utils.chosenSelects();

  // Form event handling / validation
  $body.on('change keydown', '.form-control', (e) => {
    $(e.currentTarget).removeClass('is-invalid');
  });

  // START - Global handler for collapse plugin to add state class for open expandable lists
  const isOpenClass = 'is-open';

  $document.on('show.bs.collapse', '.collapse', (e) => {
    $(e.currentTarget).parents('.expandable-list').addClass(isOpenClass);
  });

  $document.on('hide.bs.collapse', '.collapse', (e) => {
    $(e.currentTarget).parents('.expandable-list').removeClass(isOpenClass);
  });

  $('.collapse.show').each(function() {
    $(this).parents('.expandable-list').addClass(isOpenClass);
  });
  // END - Global handler for collapse plugin to add state class for open expandable lists

  // Init any Product Cards on the page
  $('[data-product-card]').each((i, el) => {
    new ProductCard(el);
  });

  // Quickview stuff
  $body.on('click', '[data-quick-view-trigger]', function(e) {
    e.preventDefault();
    quickViewManager.onQuickViewTriggerClick($(this));
  });
})(Modernizr);
