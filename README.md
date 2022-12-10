# l-store-pages-liquidjs-plugin

For local development of store pages themes we use an implementation of Liquid template language for node/js named [LiquidJS](https://liquidjs.com/) and [BrowserSync](https://browsersync.io/) as the dev server. When themes are uploaded to the real Store Pages backend (Ruby) there are some custom Liquid tags and filters implemented that we need to reproduce in the local dev environment. For this purpose we have a common repository where those custom filters/tags and the middleware for let BrowserSync understand Liquid templates implemented as LiquidJS plugin.

[https://github.com/localistico/l-store-pages-liquidjs-plugin](https://github.com/localistico/l-store-pages-liquidjs-plugin)

Then, since our plugin is a NPM package but not in a public packages server, in those repos where we need to use the plugin/middleware, the package is inserted in the `package.json` as this (note that version is in semver format):

```
"dependencies": {
...
"l-store-pages-liquidjs-plugin": "https://github.com/localistico/l-store-pages-liquidjs-plugin.git#semver:3.2.3"
...
}
```

Each theme could be using different versions of the plugin (this only affects to what you can view in local, not at backend) so look for the [change log](https://github.com/localistico/l-store-pages-liquidjs-plugin/blob/master/CHANGELOG.md) to check the filter/tag available in that version.

**NOTE**: The only reason to need to modify code in this repo is because something new or different is implemented at the store pages backend.

**IMPORTANT NOTE**: LiquidJS is very bad with versioning (breaking changes in minor versions) so never upgrade LiquidJS version if not really needed.

---

## Install and run
---

Install dependencies with:

```
$ yarn install
```

Run tests:

```
$ yarn test
```

Run tests with watch:

```
$ yarn test-watch
```

