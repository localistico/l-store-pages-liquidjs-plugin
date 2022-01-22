// Usage: {{ 'path.to.string' | t }}
const { getThemeConfig, getParsedJsonFromFile } = require('../utils')

const t = function (input) {
  const themeConfig = getThemeConfig(this.liquid.options.root[0])
  const { default_locale } = themeConfig
  const localeFilePath = `${this.liquid.options.root[0]}/locales/${default_locale}.json`
  // eslint-disable-next-line no-unused-vars
  const localeFile = getParsedJsonFromFile(localeFilePath)
  const evalLine = `localeFile['${input.split('.').join("']['")}']`

  try {
    return eval(evalLine)
  } catch (error) {
    return `STRING WITH ID '${input}' NOT FOUND IN LOCALE FILE`
  }
}

module.exports = t
