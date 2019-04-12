![ZG](https://i.imgur.com/KBnzMey.png)

# Z-Theme

Z-Theme is a boilerplate Shopify theme built on top of [Slate](https://shopify.github.io/slate/).

## Getting Started

- After creating your new repo, clone [Z-Theme](https://github.com/zehnergroup/z-theme/wiki/Cloning-Z-Theme)
- In `package.json` rename `Z-Theme` to appropriate name
- Setup the `.editorconfig` [plug-in](https://editorconfig.org/#download) for your editor/IDE
- Install Slate: `npm install -g @shopify/slate`
- In the project directory, install dependences with `npm install`
- Setup your shopify dev store
- [Generate API credentials](https://help.shopify.com/api/getting-started/api-credentials#get-credentials-through-the-shopify-admin) for your local environment
- Rename `config-sample.yml` to `config.yml` and add your store information and private app credentials:
  - **store:** the Shopify-specific URL for this store/environment (ie. my-store.myshopify.com)
  - **theme_id:** the unique id for the theme you want to write to when deploying to this store. You can find this information in the URL of the theme's online editor at Shopify [admin/themes](https://shopify.com/admin/themes).
  - **password:** the password generated via a private app on this store.  Access this information on your Shopify [admin/apps/private](https://shopify.com/admin/apps/private) page.
- Follow Z-Theme [dev prep guide](https://github.com/zehnergroup/z-theme/wiki/Dev-Prep-Guide)

### [Slate Commands](https://shopify.github.io/slate/commands/)

```bash
slate start [-e][-m] # Runs build, deploy, then watcher
slate watch [-e][-n] # Runs watcher, then deploy
slate deploy [-e][-m] # Builds `dist` folder and replaces the theme set in config.yml
slate build # Creates a production-ready `dist` bundle
slate zip # Creates a zip file for manually uploading your theme
slate -h # Help
```

### NPM Scripts

```bash
npm run start # Installs Slate globally and locally to start working on any project.
npm run hooks # Installs a Git Hook that prevents branch changes without stopping the watcher (sets a touch -a to the config.yml to force the watcher stop)
npm run start-dev # Runs the `gulp start` task which runs all gulp tasks and then starts a watcher
npm run build # Runs the `gulp build` task which compiles scss and javascript in production mode (minification enabled)
```

### Gulp Tasks

All gulp tasks can be found in the `gulp/tasks` directory.  You can run them independently at any time with `gulp {{ task_name }}`.

### Underscored Directories

This project uses Slate behind the scenes to handle file changes and uploads.  It comes with a watcher that watches over files inside of two specific source directories titles `styles` and `scripts`.  This watcher runs a task every time files are changed that re-compiles any top-level files and moves them into the `dist` directory for uploading.  This works well except for the fact that it compiles and uploads _all_ of those top level files each time anything changes.  For example, because we have 4 JS files, this means we have to wait for 4 files to upload everytime we make a change to one.  To get around this, we put our styles and scripts in directories with _underscore prefixes_ and hook them up to our own gulp watch task that compiles and outputs them directly to the `dist/assets` directory (which uploads single files on change).

### Additional documentation

- For script documentation, please see the README file inside `src/_scripts`
- See the [wiki](https://github.com/zehnergroup/z-theme/wiki) for more general information related to the project, as well as any gotchas or engineering recipes.

## Theme Features

Use this area of the readme to document anything specific related to the theme's interaction with products, collection, blogs, settings, etc.

### Product

##### Metafields
| Namespace | Key | Description |
|---|---|---|
| `namespace_here` | `key_here` | Description of what should go in this metafield and how it is used. |

##### Tags

| Value | Effect |
|---|---|
| Tag Name | Description of tag and how it is used |

### CMS Pages

The following pages utilize the CMS page schema and renderer.  Any time changes are made to the schema, make sure to update the schemas on all of the following sections to ensure the full suite of modules is always available.

- `page-cms.liquid`

### Checkout Additional Scripts

Since additional checkout scripts are saved in a textarea inside the checkout admin settings, they do not have versioning and are liable to be modified or removed at any time.  As a precaution, try to store the most up to date version of these scripts inside the snippet `_checkout-additional-scripts.liquid`.  This file doesn't get included on the site anywhere but is the only way to keep this content in version control.
