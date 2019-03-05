/**
 * Return an object from an array of objects that matches the provided key and value
 *
 * @param {array} array - Array of objects
 * @param {string} key - Key to match the value against
 * @param {string} value - Value to get match of
 */
export function find(array, key, value) {
  let found;
  
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      found = array[i];
      break;
    }
  }
  
  return found;
}

/**
 * Remove an object from an array of objects by matching the provided key and value
 *
 * @param {array} array - Array of objects
 * @param {string} key - Key to match the value against
 * @param {string} value - Value to get match of
 */
export function remove(array, key, value) {
  let i = array.length;
  while (i--) {
    if (array[i][key] === value) {
      array.splice(i, 1);
      break;
    }
  }

  return array;
}

/**
 * _.compact from lodash
 * Remove empty/false items from array
 * Source: https://github.com/lodash/lodash/blob/master/compact.js
 *
 * @param {array} array
 */
export function compact(array) {
  let index = -1;
  let resIndex = 0;
  const length = array == null ? 0 : array.length;
  const result = [];

  while (++index < length) {
    const value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * _.defaultTo from lodash
 * Checks `value` to determine whether a default value should be returned in
 * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
 * or `undefined`.
 * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
 *
 * @param {*} value - Value to check
 * @param {*} defaultValue - Default value
 * @returns {*} - Returns the resolved value
 */
export function defaultTo(value, defaultValue) {
  return (value == null) ? defaultValue : value;
}

/**
 * Constructs an object of key / value pairs out of the parameters of the query string
 *
 * @return {Object}
 */
export function getQueryParams() {
  const queryString = (window.location.search && window.location.search.substr(1)) || '';
  const queryParams = {};

  queryString
    .split('&')
    .filter(element =>  element.length)
    .forEach((paramValue) => {
      const splitted = paramValue.split('=');

      if (splitted.length > 1) {
        queryParams[splitted[0]] = splitted[1];
      }
      else {
        queryParams[splitted[0]] = true;
      }
    });

  return queryParams;
}

/**
 * Returns empty string or query string with '?' prefix
 *
 * @return (string)
 */
export function getQueryString() {
  let queryString = (window.location.search && window.location.search.substr(1)) || '';

  // Add the '?' prefix if there is an actual query
  if (queryString.length) {
    queryString = `?${queryString}`;
  }

  return queryString;
}

/**
 * Constructs a version of the current URL with the passed in key value pair as part of the query string
 * Will also remove the key if an empty value is passed in
 * See: https://gist.github.com/niyazpk/f8ac616f181f6042d1e0
 *
 * @param {String} key
 * @param {String} value
 * @param {String} uri - optional, defaults to window.location.href
 * @return {String}
 */
export function getUrlWithUpdatedQueryStringParameter(key, value, _uri) {
  let uri = _uri || window.location.href;

  // remove the hash part before operating on the uri
  const i = uri.indexOf('#');
  const hash = i === -1 ? ''  : uri.substr(i);
  uri = i === -1 ? uri : uri.substr(0, i); // eslint-disable-line no-param-reassign

  const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i'); // eslint-disable-line prefer-template
  const separator = uri.indexOf('?') !== -1 ? '&' : '?';

  if (!value) {
    // remove key-value pair if value is empty
    uri = uri.replace(new RegExp('([?&]?)' + key + '=[^&]*', 'i'), ''); // eslint-disable-line prefer-template
    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1);
    }
    // replace first occurrence of & by ? if no ? is present
    if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
  }
  else if (uri.match(re)) {
    uri = uri.replace(re, '$1' + key + '=' + value + '$2'); // eslint-disable-line prefer-template
  }
  else {
    uri = uri + separator + key + '=' + value; // eslint-disable-line prefer-template
  }
  return uri + hash;
}

/**
 * Constructs a version of the current URL with the passed in parameter key and associated value removed
 *
 * @param {String} key
 * @return {String}
 */
