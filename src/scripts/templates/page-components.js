/**
 * Styleguide Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the components page template.
 *
 * Use this to hook up any JS necessary to show element functionality.
 */

 theme.components = (function() {
  
  var $body = $(document.body);
  
  var selectors = {
    slideupAlertForm: '[data-slideup-alert-form]'
  };

  if( !$body.is('.template-page-components') ){
    return;
  }

  $(selectors.slideupAlertForm).on('submit', function(e) {
    e.preventDefault();

    new slate.models.SlideupAlert({
      title: $(this).find('input[name="title"]').val(),
      text: $(this).find('input[name="text"]').val()
    });
  });

  $body.on('click', 'a[href="#"]', function(){
    return false;
  });

})();
