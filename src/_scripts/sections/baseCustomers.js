import $ from 'jquery';
import BaseSection from './base';

const selectors = {
  sidebar: '[data-account-sidebar]'
};

const classes = {
  linkItemActive: 'is-active'
};

export default class BaseCustomersSection extends BaseSection {
  constructor(container, name) {
    super(container, name);

    this.$sideBarLinks = $(selectors.sidebar).find('a');
    this.$sideBarSelect = $(selectors.sidebar).find('select');

    this.$sideBarLinks.on('click', this.onSidebarLinksClick.bind(this));
    this.$sideBarSelect.on('change', this.onSidebarSelectChange.bind(this));
  }

  onSidebarLinksClick(e) {
    // Follow the link as normal
    // Leaving this here as it should be overwritten by any classes that extend this one
  }

  onSidebarSelectChange(e) {
    const value = $(e.currentTarget).val();
    const link = document.createElement('a');
    
    link.href = value;

    // If it's linking to a hash on the same page, don't do anything
    if (link.host === window.location.host && link.pathname === window.location.pathname) {
      return;
    }

    window.location = value;
  }

  activateLink(el) {
    if (!el || el.length === 0) return;

    this.$sideBarLinks.parent('li').removeClass(classes.linkItemActive);
    $(el).parent('li').addClass(classes.linkItemActive);
  }
}
