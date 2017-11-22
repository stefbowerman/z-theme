/**
 * User Scripts
 * -----------------------------------------------------------------------------
 * Mostly handles cookie setting / removal, logic around user sessions
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
      if(this.hasCookie(cookie)){
        this.removeCookie(cookie);
      }

      var opts = cookie.hasOwnProperty('expiration') ? { expires : cookie.expiration } : {};
      Cookies.set( cookie.name, cookie.value, opts );

      return this;
    },

   /**
    * Checks for the presence of a browser cookie by name
    *
    * @param {Object} cookie
    * @param {String} cookie.name
    * @return {Boolean}
    */
    hasCookie: function(cookie) {
      return cookie.hasOwnProperty('name') && typeof Cookies.get( cookie.name ) !== "undefined";
    },

   /**
    * Returns a browser cookie by name
    *
    * @param {Object} cookie
    * @param {String} cookie.name
    * @return {String | Undefined}
    */
    getCookie: function(cookie) {
      return this.hasCookie( cookie ) ? Cookies.get( cookie.name ) : undefined;
    },

   /**
    * Removes a cookie by name
    *
    * @param {Object} cookie
    * @param {String} cookie.name
    * @return {Self}
    */
    removeCookie: function(cookie) {
      if(cookie.hasOwnProperty('name')) {
        Cookies.remove( cookie.name )
      }
      return this;
    }
  });

  return new User();

}(Cookies));