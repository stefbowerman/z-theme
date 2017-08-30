# Apollo JS

Apollo builds on the pre-existing javascript structure provided to us by Slate.  This structure allows us to easily add functionality in an organized, way that focuses on re-usability of modules and share-ability of utilities.

## Structure

The site javascript is built off of a main `theme.js` which relies on two global objects - `window.slate` and `window.theme`.  Slate code is imported first followed by theme code which consumes it.  All files should attach plain objects, constructors or instances (whichever makes the most sense) to the appropriate global object.  All initialization should be done inside `theme.js` or handled through the `slate.section` instance (see [Adding Section JS](#adding-section-js)).

#### `window.slate`

This global object contains helper methods and module code that is independent of any section, page.  Files that attach to this object should be placed only in the `slate` directory.  By attaching to `slate` as opposed to `theme`, the idea is that these scripts could be used independently on other projects and are not tied into any theme specific files or code structure.

#### `window.theme`

This global object contains code specific to pages, templates, and sections of the working theme.  Files that attach to this object should be placed in either the `vendor` or `sections` directory.

#### `theme.js`

The main file that imports all the theme js dependencies, wires theme up and initializes them.

## JS Conventions  

When adding code to either of these objects please keep the following code conventions in mind.

- All code should be camelcased except constructors which should be Pascal cased.
- Utilities use plain objects
- Declare your dependencies via injection by passing them into the function scope (see [below](#adding-section-js).
- Selectors use `data-*` attributes and should be defined outside any constructors.
- Document your code as neccessary, this includes following [JSDocs](http://usejsdoc.org/) guidelines to define function signatures if they accept arguments, return values, or both.
- Prefix any private methods with an underscore.
- Revealing module pattern is OK.
- For consistency, when querying the DOM with a scoping element, pass it to the $ constructor as the second argument.

  ```javascript
  // Do this
  var $el = $(selector, $parentScope);

  // Not this
  var $el = $parentScope.find(selector);
  ```

## Adding JS

When adding javascript to the theme, you should first determine what the purpose of the script is and how it will be used, this will help determine where it should go.  If building module that may exist on multiple pages, you should build it entirely contained in it's own file to be consumed by the appropriate larger file (`theme.js` or a section instance).  If writing some global script that is independent of a module, then write it inside of `theme.js`.

## Adding Section JS

When adding section javascript, take extra care to make sure that it is fully compatible with the theme editor API.  For reference, see the following slate documentation on [adding section javascript](https://shopify.github.io/slate/js-examples/#section-events).  The code structure requires that you attach a constructor to `window.theme` which can then be passed into the section management object.  You should declare any selectors needed by that section outside of the constructor, and attach all methods to the object's prototype.  The constructor and object key should both be Pascal cased.  The constructor *must* accept an `HTMLElement` as it's only argument.

A simple example would look like:

```javascript
theme.MySection = (function(dependency) {

  var selectors = {
    clickMe: '[data-click-me]'
  };

  function MySection(container) {
    this.$container = $(container);

    this.name = 'mySection',
    this.namespace = '.'+this.name;

    $(selectors.clickMe).on('click', this.onClickMe.bind(this));
  }

  MySection.prototype = $.extend({}, MySection.prototype, {

    _privateFunction: function() {
      //
    },

    onClickMe: function() {
      // 
    }

  });

  return MySection;
})(dependency);
```

## Removing Section JS

If you remove a section from your theme, be sure to remove all the JS associated with it to keep your codebase nice and tidy.  You'll need to remove the actual file in the `scripts/sections` directory, the line in `theme.js` that imports the file, and finally the line that registers the section.

```javascript
// Remove this line
// =require sections/sectionToRemove.js

// And this one
sections.register('section-to-remove', theme.SectionToRemove);
```

## Adding Vendor Libraries Using NPM

By default, slate provides you with a way to add vendor scripts to your project by adding them to the vendor directory and then importing them in the `vendor.js` file.  Since this project already uses node for task running, we can use NPM to manage vendor dependencies and import them from the `node_modules` directory.  To do this, install your dependency, and then reference the javascript file.

```javascript
// =require /../../node_modules/dependency/dependency.js
```