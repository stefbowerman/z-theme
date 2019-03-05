import BaseSection from './base';
import User from '../core/user';
import * as Utils from '../core/utils';

const selectors = {
  modal: '[data-subscription-modal]',
  form: '[data-subscription-modal-form]',
  emailInput: '[data-subscription-modal-form] input[type="email"]',
  successMessage: '[data-subscription-modal-success]'
};

/**
 * Subscription Modal Section Script
 * ------------------------------------------------------------------------------
 *
 * Details are dependent on:
 *  - Mailing list provider (See settings_schema.json)
 *  - 3rd party ajax / validation scripts
 *
 * @namespace - subscriptionModal
 */
export default class SubscriptionModalSection extends BaseSection {
  constructor(container) {
    super(container, 'subscriptionModal');

    this.settings = {
      enabled: this.$container.data('enabled'),
      // delay before showing the modal on pageload
      delay: !Number.isNaN(parseInt(this.$container.data('delay'))) ? (parseInt(this.$container.data('delay'))*1000) : 3000,
      // days before showing the modal again
      seenExpiration: !Number.isNaN(parseInt(this.$container.data('seen-expiration'))) ? parseInt(this.$container.data('seen-expiration')) : 30
    };

    // if seenExpiration is set to 0, set it to 1 year (very far into the future)
    if (this.settings.seenExpiration === 0) {
      this.settings.seenExpiration = 365;
    }

    // DOM elements we'll need
    this.$modal          = $(selectors.modal, this.$container);
    this.$form           = $(selectors.form, this.$container);
    this.$successMessage = $(selectors.successMessage, this.$container);

    /**
     * These are the cookies that we'll use to keep track of how much the user has seen / interacted with the popup
     */
    this.cookies = {};

    this.cookies.seen = User.generateCookie('subscriptionModalSeen');
    this.cookies.seen.value = Utils.hashFromString(this.$modal.text()).toString(); // Set the cookie value based on the content
    this.cookies.seen.expiration = this.settings.seenExpiration;

    this.cookies.emailCollected = User.generateCookie('emailCollected');
    this.cookies.emailCollected.expiration = this.settings.seenExpiration;

    /**
     * Attach event handlers
     */
    this.$modal.on('shown.bs.modal', this.onShown.bind(this));
    this.$modal.on('hidden.bs.modal', this.onHidden.bind(this));
    $(selectors.form, this.$modal).on('submit', this.onFormSubmit.bind(this));

    /**
     * Checks the show logic and displays the popup if everything checks out
     */
    if (this.shouldShow()) {
      setTimeout(this.show.bind(this), this.settings.delay);
    }
  }

  onFormSubmit(e) {
    /**
     * STUB METHOD - You need to add implementation details
     */
    e.preventDefault();
    console.log('['+this.name+'] - onFormSubmit'); // eslint-disable-line
  }

  onFormSuccess() {
    this.$form.hide();
    this.$successMessage.show();
    // setTimeout => this.hide() ?
  }

  hide() {
    this.$modal.modal('hide');
    if (!Utils.isThemeEditor()) {
      User.setCookie(this.cookies.seen);
    }
  }

  show() {
    this.$modal.modal('show');
  }

  shouldShow() {
    // Checks should be done in this order!

    if (Utils.isThemeEditor() || !this.settings.enabled) {
      return false;
    }

    if (User.hasCookie(this.cookies.emailCollected.name)) {
      return false;
    }

    if (User.hasCookie(this.cookies.seen.name) && User.getCookieValue(this.cookies.seen.name) === this.cookies.seen.value) {
      return false;
    }

    return true;
  }

  onShown() {
    // $(selectors.emailInput).focus();
  }

  onHidden() {
    if (!Utils.isThemeEditor()) {
      User.setCookie(this.cookies.seen);
    }
  }

  /**
   * Theme Editor section events below
   */
  onSelect() {
    this.show();
  }

  onDeselect() {
    this.hide();
  }

  onUnload() {
    $('.modal-backdrop').remove();
  }
}
