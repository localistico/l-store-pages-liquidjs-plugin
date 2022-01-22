// Usage: {% content_for_head %}

const { getThemeConfig } = require('../utils')

const content_for_head = {
  // eslint-disable-next-line no-unused-vars
  parse: function (tagToken, remainTokens) {},
  // eslint-disable-next-line no-unused-vars
  render: function (ctx, hash) {
    const themeConfig = getThemeConfig(this.liquid.options.root[0])
    const { default_locale, published_locales } = themeConfig
    const result = ['<link rel="alternate" hreflang="x-default" href="/">']
    published_locales.forEach(locale => {
      result.push(
        `<link rel="alternate" hreflang="${locale}" href="${
          locale !== default_locale ? `/${locale}/` : '/'
        }">`
      )
    })
    return result.join('\n')
  },
}

module.exports = content_for_head
