# Apollo JS

Apollo builds on the pre-existing javascript structure provided to us by Slate.  This structure allows us to easily add functionality in an organized way that focuses on re-usability of modules and share-ability of utilities.

- [Structure](#structure)
- [JS Conventions](#js-conventions)
- [Adding JS](#adding-js)
- [Adding Section JS](#adding-section-js)
- [Removing Section JS](#removing-section-js)
- [Adding Vendor Libraries](#adding-vendor-libraries)

## Structure

The site javascript is built off of the main `theme.js` file which relies on two global objects - `window.slate` and `window.theme`.  Slate code is imported first followed by theme code which consumes it.  All files should attach plain objects, constructors or instances (whichever makes the most sense) to the appropriate global object.  All initialization should be done inside `theme.js` or handled through the `slate.section` instance (see [Adding Section JS](#adding-section-js)).

#### `window.slate`

This global object contains helper methods and module code that is independent of any section or page.  Files that attach things to this object should be placed only in the `slate` directory.  By attaching to `slate` as opposed to `theme`, the idea is that these scripts could be used independently on other projects and are not tied into any theme specific files or code structure.

#### `window.theme`

This global object contains code specific to pages, templates, and sections of the working theme.  Files that attach to this object should be placed in either the `sections` or `templates` directory.

#### `theme.js`

The main file that imports all the theme javascript dependencies, wires theme up and initializes them.

#### Official Docs

Now that you understand the javascript architecture, please take a minute to look through the official [Slate JS documentation](https://shopify.github.io/slate/js-examples/) to get an idea of the functionality that they provide and how to make use of it.  Pay close attention to the part on [section events](https://shopify.github.io/slate/js-examples/#section-events) as that is the most important (and potentially confusing) feature of Slate.

##### Note On Section Events

Section events aren't covered very clearly in the official documentation.  If you browse the [Shopify documentation on sections](https://help.shopify.com/themes/development/theme-editor/section) and scroll all the way to the bottom, you'll see a section about how the Theme Editor API works.

> When merchants customize sections, the HTML of those sections is dynamically added, removed, or re-rendered directly onto the existing DOM without reloading the entire page.
> JavaScript that runs when the page loads will not run again when a section is re-rendered or added to the page.

To make sure your theme sections don't break when the user is customizing the theme, the editor fires events that your code can respond to. The events listed in the Shopify docs are the raw events as fired by the theme editor.

The __Section__ object that Slate provides acts as an abstraction layer to make it easier to interact with these events.  It takes care of attaching event listeners and calling the appropriate handlers.  As long as you follow the javascript pattern that Slate has created for sections (see [Adding Section JS](#adding-section-js)), all you need to do is attach specially named methods to the constructor's prototype and the __Section__ object will handle the rest.  The full list of named methods that you can use are listed at the bottom of the [Slate JS documentation](https://shopify.github.io/slate/js-examples/) and duplicated below.

| Methods      | Description |
| :-------------- | :-------------- |
| `onUnload()`        | A section has been deleted or is being re-rendered. |
| `onSelect()`        | User has selected the section in the editor's sidebar. |
| `onDeselect()`          | User has deselected the section in the editor's sidebar. |
| `onReorder()`          | User has changed the section's order in the editor's sidebar. |
| `onBlockSelect()`        | User has selected the block in the editor's sidebar. |
| `onBlockDeselect()`        | User has deselected the block in the editor's sidebar. |


## JS Conventions  

When adding javascript code to the theme, please keep the following code conventions in mind.

- All code should be camelcased except constructors which should be Pascal cased.

  ```javascript
  // Pascal cased constructor
  var MyConstructorFunction = function() {}

  // Camel case everywhere else
  var myNewInstance = new MyConstructorFunction();
  ```

- Utilities use plain objects
- Declare your dependencies via injection by passing them into the function scope.

  ```javascript
  theme.module = (function(dependency) {

    // Module code here

  })(dependency);
  ```
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

When adding javascript to the theme, you should first determine the purpose of the script and how it will be used, this will determine where it should live.

- If building module that may exist on multiple pages, you should build it entirely contained in it's own file to be consumed by the appropriate larger file (`theme.js` or a section instance).
- If writing something specific to a page or template, follow the pattern of files inside `scripts/templates`.
- If writing something specific to a section, add it to the appropriate file in `scripts/sections` or create a new one, following the guidelines in the section below.
- If writing something global that is independent of a module, then write it inside of `theme.js`.

## Adding Section JS

When adding section javascript, take extra care to make sure that it is fully compatible with the theme editor API.  For reference, see the following slate documentation on [adding section javascript](https://shopify.github.io/slate/js-examples/#section-events).  The code structure requires that you attach a constructor to `window.theme` which can then be passed into `slate.Sections`.  You should declare any selectors needed by that section outside of the constructor, and attach all methods to the object's prototype.  The constructor and object key should both be Pascal cased.  The constructor *must* accept an `HTMLElement` as it's only argument to be compatible with `slate.Sections`.

A simple example would look like:

```javascript
theme.MySection = (function(dependency) {

  var selectors = {
    clickMe: '[data-click-me]'
  };

  // Constructor Function
  function MySection(container) {
    this.$container = $(container);

    this.name = 'mySection',
    this.namespace = '.'+this.name;

    $(selectors.clickMe).on('click', this.onClickMe.bind(this));
  }

  // Add prototype methods
  MySection.prototype = $.extend({}, MySection.prototype, {

    _privateFunction: function() {
      //
    },

    onClickMe: function() {
      // 
    },

    // I'm a section editor event handler
    onSelect: function() {
      //
    }

  });

  return MySection;
})(dependency);
```

## Removing Section JS

If you remove a section from your theme, be sure to remove all the JS associated with it.  You'll need to remove the actual file in the `scripts/sections` directory, the line in `theme.js` that imports the file, and finally the line that registers the section.

```javascript
// Remove this line
// =require sections/sectionToRemove.js

// And this one
sections.register('section-to-remove', theme.SectionToRemove);
```

## Adding Vendor Libraries Using NPM

By default, Slate provides you with a way to add vendor scripts to your project by adding them to the vendor directory and then importing them in the `vendor.js` file.  Since this project already uses node for task running, we can use NPM to manage vendor dependencies and import them from the `node_modules` directory.  To do this, install your dependency, and then reference the javascript file like so.

```javascript
// =require /../../node_modules/dependency/dependency.js
```