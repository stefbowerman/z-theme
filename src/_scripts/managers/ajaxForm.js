import $ from 'jquery';
import { getPropByString } from '../core/utils';
import CartAPI from '../core/cartAPI';

const selectors = {
  addForm: 'form[action^="/cart/add"]',
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]'
};

const $window = $(window);
const $body = $(document.body);

class AJAXFormManager {
  constructor() {
    this.name = 'ajaxFormManager';
    this.namespace = `.${this.name}`;
    this.events = {
      ADD_SUCCESS: `addSuccess${this.namespace}`,
      ADD_FAIL: `addFail${this.namespace}`
    };

    this.requestInProgress = false;

    $body.on('submit', selectors.addForm, (e) => {
      e.preventDefault();

      if (this.requestInProgress) return;

      const $submitButton = $(e.target).find(selectors.addToCart);
      const $submitButtonText = $submitButton.find(selectors.addToCartText);

      // Update the submit button text and disable the button so the user knows the form is being submitted
      $submitButton.prop('disabled', true);
      $submitButtonText.html(getPropByString(window, 'theme.strings.adding') || 'Adding');

      CartAPI.addItemFromForm($(e.target))
        .then((data) => {
          // Reset button state
          $submitButton.prop('disabled', false);
          $submitButtonText.html(theme.strings.addToCart);

          const event = $.Event(this.events.ADD_SUCCESS, { cart: data });
          $window.trigger(event);
        })
        .fail((data) => {
          // Reset button state
          $submitButton.prop('disabled', false);
          $submitButtonText.html(theme.strings.addToCart);

          const event = $.Event(this.events.ADD_FAIL, { data });
          $window.trigger(event);
        });
    });
  }
}

export default new AJAXFormManager();
