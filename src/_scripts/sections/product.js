import BaseSection from './base';
import ProductDetailForm from '../view/product/productDetailForm';

export default class ProductSection extends BaseSection {
  constructor(container) {
    super(container, 'product');

    this.productDetailForm = new ProductDetailForm({
      $el: this.$container,
      $container: this.$container
    });

    this.productDetailForm.initialize();
  }
}
