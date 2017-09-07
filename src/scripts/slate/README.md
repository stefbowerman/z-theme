# Apollo JS - Slate

Since Apollo is built on top of slate, there are a handful of objects that come attached to the `window.slate` namespace.  These objects have already been documented by the Slate team on [their website](https://shopify.github.io/slate/js-examples/), which you should have a look at before moving on.

In keeping with their code convention, any module scripts that are independent of specific templates or sections should be added to `window.slate` for consumption by external theme code.  In building Apollo, we have added and modified several properties of this namespace which are documented below.

## Modules

In building Apollo, we have added the following modules

- [Ajax Cart](#ajax-cart)
- [Collection Filters](#collection-filters)
- [Collection Sort](#collection-sort)

### Ajax Cart

Initialize the ajaxCart inside the main javascript file

```javascript
slate.AjaxCart.init({options});
```

| Parameters         | Type          | Description   |
| :----------------- | :------------ | :------------ |
| `disableAjaxCart`  | boolean | Quick way to disable the ajax cart |
| `emptyMessage`     | string  | Message that displays when the cart is empty |

The ajaxCart comes with public methods that allow you to control it from other parts of the application.

| Command        | Usage          | Description   |
| :----------------- | :------------ | :------------ |
| `open`  | `slate.AjaxCart.open()`  | Shows the cart |
| `close` | `slate.AjaxCart.close()` | Hides the cart |

### Collection Filters

The contents of the filters are sorted alphabetically by default but if you need an alternative sorting (like size), add a function to the `slate.CollectionFilters.Prototype._sortingFunctions` object.  The key that you use to add your sort function _must_ match the `data-filters-type` property of the element containing the options to sort.

To use, create a new instance and pass in an HTMLElement containing elements required by the selectors and a plain object of data about the collection that is being filtered.

```javascript
var sorting = new slate.collectionFilter( container, collectionData );
```

### Collection Sort

Controls collection sorting, requires a containing element and a select tag with sorting options that get turned into a query string on the collection page.

To use, create a new instance and pass in an HTMLElement containing elements required by the selectors and a plain object of data about the collection that is being sorted.

```javascript
var sorting = new slate.collectionSort( container, collectionData );
```

### Utilities

Apollo has added the following methods to `window.slate.utils`.

##### `slate.utils.getQueryParams`

Use this to retrieve an object of key / value pairs out of the parameters of the query string.

```javascript
// example.com/?mySearchTerm=blue+jeans

slate.utils.getQueryParams(); // outputs - { mySearchTerm: "blue+jeans" }
```
