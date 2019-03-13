import $ from 'jquery';
import BaseCustomersSection from './baseCustomers';

const selectors = {
  accountSection: '[data-account-section]',
  togglePassword: '[data-toggle-password]'
};

const hashes = {
  orderHistory: '#order-history',
  passwordRecover: '#recover'
};

export default class CustomersAccountSection extends BaseCustomersSection {
  constructor(container) {
    super(container, 'customersAccount');

    this.$sections = $(selectors.accountSection, this.$container);

    this.$account = this.$sections.filter('[data-account-section="account"]');
    this.$orderHistory = this.$sections.filter('[data-account-section="order-history"]');
    this.$passwordRecover = this.$sections.filter('[data-account-section="password-recover"]');
    this.$accountLink = this.$sideBarLinks.filter((i, el) => $(el).attr('href') === '/account');
    this.$orderHistoryLink = this.$sideBarLinks.filter((i, el) => $(el).attr('href') === `/account${hashes.orderHistory}`);

    // Allow deep linking to order history
    if (window.location.hash === hashes.orderHistory) {
      this.switchToOrderHistory();
    }
    else if (window.location.hash === hashes.passwordRecover) {
      this.switchToPasswordRecover();
    }
    else {
      this.switchToAccount();
    }

    this.$container.on('click', selectors.togglePassword, this.onTogglePasswordClick.bind(this));
  }

  onTogglePasswordClick(e) {
    e.preventDefault();

    if (this.$passwordRecover.hasClass('hide')) {
      this.switchToPasswordRecover();
    }
    else {
      this.switchToAccount();
    }
  }

  onSidebarLinksClick(e) {
    const link = e.currentTarget;

    // Link points to the page that we're currently on
    if (link.host === window.location.host && link.pathname === window.location.pathname) {
      e.preventDefault();

      if (link.hash === hashes.orderHistory) {
        this.switchToOrderHistory();
      }
      else {
        this.switchToAccount();
      }

      super.activateLink(link);
    }
  }

  onSidebarSelectChange(e) {
    const value = $(e.currentTarget).val();
    const link = document.createElement('a');
    
    link.href = value;

    // Link points to the page that we're currently on
    if (link.host === window.location.host && link.pathname === window.location.pathname) {
      // Look for the element being referenced in the hash and go to it
      if (link.hash === hashes.orderHistory) {
        this.switchToOrderHistory();
      }
      else {
        this.switchToAccount();
      }
    }
    else {
      // Let parent class handle the change
      super.onSidebarSelectChange(e);
    }
  }

  switchToPasswordRecover() {
    this.$account.addClass('hide');
    this.$passwordRecover.removeClass('hide');
    this.$orderHistory.addClass('hide');
    super.activateLink(this.$accountLink);
    this.$sideBarSelect.val(this.$accountLink.attr('href'));
    this.$sideBarSelect.trigger('chosen:updated');
    window.location.hash = hashes.passwordRecover;
  }

  switchToOrderHistory() {
    this.$account.addClass('hide');
    this.$passwordRecover.addClass('hide');
    this.$orderHistory.removeClass('hide');
    super.activateLink(this.$orderHistoryLink);
    this.$sideBarSelect.val(this.$orderHistoryLink.attr('href'));
    this.$sideBarSelect.trigger('chosen:updated');
    window.location.hash = hashes.orderHistory;
  }

  switchToAccount() {
    this.$account.removeClass('hide');
    this.$passwordRecover.addClass('hide');
    this.$orderHistory.addClass('hide');
    super.activateLink(this.$accountLink);
    this.$sideBarSelect.val(this.$accountLink.attr('href'));
    this.$sideBarSelect.trigger('chosen:updated');
    window.location.hash = '';
  }
}
