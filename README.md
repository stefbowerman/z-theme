![ZG](https://i.imgur.com/KBnzMey.png)

# Z-Theme

Z-Theme is a boilerplate Shopify theme built on top of [Slate](https://shopify.github.io/slate/).

> Slate is a theme scaffold and command line tool for developing Shopify themes. It is designed to assist your development workflow and speed up the process of developing, testing, and deploying themes to Shopify stores.
>
> It allows you to sync local files with your live shop, deploy to multiple environments at the same time, and organize stylesheets and scripts in a flexible way.

For full Slate API documentation, go check out their [API docs](https://shopify.github.io/slate/).

### Quick Links
- Production: [ `shopify_url` ]
- Staging:  [ `shopify_url` ]
- Dev:  [ `shopify_url` ]
- Dev 1:  [ `shopify_url` ]
- Dev 2:  [ `shopify_url` ]

---

## Getting Started

- Install Slate: `npm install -g @shopify/slate`
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
slate zip # Creates a zip file for manually uploading your theme
```

### NPM Scripts

```bash
npm run jshint # Runs code linter on JS files
```
