/**
 * Blog Section Script
 * ------------------------------------------------------------------------------
 *
 * @namespace - blog
 */

theme.Blog = (function($) {

  var selectors = {
    contentGrid: '.content-grid',
    contentGridItem: '.content-grid__item',
    pagination: '[data-pagination]',
    nextPageLink: '[data-next-page]',
  };

  var classes = {
    tagIsActive: 'is-active'
  };

  function Blog(container) {

    _this = this;
    this.$container = $(container);

    this.name = 'blog';
    this.namespace = '.'+this.name;

    this.$container.on('click', selectors.nextPageLink, this.onNextPageLinkClick.bind(this));
  };

  Blog.prototype = $.extend({}, Blog.prototype, {

    onNextPageLinkClick: function(e) {
      e.preventDefault();
      var self     = this;
      var $link    = $(e.currentTarget);
      var url      = $link.attr('href');
      var linkText = $link.html();


      $.ajax({
        url: url,
        beforeSend: function( xhr ) {
          $link.html(theme.strings.loading || 'Loading');
        }
      })
      .done(function( data ) {
        var $dom = $(data);
        var $contentItems = $(selectors.contentGridItem, $dom);
        var $newNextPageLink = $(selectors.nextPageLink, $dom);

        $(selectors.contentGrid, self.$container).append($contentItems);

        if($newNextPageLink.length) {
          $link.replaceWith($newNextPageLink);
        }
        else {
          $(selectors.pagination, self.$container).remove();
        }
      });

    }
  });

  return Blog;
})(jQuery);
