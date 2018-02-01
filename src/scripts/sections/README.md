# Z-Theme JavaScript - Sections

Sections are one of the most unique features of Shopify.  Slate has provided us with the *Section* object that acts as an initializer for section sode and an abstraction layer for theme editor events.  Out of the box, Slate uses a section to render the product detail page and includes the `scripts/sections/product.js` file to handle all the functionality specific to that section.  In addition to product, Z-Theme has created more sections to provide often needed functionality.

- [Collection](#collection)
- [Instagram Feed](#instagram-feed)
- [Pencil Banner](#pencil-banner)
- [Product](#product)
- [Subscription Popup](#subscription-popup)

### Collection


### Instagram Feed

Requires an access token.  Built for the primary use case of needing to show a client's feed.  If you need to show another user's feed or a hashtag / location you'll have to adjust the code.

### Pencil Banner

Small banner to display text, usually pinned to the top of the site.  Comes with a method for generating a unique has code based on the banner contents, useful for setting a cookie associated with the banner that invalidates when the contents are changed.

### Product

### Subscription Popup

