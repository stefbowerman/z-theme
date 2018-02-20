/**
 * Collection Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Collection template.
 *
 * @namespace collection
 */

 theme.Collection = (function(slate) {

  var selectors = {
    collectionJson: '[data-collection-json]',
    mobileFiltersToggle: '[data-mobile-filters-toggle]'
  };

  var classes = {

  };
  
  function Collection(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    this.name = 'collection';
    this.namespace = '.'+this.name;

    // Stop parsing if we don't have the collection json script tag
    if (!$(selectors.collectionJson, this.$container).html()) {
      console.warn('['+this.name+'] - Element matching ' + selectors.collectionJson + ' required.')
      return;
    }

    this.collectionData = JSON.parse($(selectors.collectionJson, this.$container).html());

    this.filters = new slate.collectionFilters( container, this.collectionData );
    this.sort    = new slate.collectionSort( container, this.collectionData );

    $(selectors.mobileFiltersToggle, this.$container).on('click', this.onMobileFiltersToggleClick.bind(this));
  }

  Collection.prototype = $.extend({}, Collection.prototype, {
    onMobileFiltersToggleClick: function(e) {
      e.preventDefault();
      console.log('['+this.name+'] - Implement method to toggle mobile filters');
    }
  });

  return Collection;

 })(slate)