export function getUrlWithRemovedQueryStringParameter(parameterKeyToRemove, _uri) {
  const uri = _uri || window.location.href;

  let rtn = uri.split('?')[0];
  let param;
  let paramsArr = [];
  const queryString = (uri.indexOf('?') !== -1) ? uri.split('?')[1] : '';

  if (queryString !== '') {
    paramsArr = queryString.split('&');
    for (let i = paramsArr.length - 1; i >= 0; i -= 1) {
      param = paramsArr[i].split('=')[0];
      if (param === parameterKeyToRemove) {
        paramsArr.splice(i, 1);
      }
    }
    if (paramsArr.length > 0) {
      rtn = rtn + '?' + paramsArr.join('&');  // eslint-disable-line prefer-template
    }
  }

  return rtn;
}

/**
 * Check if we're running the theme inside the theme editor
 *
 * @return {bool}
 */
export function isThemeEditor() {
  return window.location.href.match(/myshopify.com/) !== null && window.location.href.match(/theme_id/) !== null;
}

/**
 * Get the name of the correct 'transitionend' event for the browser we're in
 *
 * @return {string}
 */
export function whichTransitionEnd() {
  const el = document.createElement('fakeelement');
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  };
  let name;

  Object.keys(transitions).forEach((t) => {
    if (el.style[t] !== undefined) {
      name = transitions[t];
    }
  });

  return name;
}

/**
 * Adds user agent classes to the document to target specific browsers
 *
 */
export function userAgentBodyClass() {
  const ua = navigator.userAgent;
  const d = document.documentElement;
  let classes = d.className;
  let matches;

  // Detect iOS (needed to disable zoom on form elements)
  // http://stackoverflow.com/questions/9038625/detect-if-device-is-ios/9039885#9039885
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    classes += ' ua-ios';

    // Add class for version of iOS
    matches = ua.match(/((\d+_?){2,3})\slike\sMac\sOS\sX/);
    if (matches) {
      classes += ' ua-ios-' + matches[1];// e.g. ua-ios-7_0_2
    }

    // Add class for Twitter app
    if (/Twitter/.test(ua)) {
      classes += ' ua-ios-twitter';
    }

    // Add class for Chrome browser
    if (/CriOS/.test(ua)) {
      classes += ' ua-ios-chrome';
    }
  }

  // Detect Android (needed to disable print links on old devices)
  // http://www.ainixon.me/how-to-detect-android-version-using-js/
  if (/Android/.test(ua)) {
    matches = ua.match(/Android\s([0-9]*)/);
    classes += matches ? ' ua-aos ua-aos-' + matches[1].replace(/\./g, '_') : ' ua-aos';
  }

  // Detect webOS (needed to disable optimizeLegibility)
  if (/webOS|hpwOS/.test(ua)) {
    classes += ' ua-webos';
  }

  // Detect Samsung Internet browser
  if (/SamsungBrowser/.test(ua)) {
    classes += ' ua-samsung';
  }

  d.className = classes;
}

/**
 * Generates a 32 bit integer from a string
 * Reference - https://stackoverflow.com/a/7616484
 *
 * @param {string}
 * @return {int}
 */
export function hashFromString(string) {
  let hash = 0;
  let i;
  let chr;

  if (string.length === 0) return hash;

  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;  // eslint-disable-line no-bitwise
    // Convert to 32bit integer
    hash |= 0; // eslint-disable-line no-bitwise
  }

  return hash;
}

export function chosenSelects($container) {
  const $selects = $container ? $('select.form-control', $container) : $('select.form-control');
  $selects.not('[data-no-chosen]').chosen();

  // Allows browser autofill to function properly
  $selects.on('change', () => {
    $(this).trigger('chosen:updated');
  });
}

/**
 * Browser cookies are required to use the cart. This function checks if
 * cookies are enabled in the browser.
 */
export function cookiesEnabled() {
  let cookieEnabled = navigator.cookieEnabled;

  if (!cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
  }
  return cookieEnabled;
}

/**
 * Pluralizes the unit for the nuber passed in.
 * Usage mirrors the Shopify 'pluralize' string filter
 *
 * @param {Number} num
 * @param {String} singular
 * @param {String} plural
 * @return {String}
 */
export function pluralize(num, singular, plural)  {
  let output = '';

  const number = parseInt(num);

  if (number === 1) {
    output = singular;
  }
  else {
    output = plural;
    if (typeof plural === 'undefined') {
      output = `${singular}s`; // last resort, turn singular into a plural
    }
  }
  return output;
}
