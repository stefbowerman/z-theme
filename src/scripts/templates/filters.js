/**
 * Filters & Sort BucketFeet Implementation
 */
slate.filtersAndSort = (function () {
  var selectors = {
    // Filters
    filterMainContainer: '.js-filter-main-container',
    filterAction: '.js-filter-action',
    filterContainer: '.js-filter-container',
    filterPopover: '.js-filter',
    filterSelect: '.js-filter-select',
    filterClear: '.js-filter-clear',
    // Mobile Filters
    mobileHidden: '.js-mobile-hidden',
    mobileFiltersToggle: '.js-mobile-filter-toggle',
    mobileModalContainer: '.js-mobile-filter-modal',
    mobileFilterContainer: '.js-mobile-filter-container',
    mobileFilterClose: '.js-modal-filter-close',
    mobileInsertAfter: '.js-mobile-after',
    // Sort
    sortAction: '.js-sort-action',
    sortContainer: '.js-sort-container',
    sortOptionContainer: '.js-sort-option-container',
    sortSelect: '.js-sort-select'
  };

  var collectionData = window.theme.collectionData;

  if (!collectionData) return;

  var sortDefault = collectionData.sortDefault;
  var appliedSort = collectionData.sortApplied;

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

      if (collectionData.appliedSort) {
        queryParams.sort_by = collectionData.appliedSort;
      }

      window.location.href = collectionUrl + '?' + $.param(queryParams);
    },
    clearFilters: function clearFilters () {
      var collectionUrl = collectionData.url;
      var queryParams = getQueryParams();

      if (collectionData.appliedSort) {
        queryParams.sort_by = collectionData.appliedSort;
      }

      window.location.href = collectionUrl + '?' + $.param(queryParams);
    },
    checkMobileFiltersStatus: function () {
      var activeFilters = $('.Filter-modalContent').find('.js-filter-select.is-active');

      if (activeFilters.length > 0) {
        $('#clear-filter-btn').addClass('active');
        $('#zero-indicator').removeClass('active');
        $('.Select.Select--filter.filter--mobile.u-mr__md').find('.js-mobile-filter-toggle').text('Filter By (' + activeFilters.length + ')')
      } else {
        $('#clear-filter-btn').removeClass('active');
        $('#zero-indicator').addClass('active');
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
        var toSort =  container.find('.js-Filter-item');

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
