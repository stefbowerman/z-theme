![ZG](http://i.imgur.com/kTma7I0.jpg)

# Apollo

Apollo is a boilerplate built on top of [Slate](https://shopify.github.io/slate/). Apollo follows Slate's theme scaffolding paradigm in which the initial scaffolding is [intentionally barebones](https://shopify.github.io/slate/theme/#intentionally-blank):

> Slate is a theme scaffold and command line tool for developing Shopify themes. It is designed to assist your development workflow and speed up the process of developing, testing, and deploying themes to Shopify stores.
>
> It allows you to sync local files with your live shop, deploy to multiple environments at the same time, and organize stylesheets and scripts in a flexible way.
to provide an unopinionated starting point.

For full Slate API documentation, go check out their [API docs](https://shopify.github.io/slate/).

---

## Contributing

The Apollo repo is used for: 1) forking Apollo as a framework for theme you're building, _or_, 2) managing and developing the Apollo core framework.

**Please review the [Apollo code guide](https://github.com/zehnergroup/apollo/wiki/Code-Guide), and adhere to those standards when developing.**

### Getting Started

- Install Slate: `npm install -g @shopify/slate`
- Fork the [repo](https://github.com/zehnergroup/apollo/), then clone it
- In the project directory, install dependences with `npm install`
- Setup your shopify dev store
- [Generate API credentials](https://help.shopify.com/api/getting-started/api-credentials#get-credentials-through-the-shopify-admin) for your local environment
- Rename `config-sample.yml` to `config.yml` and add your store information and private app credentials:
  - **store:** the Shopify-specific URL for this store/environment (ie. my-store.myshopify.com)
  - **theme_id:** the unique id for the theme you want to write to when deploying to this store. You can find this information in the URL of the theme's online editor at Shopify [admin/themes](https://shopify.com/admin/themes).
  - **password:** the password generated via a private app on this store.  Access this information on your Shopify [admin/apps/private](https://shopify.com/admin/apps/private) page.
- Run `slate -h` for help

### [Slate Commands](https://shopify.github.io/slate/commands/)

```bash
slate start [-e][-m] # Runs build, deploy, then watcher
slate watch [-e][-n] # Runs watcher, then deploy
slate deploy [-e][-m] # Builds `dist` folder and replaces the theme set in config.yml
slate build # Creates a production-ready `dist` bundle
```

All developers who wish to contribute through code or issues, take a look at the
[Code of Conduct](https://github.com/zehnergroup/master/CODE_OF_CONDUCT.md).

---

## Apollo Roadmap

This is a high-level look at the what we hope to provide out of the box with Apollo. **If you are looking to use Apollo as the boilerplate for your theme**, please visit [our wiki](https://github.com/zehnergroup/apollo/wiki/So-you-want-to-use-Apollo-as-a-boilerplate%3F) for further instructions.

### Global

- [ ] Nav
  - [ ] Mobile nav
  - [ ] Search modal
  - [x] Mini cart `0.0.1`
- [ ] Footer
  - [x] Footer email signup  `0.0.1`
- [ ] Multiple Pages (carousel on mobile)
  - [ ] Two up
  - [ ] Three up
  - [ ] Mosaic

### Homepage

- [x] Split Hero `0.0.1`
- [x] Hero `0.0.1`
- [ ] Two up (carousel on mobile)
- [ ] Feature collections Three up (carousel on mobile)
- [ ] Full width hero
- [ ] Mosaic (carousel on mobile)
- [ ] Three up (carousel on mobile)
- [x] Instagram widget `0.0.1`

### Collections

- [ ] Hero
- [ ] Filters + sort by (custom functionality)
- [ ] Product thumbnail
- [ ] Load more (custom functionality)

### Product Page

- [x] image zoom `0.0.1`
- [x] thumbnail image switcher `0.0.1`
- [ ] Tabs for variants (men/women/kids)
- [ ] Accordion

### Static Pages

- [ ] Hero w/ description and/or CTA
- [ ] blockquotes
- [ ] media objects (used in 2/3-ups)
