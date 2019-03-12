import $ from 'jquery';
import Cookies from 'js-cookie';

const prefix = '_ztheme_';

const cookies = {
  siteVisit: {
    name: 'site_visit',
    value: true
  },
  subscriptionSlideupSeen: {
    name: 'subscriptionSlideup_seen',
    value: true
  },
  subscriptionModalSeen: {
    name: 'subscriptionModal_seen',
    value: true
  },
  emailCollected: {
    name: 'emailCollected',
    value: true
  }
};

class User {
  constructor() {
    this.name = 'user';
    this.namespace = `.${this.name}`;

    // Do any initialization here
    // For instance, you could increment a cookie that tracks visits to the site
  }

  /**
   * Creates and returns a copy of one of the cookies available above
   *
   * @param {String} key
   * @return {Object | undefined}
   */
  generateCookie(key) {
    let c = {};

    if (cookies.hasOwnProperty(key)) {
      c = $.extend(true, {}, cookies[key]);
      c.name = prefix + c.name;
    }
    else {
      console.warn(`[${this.name}] - Cannot create cookie.  Key ${key} not found.`);
    }
    return c;
  }

  /**
   * Sets a browser cookie
   *
   * @param {Object} cookie
   * @param {String} cookie.name
   * @param {String} cookie.value
   * @param {Number} cookie.expiration - Time to expire in days, expires after session if left blank
   */
  setCookie(cookie) {
    if (this.hasCookie(cookie.name) && this.getCookieValue(cookie.name) !== cookie.value) {
      this.removeCookie(cookie.name);
    }

    const opts = cookie.hasOwnProperty('expiration') ? { expires: cookie.expiration } : {};
    Cookies.set(cookie.name, cookie.value, opts);

    return this;
  }

  /**
   * Checks for the presence of a browser cookie by name (doesn't check for value equality)
   *
   * @param {String} cookieName
   * @return {Boolean}
   */
  hasCookie(cookieName) {
    return typeof Cookies.get(cookieName) !== 'undefined';
  }

  /**
   * Returns value of browser cookie by name
   *
   * @param {String} cookieName
   * @return {String | Undefined}
   */
  getCookieValue(cookieName) {
    return this.hasCookie(cookieName) ? Cookies.get(cookieName) : undefined;
  }

  /**
   * Removes a cookie by name
   *
   * @param {String} cookieName
   * @return {Self}
   */
  removeCookie(cookieName) {
    Cookies.remove(cookieName);
    return this;
  }
}

export default new User();
