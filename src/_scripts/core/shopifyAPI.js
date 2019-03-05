/**
 * Retrieve a JSON respresentation of the users cart
 *
 * @return {Promise} - JSON cart
 */
export function getCart() {
  const promise = $.Deferred();

  $.ajax({
    type: 'get',
    url: '/cart?view=json',
    success: (data) => {
      // Theme editor adds HTML comments to JSON response, strip these
      data = data.replace(/<\/?[^>]+>/gi, '');
      const cart = JSON.parse(data);
      promise.resolve(cart);
    },
    error: () => {
      promise.reject({
        message: 'Could not retrieve cart items'
      });
    }
  });

  return promise;
}

/**
 * AJAX submit an 'add to cart' form
 *
 * @param {jQuery} $form - jQuery instance of the form
 * @return {Promise} - Resolve returns JSON cart | Reject returns an error message
 */
export function addItemFromForm($form) {
  const promise = $.Deferred();

  $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/cart/add.js',
    data: $form.serialize(),
    success: () => {
      getCart().then((data) => {
        promise.resolve(data);
      });
    },
    error: () => {
      promise.reject({
        message: 'The quantity you entered is not available.'
      });
    }
  });

  return promise;
}

/**
 * Retrieve a JSON respresentation of the users cart
 *
 * @return {Promise} - JSON cart
 */
export function getProduct(handle) {
  return $.getJSON('/products/' + handle + '.js');
}

/**
 * Change the quantity of an item in the users cart
 *
 * @param {int} line - Cart line
 * @param {int} qty - New quantity of the variant
 * @return {Promise} - JSON cart
 */
export function changeLineItemQuantity(line, qty) {
  return $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/cart/change.js',
    data: 'quantity=' + qty + '&line=' + line
  });
}
