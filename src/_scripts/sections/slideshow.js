import $ from 'jquery';
import BaseSection from './base';
import Slideshow from '../models/slideshow';

const selectors = {
  slideshow: '[data-slideshow]',
};

export default class SlideshowSection extends BaseSection {
  constructor(container) {
    super(container, 'slideshow');

    const settings = {
      // Put your settings here
    };

    this.slideshow = new Slideshow($(selectors.slideshow, this.$container), settings);
  }

  /**
   * Theme Editor section events below
   */
  onBlockSelect(e) {
    this.slideshow.goToSlideByBlockId(e.detail.blockId);
    this.slideshow.pause();
  }
}
