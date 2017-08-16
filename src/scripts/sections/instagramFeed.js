/**
 * Instagram Feed Section Script
 * ------------------------------------------------------------------------------
 * 
 * Uses Instafeed.js to interact with Instagram API
 *   - See instafeedjs.com for documentation
 *   - See scripts/vendor directory for source file
 *
 * @namespace - InstagramFeed
 */

theme.InstagramFeed = (function($, Instafeed) {

  var selectors = {
    target: '[data-instagram-feed-target]'
  };

  /**
   * Instagram Feed section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   *
   * @param {string} container - selector for the section container DOM element
   */
  function InstagramFeed(container) {
    this.$container = $(container);

    this.namespace = '.instagramFeed';

    this.settings = {
      accessToken: this.$container.attr('data-access-token'),
      target: $(selectors.target).get(0), // Instafeed needs a bare DOM element to work with
      get: 'user'
    };

    /*
     *  Set 'mock' to true in order to override the default behavior (auto inserting images in the target element)
     *
     *  this.settings.mock = true;
     *  this.settings.success = onInstafeedMockSuccess.bind(this)
     *
     */

    if(!this.settings.accessToken) {
      console.warn('[InstagramFeed] - An access token is required to interact with the Instagram API');
      return;
    }

    this.init();
  }

  InstagramFeed.prototype = $.extend({}, InstagramFeed.prototype, {

    /**
     * Kick off the network requests.  Retrieve the user profile from the API and then fire up the feed.
     *
     */
    init: function() {
      $.ajax({
        type: 'GET',
        url: 'https://api.instagram.com/v1/users/self?access_token=' + this.settings.accessToken,
        dataType: 'jsonp'
      })
      .then(function(response){
        
        // Handle invalid response
        if(response.meta.hasOwnProperty('error_message')){
          console.warn('[InstagramFeed] - ' + response.meta.error_message);
          return;
        }

        this.settings.userId = response.data.id;

        /*
         *  Use this space to make any adjustments to the section now that you have access to the user profile object
         */

        this.feed = new Instafeed(this.settings);
        this.feed.run();
      }.bind(this));
    },

  /**
   * Callback that runs after Instafeed.run() if the 'mock' setting is set to true
   * Use this function to sort through images, select proper resolution, and construct a gallery of images to insert into the DOM
   *
   * @param {Object} feed - object returned from Instagram API
   * @param {Array} feed.data - Array of feed data objects containing images + info
   */
    onInstafeedMockSuccess: function(feed) {
      
      /*
       *  Add implementation details here
       *
       *  e.g. Loop through the feed data to return an array of images with src + caption properties, then append them to the DOM
       *
       *  var $target = $(selectors.target);
       *  var photos  = feed.data.map(function (photo) {
       *                 return {
       *                   src: photo.images && photo.images.standard_resolution && photo.images.standard_resolution.url,
       *                   caption: photo.caption && photo.caption.text || ''
       *                 };
       *               });
       *
       *
       *  photos.forEach(function(photo){
       *     var $i = $(new Image);
       *
       *     $i.attr('src', photo.src);
       *     $target.append($i)
       *  });
       *
       */

    },

    /**
     * Theme Editor section events below
     */
    onSelect: function() {
      console.log('[InstagramFeed] - section:select');
    },

    onShow: function() {
      console.log('[InstagramFeed] - section:show');
    },

    onLoad: function() {
      console.log('[InstagramFeed] - section::load');
    },

    onUnload: function() {
      console.log('[InstagramFeed] - section::unload');
    }
  });

  return InstagramFeed;
})(jQuery, Instafeed);
