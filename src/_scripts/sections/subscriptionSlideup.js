import $ from 'jquery';
import BaseSection from './base';
import * as User from '../core/user';
import * as Utils from '../core/utils';
import Slideup from '../ui/slideup';

const selectors = {
  slideup: '[data-subscription-slideup]',
  formContent: '[data-subscription-slideup-form-content]',
  formMessage: '[data-subscription-slideup-form-message]'
};

const classes = {
  showMessage: 'show-message'
};

/**
 * Subscription Slideup Section Script
 * ------------------------------------------------------------------------------
 *
 * Details are dependent on:
 *  - Mailing list provider (See settings_schema.json)
 *  - 3rd party ajax / validation scripts
 *
 * @namespace - subscriptionSlideup
 */
export default class SubscriptionSlideupSection extends BaseSection {
  constructor(container) {
    super(container, 'subscriptionSlideup');

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
    this.$el          = $(selectors.slideup, this.$container);
    this.$formContent = $(selectors.formContent, this.$container);
    this.$formMessage = $(selectors.formMessage, this.$container);

    this.slideup = new Slideup(this.$el);
    
    // Hook up the form to an ESP here
    // this.ajaxKlaviyoForm = new slate....

    /**
     * These are the cookies that we'll use to keep track of how much the user has seen / interacted with the slideup
     */
    this.cookies = {};

    this.cookies.seen = User.generateCookie('subscriptionSlideupSeen');
    this.cookies.seen.value = Utils.hashFromString(this.$el.text()).toString(); // Set the cookie value based on the content
    this.cookies.seen.expiration = this.settings.seenExpiration;

    this.cookies.emailCollected = User.generateCookie('emailCollected');
    this.cookies.emailCollected.expiration = this.settings.seenExpiration;

    /**
     * Attach event handlers
     */
    this.$el.on('hide.slideup',   this.onHide.bind(this));
    this.$el.on('hidden.slideup', this.onHidden.bind(this));

    /**
     * Checks the show logic and displays the popup if everything checks out
     */
    if (this.shouldShow()) {
      setTimeout(() => {
        this.slideup.show();
      }, this.settings.delay);
    }
  }

  /**
   * Resets everything to it's initial state.  Only call when slideup isn't visible.
   */
  reset() {
    this.$formContent.find('input[type="email"]').val('');
    this.$formMessage.html('');
    this.$formContent.removeClass(classes.showMessage);
  }

  onSubscribeSuccess() {
    this.$formMessage.html(this.$formMessage.data('message-success'));
    this.$formContent.addClass(classes.showMessage);
    
    if (!Utils.isThemeEditor()) {
      User.setCookie(this.cookies.emailCollected);
    }
  }

  onSubmitFail() {
    this.$formMessage.html(this.$formMessage.data('message-fail'));
    this.$formContent.addClass(classes.showMessage);
    setTimeout(() => {
      this.$formContent.removeClass(classes.showMessage);
    }, 5000);
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

  onHide() {
    if (!Utils.isThemeEditor()) {
      User.setCookie(this.cookies.seen);
    }
  }

  onHidden() {
    this.reset();
  }

  /**
   * Theme Editor section events below
   */
  onSelect() {
    this.slideup.show();
  }

  onDeselect() {
    this.slideup.hide();
  }
}
