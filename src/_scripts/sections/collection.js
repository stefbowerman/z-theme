import $ from 'jquery';
import BaseSection from './base';
import CollectionSort from '../view/collection/collectionSort';

const selectors = {
  collectionJson: '[data-collection-json]'
};

export default class CollectionSection extends BaseSection {
  constructor(container) {
    super(container, 'collection');

    // Stop parsing if we don't have the collection json script tag
    if (!$(selectors.collectionJson, this.$container).html()) {
      console.warn(`[${this.name}] - Element matching ${selectors.collectionJson} required.`);
      return;
    }

    this.collectionData = JSON.parse($(selectors.collectionJson, this.$container).html());

    this.sort = new CollectionSort(container, this.collectionData);
  }
}
