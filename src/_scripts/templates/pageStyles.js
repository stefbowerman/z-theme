import BaseTemplate from './base';

const $body = $(document.body);
  
const selectors = {
  dot: '.dot'
};

class PageStylesTemplate extends BaseTemplate {
  constructor() {
    super('template-page-styles');
  }

  addEventHandlers() {
    $body.on('click', selectors.dot, function() {
      $(this).toggleClass('is-active');
    });

    $body.on('click', 'a[href="#"]', () => false);
  }
}

export default new PageStylesTemplate();
