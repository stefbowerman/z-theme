/**
 * Filters & Sort BucketFeet Implementation
 */
slate.filtersAndSort = (function () {
  var selectors = {
    // Filters
    filterMainContainer: '[data-selector="filter-main-container]',
    filterAction: '[data-action="filter"]',
    filterContainer: '[data-selector="filter-container"]',
    filterPopover: '[data-selector="filter-popover"]',
    filterSelect: '[data-selector="filter-select"]',
    filterClear: '[data-action="filter-clear"]',
    // Mobile Filters
    mobileHidden: '[data-selector="hide-label-mobile]',
    mobileFiltersToggle: '[data-action="mobile-filter-toggle"]',
    mobileModalContainer: '[data-selector="mobile-filter-modal"]',
    mobileFilterContainer: '[data-selector="mobile-filter-container"]',
    mobileFilterClose: '[data-action="close-filter-modal"]',
    mobileInsertAfter: '[data-selector="append-filter-mobile"]',
    // Sort
    sortAction: '[data-action="sort"]',
    sortContainer: '[data-selector="sort-container"]',
    sortOptionContainer: '[data-selector="sort-option-container"]',
    sortSelect: '[data-selector="sort-select"]'
  };

  var collectionData = window.theme.collectionData;

  if (!collectionData) return;

  var sortDefault = collectionData.sortDefault;
  var sortApplied = collectionData.sortApplied;

  var activeClass = 'is-active';
  var hiddenClass = 'hidden';
  var scrollClass = 'u-overflow-hidden';

  var DESKTOP_MIN_WIDTH = 992;

  function preventDefault (fn) {
    return function (evt) {
      evt.preventDefault();
      return fn.call(this, evt);
    };
  }

  function getCollectionUrlWithFilters () {
    var collectionUrl = collectionData.url;
    var tags = [];

    $(selectors.filterSelect).filter('.' + activeClass).each(function () {
      tags.push($(this).data('value'));
    });

    tags = tags.map(function (str) {
      return str
        .toLowerCase()
        .replace(/[^\w\u00C0-\u024f]+/g, "-")
        .replace(/^-+|-+$/g, "");
    });

    return tags.length ? collectionUrl + '/' + tags.join('+') : collectionUrl;
  }

  function getQueryParams () {
    var queryString = location.search && location.search.substr(1) || '';
    var queryParams = {};

    queryString
      .split('&')
      .filter(function (element) {
        return element.length;
      })
      .forEach(function (paramValue) {
        var splitted = paramValue.split('=');

        if (splitted.length > 1) {
          queryParams[splitted[0]] = splitted[1];
        } else {
          queryParams[splitted[0]] = true;
        }
      });

    return queryParams;
  }

  var Filters = {
    toggleVisibility: function toggleVisibility () {
      var self = $(this);
      var option = $(this).data('option');

      $(selectors.filterPopover).filter('.' + activeClass).each(function () {
        var callToAction = $(this)
                              .parents(selectors.filterContainer)
                              .find(selectors.filterAction);

        if (!callToAction.is(self)) {
          Filters.toggleVisibility.call(callToAction);
        }
      });

      $(this)
        .toggleClass(activeClass)
        .parents(selectors.filterContainer)
        .find(selectors.filterPopover)
        .toggleClass(activeClass);
    },
    selectFilter: function selectFilter () {
      var selectedOption = $(this).text();

      $(this)
        .parents(selectors.filterPopover)
        .find('.' + activeClass)
        .removeClass(activeClass);

      $(this).addClass(activeClass);

      $(this)
        .parents(selectors.filterContainer)
        .find(selectors.filterAction)
        .text(selectedOption)
        .removeClass(activeClass)
        .parents(selectors.filterContainer)
        .find(selectors.filterPopover)
        .removeClass(activeClass);

      // Trigger filtering action right away
      Filters.doFilter();
    },
    doFilter: function doFilter () {
      var collectionUrl = getCollectionUrlWithFilters();
      var queryParams = getQueryParams();

      if (collectionData.sortApplied) {
        queryParams.sort_by = collectionData.sortApplied;
      }

      window.location.href = collectionUrl + '?' + $.param(queryParams);
    },
    clearFilters: function clearFilters () {
      var collectionUrl = collectionData.url;
      var queryParams = getQueryParams();

      if (collectionData.sortApplied) {
        queryParams.sort_by = collectionData.sortApplied;
      }

      window.location.href = collectionUrl + '?' + $.param(queryParams);
    },
    checkMobileFiltersStatus: function () {
      var activeFilters = $('[data-selector="mobile-filter-container"]').find('.Select--filter .Select-inner.is-active');

      if (activeFilters.length > 0) {
        $('[data-selector="clear-filter-button"]').addClass('active');
        $('[data-selector="filter-none"]').removeClass('active');
        $('[data-selector="filter-select-mobile"]').find('[data-action="mobile-filter-toggle"]').text('Filter By (' + activeFilters.length + ')')
      } else {
        $('[data-selector="clear-filter-button"]').removeClass('active');
        $('[data-selector="filter-none"]').addClass('active');
      }
    },
    checkSize: function () {
      var width = $(window).width();

      if (width < DESKTOP_MIN_WIDTH) {
        this.moveForMobile();
        this.checkMobileFiltersStatus();
      } else {
        this.moveForDesktop();
      }
    },
    moveForMobile: function () {
      $(selectors.mobileHidden).addClass(hiddenClass);
      $(selectors.mobileFiltersToggle).removeClass(hiddenClass);

      $(selectors.filterContainer)
        .detach()
        .appendTo(selectors.mobileFilterContainer);
    },
    moveForDesktop: function () {
      $(selectors.mobileHidden).removeClass(hiddenClass);
      $(selectors.mobileFiltersToggle).addClass(hiddenClass);

      $(selectors.filterContainer)
        .detach()
        .insertAfter(selectors.mobileInsertAfter);
    },
    openModal: function () {
      $(selectors.mobileModalContainer).removeClass(hiddenClass);
      $('body').addClass(scrollClass);
    },
    closeModal: function () {
      $(selectors.mobileModalContainer).addClass(hiddenClass);
      $('body').removeClass(scrollClass);
    },
    init: function () {
      // Sort Filters
      $(selectors.filterPopover).each(function () {
        var container = $(this).find('.Content .flex');
        var toSort =  container.find('[data-selector="filter-item"]');

        toSort.sort(function (a, b) {
          var contentA = $(a).find(selectors.filterSelect).text().trim();
          var contentB = $(b).find(selectors.filterSelect).text().trim();

          if (!isNaN(parseInt(contentA))) {
            contentA = Number(contentA);
            contentB = Number(contentB);
          }

          if (contentA < contentB) {
            return -1;
          }

          if (contentA > contentB) {
            return 1;
          }

          return 0;
        });

        toSort.detach().appendTo(container);
      });

      // Prevent Closing
      $('body').on('click', function (evt) {
        if ($(selectors.filterPopover).hasClass(activeClass) &&
          !$(evt.target).is(selectors.filterPopover + ', a') &&
          !$(evt.target).closest(selectors.filterPopover).length) {

          $(selectors.filterPopover).filter('.' + activeClass).each(function () {
            var callToAction = $(this)
                                  .parents(selectors.filterContainer)
                                  .find(selectors.filterAction);

            Filters.toggleVisibility.call(callToAction);
          });
        }
      });

      $(window).on('resize', this.checkSize.bind(this));
      this.checkSize(); // First Launch

      // Actions
      $('body').on('click', selectors.filterAction, preventDefault(Filters.toggleVisibility));
      $('body').on('click', selectors.filterSelect, preventDefault(Filters.selectFilter));
      $('body').on('click', selectors.filterClear, preventDefault(Filters.clearFilters));

      // Mobile Only
      $('body').on('click', selectors.mobileFiltersToggle, preventDefault(Filters.openModal));
      $('body').on('click', selectors.mobileFilterClose, preventDefault(Filters.closeModal));
    }
  };

  var Sort = {
    toggleVisibility: function () {
      $(this)
        .toggleClass(activeClass)
        .parents(selectors.sortContainer)
        .find(selectors.sortOptionContainer)
        .toggleClass(activeClass);
    },
    doSort: function () {
      var sortBy = $(this).data('value');
      var queryParams = getQueryParams();

      if ($(this).hasClass(activeClass)) {
        $(this)
          .parents(selectors.sortContainer)
          .find(selectors.sortOptionContainer)
          .toggleClass(activeClass);
      }

      if (sortBy === sortDefault) {
        sortBy = '';
      }

      if (sortBy) {
        queryParams.sort_by = sortBy;
      } else {
        delete queryParams.sort_by;
      }

      location.search = $.param(queryParams);
    },
    init: function () {
      $('body').on('click', selectors.sortAction, preventDefault(Sort.toggleVisibility));
      $('body').on('click', selectors.sortSelect, preventDefault(Sort.doSort));
    }
  };

  Filters.init();
  Sort.init();
}());
