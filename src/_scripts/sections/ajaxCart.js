import BaseSection from './base';
import AJAXCart from '../models/ajaxCart';

const $body = $(document.body);

/**
 * Ajax Cart Section Script
 * ------------------------------------------------------------------------------
 * Exposes methods and events for the interacting with the ajax cart section.
 * All logic is handled in slate.AjaxCart, this file is strictly for handling section settings and them editor interactions
 *
 */
export default class AJAXCartSection extends BaseSection {
  constructor(container) {
    super(container, 'ajaxCart');

    this.ajaxCart = new AJAXCart();

    if (!$body.hasClass('template-cart')) {
      this.ajaxCart.init();
    }
  }

  onUnload() {
    if (this.ajaxCart.$backdrop) {
      this.ajaxCart.$backdrop.remove();
    }
  }
}
