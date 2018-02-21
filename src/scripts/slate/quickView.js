/**
 * QuickView
 * -----------------------------------------------------------------------------
 * Initializes the quickview feature by listening for click events and signaling the quickview manager to take action
 *
 */

slate.quickView = (function() {

  var $window = $(window);
  var $body = $(document.body);

  var selectors = {
    quickViewTrigger: '[data-quick-view-trigger]'
  };

  /**
   * QuickViewManager 
   *
   * - Creates and keeps track of quickviews on the page.
   * - Makes sure only one is visible at a time and that we only load a quick view *once* per product
   *
   * @constructor
   */
  function QuickViewManager() {
    this.name = 'quickViewManager';
    this.quickViews = {};

    var isLoadingQuickView = false;

    this.register = function(id, qv) {
      if( !(qv instanceof slate.models.QuickView) ) {
        console.warn('['+this.name+'] - instance of slate.models.QuickView required when calling register');
        return;
      }

      if(!this.quickViews.hasOwnProperty(id)) {
        this.quickViews[id] = qv;
      }

      return this;
    };

    this.getQuickViewByID = function(id) {
      return this.quickViews[id];
    };

    this.onResize = function() {
      $.each(this.quickViews, function(i, qv){
        qv.onResize();
      });
    };

    this.getOpenQuickViews = function() {
      var opens = [];

      $.each(this.quickViews, function(i, qv) {
        qv.isOpen() && opens.push(qv);
      });

      return opens;
    },

    this.closeOpenQuickViews = function(cb) {
      var opens = this.getOpenQuickViews();

      if(opens.length == 0 ) {
        cb();
      }
      else {
        $.each(opens, function(i, qv) {
          if(i==0) {
            qv.$productCard.one('closed.quickView', cb);  
          }
          qv.close();
        });
      }

    };

    this.onQuickViewTriggerClick = function($trigger) {
      if($trigger == undefined) {
        return;
      }

      var quickViewManager = this;
      var $productCard      = $trigger.parents('.product-card');
      var id                = $productCard.attr('id');
      var quickView         = this.getQuickViewByID(id);

      if(quickView == undefined) {

        if(isLoadingQuickView) return; // Return early, we're already fetching a quick view, sorry!

        isLoadingQuickView = true;

        // generate a new QV
        quickView = new slate.models.QuickView({
          $productCard: $productCard,
          url: $trigger.attr('href')
        });

        $productCard.one('loaded.quickView', function() {
          isLoadingQuickView = false;
          quickViewManager.closeOpenQuickViews( quickView.open.bind(quickView) ); // Make sure all the QVs are closed before opening this new one
        });

        quickViewManager.register(id, quickView);
      }
      else {
        if(!quickView.isOpen()) {
          quickViewManager.closeOpenQuickViews( quickView.open.bind(quickView) );  
        }
      }
    };

    $window.on('resize', $.throttle(50, this.onResize.bind(this)));

    return this;
  };


  var quickViewManager = new QuickViewManager();  

  $(function() {

    $body.on('click', selectors.quickViewTrigger, function(e) {
      e.preventDefault();
      quickViewManager.onQuickViewTriggerClick($(this));
    });
    
  });

}());