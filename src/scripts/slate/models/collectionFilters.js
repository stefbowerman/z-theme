/**
 * Model - Collection Filters
 * ------------------------------------------------------------------------------
 *
 * @namespace - models.collectionFilters
 */

slate.models = slate.models || {}; 

slate.models.CollectionFilters = (function(){

  var $body = $(document.body);
  
  var selectors = {
    filterSelect: '[data-filters-type][data-filters-type-select]',
    filtersClear: '[data-filters-clear]'
  };

  /**
   * CollectionFilters constructor
   *
   * @param {HTMLElement} container - Container element used for scoping any element selection
   * @param {Object} collectionData - see the bottom of `sections/collection.liquid`
   */
  function CollectionFilters(container, collectionData) {
    this.$container = $(container);

    this.name = 'collectionFilters';
    this.namespace = '.'+this.name;

    // Stop parsing if we don't have the collection data
    if (!collectionData) {
      return;
    }

    this.collectionData = collectionData;

    this.$container.on('change', selectors.filterSelect, this.applyFilters.bind(this));
    this.$container.on('click',  selectors.filtersClear, this.onFilterClearClick.bind(this));

    this._sortFilters();
  }

  CollectionFilters.prototype = $.extend({}, CollectionFilters.prototype, {

    /**
     * Returns a url for the current collection with selected filters
     *
     * @return {string} - url
     */
    _getCollectionUrlWithFilters: function() {
      var collectionUrl = this.collectionData.url;
      var tags = [];

      $(selectors.filterSelect, this.container).find('option:selected').each(function(){
        // Make sure we don't push empty strings
        if($(this).val()){
          tags.push( $(this).val() );
        }
      });

      tags = tags.map(function (str) {
        return str
          .toLowerCase()
          .replace(/[^\w\u00C0-\u024f]+/g, "-")
          .replace(/^-+|-+$/g, "");
      });

      return tags.length ? collectionUrl + '/' + tags.join('+') : collectionUrl;
    },

    /**
     * Filtering has nothing to do with the query string so make sure we don't mess with it.
     *
     * @return (string) - Empty string or query string with '?' prefix
     */
    _getQueryString: function() {
      var queryString = location.search && location.search.substr(1) || '';

      // Add the '?' prefix if there is an actual query
      if(queryString.length){
        queryString = '?' + queryString;
      }

      return queryString;
    },

    _sortingFunctions: {

      /**
       * Sorts sizes based on a predefined order
       *
       * @param (string) a
       * @param (string) b
       * @return (int)
       */
      size: function(a, b) {
        console.warn('[collectionFilters] - _sortingFunctions.size - This method hasn\'t been implemented yet.');
        // Implement this so sizes show up how we expect them to? small, med, large..
      }
    },

    /**
     * Sorts the filter options inside each select tag if there is an applicable sort function available
     */
    _sortFilters: function() {
      var self = this;

      $(selectors.filterSelect, this.$container).each(function(){
        var $select = $(this);
        var $toSort = $select.find('option');
        var sortingFunction = self._sortingFunctions[ $select.data('filters-type') ];

        if(sortingFunction){
          $toSort.sort(function(a, b) {
            return sortingFunction($(a).val(), $(b).val());
          });
        }
      });
    },

    /**
     * Redirects the browser to the collection page with any filters applied
     */
    applyFilters: function() {
      window.location.href = this._getCollectionUrlWithFilters() + this._getQueryString();
    },

    /**
     * Redirects the browser to the collection page without any filters applied
     */
    clear: function() {
      window.location.href = this.collectionData.url + this._getQueryString();
    },

    onFilterClearClick: function(e) {
      e.preventDefault();
      this.clear();
    }
  });

  return CollectionFilters;
})();