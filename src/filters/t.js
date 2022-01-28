// Usage: {{ 'path.to.string' | t }}
// Usage: {{ 'path.to.string' | t: var1: variable, var2: "string" }}
const { getThemeConfig, getParsedJsonFromFile, flatten } = require('../utils')

const t = async function (input, ...args) {
  // Convert array to object
  const context = args.reduce((previousValue, currentValue) => {
    let [key, value] = currentValue
    return {
      ...previousValue,
      [key]: value,
    }
  }, {})

  const themeConfig = getThemeConfig(this.liquid.options.root[0])
  const { default_locale } = themeConfig

  const locale = this.context.environments.locale || default_locale

  const localeFilePath = `${this.liquid.options.root[0]}/locales/${locale}.json`

  // eslint-disable-next-line no-unused-vars
  const localeFile = flatten(getParsedJsonFromFile(localeFilePath))

  try {
    return await this.liquid.parseAndRenderSync(localeFile[input], context)
  } catch (error) {
    return `STRING WITH ID '${input}' NOT FOUND IN LOCALE FILE`
  }
}

module.exports = t
