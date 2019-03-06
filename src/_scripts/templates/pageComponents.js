import BaseTemplate from './base';
import SlideupAlert from '../ui/slideupAlert';
import Tabs from '../ui/tabs';

const $body = $(document.body);
  
const selectors = {
  slideupAlertForm: '[data-slideup-alert-form]',
  tabContainer: '[data-tab-container]',
  qaSetMax: '[data-qa-set-max]',
  qaToggleEnabled: '[data-qa-toggle-enabled]',
  qa: '[data-quantity-adjuster]'
};

class PageComponentsTemplate extends BaseTemplate {
  constructor() {
    super('template-page-components');
  }

  addEventHandlers() {
    $(selectors.slideupAlertForm).on('submit', function(e) {
      e.preventDefault();

      new SlideupAlert({
        title: $(this).find('input[name="title"]').val(),
        text: $(this).find('input[name="text"]').val()
      });
    });

    // Tabs
    new Tabs($(selectors.tabContainer));

    // Quantity Adjuster
    $(selectors.qaSetMax).on('click', (e) => {
      $(selectors.qa).find('input[type="number"]').attr('max', $(e.currentTarget).data('qa-set-max'));
    });

    $(selectors.qaToggleEnabled).on('click', (e) => {
      const $qaInput = $(selectors.qa).find('input[type="number"]');
      $qaInput.attr('disabled', !$qaInput.is(':disabled'));
    });

    $body.on('click', 'a[href="#"]', () => false);
  }
}

export default new PageComponentsTemplate();
