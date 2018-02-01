/**
 * User Scripts
 * -----------------------------------------------------------------------------
 * Mostly handles cookie setting / removal, logic around user sessions
 *
 * @namespace user
 */

slate.user = (function(Cookies) {

 /**
  * User constructor
  */
  function User() {
    this.name = 'user'
    this.namespace = '.' + this.name;

    // Do any initialization here
    // For instance, you could increment a cookie that tracks visits to the site

    return this;
  };

  User.prototype = $.extend({}, User.prototype, {
    
   /**
    * Sets a browser cookie
    *
    * @param {Object} cookie
    * @param {String} cookie.name
    * @param {String} cookie.value
    * @param {Number} cookie.expiration - Time to expire in days, expires after session if left blank
    */
    setCookie: function(cookie) {
      if(this.hasCookie(cookie.name) && this.getCookieValue(cookie.name) != cookie.value){
        this.removeCookie(cookie.name);
      }

      var opts = cookie.hasOwnProperty('expiration') ? { expires : cookie.expiration } : {};
      Cookies.set( cookie.name, cookie.value, opts );

      return this;
    },

   /**
    * Checks for the presence of a browser cookie by name (doesn't check for value equality)
    *
    * @param {String} cookieName
    * @return {Boolean}
    */
    hasCookie: function(cookieName) {
      return typeof Cookies.get( cookieName ) !== "undefined";
    },

   /**
    * Returns value of browser cookie by name
    *
    * @param {String} cookieName
    * @return {String | Undefined}
    */
    getCookieValue: function(cookieName) {
      return this.hasCookie( cookieName ) ? Cookies.get( cookieName ) : undefined;
    },

   /**
    * Removes a cookie by name
    *
    * @param {String} cookieName
    * @return {Self}
    */
    removeCookie: function(cookieName) {
      Cookies.remove( cookieName )
      return this;
    }
  });

  return new User();

}(Cookies));