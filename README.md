# Apollo

## Getting Started

- Install [Slate](https://shopify.github.io/slate/): `npm install -g @shopify/slate` (requires Node 6+)
- Clone the repo
- In the project directory, install dependences with `npm install`
- [Generate API credentials](https://help.shopify.com/api/getting-started/api-credentials#get-credentials-through-the-shopify-admin) for your local environment
- Rename `config-sample.yml` to `config.yml` and add your store information and private app credentials:
  - **store:** the Shopify-specific URL for this store/environment (ie. my-store.myshopify.com)
  - **theme_id:** the unique id for the theme you want to write to when deploying to this store. You can find this information in the URL of the theme's online editor at Shopify [admin/themes](https://shopify.com/admin/themes).
  - **password:** the password generated via a private app on this store.  Access this information on your Shopify [admin/apps/private](https://shopify.com/admin/apps/private) page.
- Run [Slate](https://shopify.github.io/slate/commands/)
  - `slate start [-e development,production][--manual]` - Runs build, deploy, then watcher
  - `slate watch [--env][--nosync]` — Runs watcher, then deploy
  - `slate deploy [--env][--manual]` - Builds `dist` folder and replaces the theme set in config.yml
  - `slate build` - creates a production-ready `dist` bundle

## Contributing

* Use [gitflow](https://github.com/nvie/gitflow/wiki/Installation) for naming your branches, ie. `feature/feature-name`
* Use meaningful naming conventions; use structural or purposeful names over presentational. These conventions are based on the [SUIT CSS framework](https://github.com/suitcss/suit/tree/master/doc);
* Use `js-` prefixed class names for elements being relied upon for javascript selectors
* Use `.u-` prefixed class names for single purpose utility classes
* Our components use **meaningful hypens** and **PascalCase**  and follow the `<ComponentName>[--modifierName|-descendantName]` pattern
* Use `.is-` prefixed classes for stateful classes (often toggled by javascript) like `.is-disabled`
* Use brand/design-specific style `$variables` located in `src/style/settings/variables.scss.liquid`

### Environments

- `dev`: Working code copy. Changes made by developers are deployed here so integration and features can be tested. This environment is rapidly updated and contains the most recent version of the application.
- `staging`: This is the release candidate, and normally a mirror of the production environment. The staging area contains the "next" version of the application and is used for final stress testing and client/manager approvals before going live.
- `production` This is the currently released version of the application, accessible to the client/end users. This version preferably does not change except for during scheduled releases.

### Directory Structure

```
└── src
    ├── config
    ├── layout
    ├── sections
    ├── snippets
    ├── styles
    │   ├── components
    │   ├── elements
    │   ├── global
    │   ├── modules
    │   ├── settings
    │   ├── theme.scss
    │   ├── tools
    │   └── vendor
    └── templates
           └──  customers
```
