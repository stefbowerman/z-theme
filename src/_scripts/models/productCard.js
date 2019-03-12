import $ from 'jquery';

const selectors = {
  el: '[data-product-card]',
  gallery: '[data-product-card-gallery]',
  mainLazyImg: '[data-product-card-main-lazy]',
  altLazyImg: '[data-product-card-alt-lazy]'
};

const classes = {
  mainLoaded: 'is-loaded',
  altLoaded: 'alt-loaded' // added to the product card once the alt image is loaded to avoid a flash of white while loading
};

/**
 * Product Card constructor
 *
 * @param {HTMLElement | $} el - The card element
 */
export default class ProductCard {
  constructor(el, options) {
    this.name = 'productCard';
    this.namespace = `.${this.name}`;

    this.$el = $(el);

    if (this.$el === undefined || !this.$el.is(selectors.el)) {
      console.warn(`[${this.name}] - Element matching ${selectors.el} required to initialize.`);
      return;
    }

    this.$mainLazyImg = $(selectors.mainLazyImg, this.$el);
    this.$altLazyImg  = $(selectors.altLazyImg, this.$el);

    // Unveil plugin to lazy load main product card images
    this.$mainLazyImg.unveil(200, function() {
      const $img = $(this);
      $img.on('load', () => {
        $img.parents(selectors.gallery).addClass(classes.mainLoaded);
      });
    });

    if (this.$altLazyImg.length) {
      this.$el.one('mouseenter', this.onMouseenter.bind(this));
    }
  }

  onMouseenter() {
    if (this.$altLazyImg.length === 0) return;

    this.$altLazyImg.on('load', () => {
      this.$el.addClass(classes.altLoaded);
    });

    this.$altLazyImg.attr('src', this.$altLazyImg.data('src'));
    this.$altLazyImg.removeAttr('data-src');
  }

  destroy() {
    this.$el.off('mouseenter', this.onMouseenter);
  }
}
