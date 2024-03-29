const path = require('path')
const utils = require('../utils')
const {
  pagesApiLocationRE,
  pagesApiLocationsRE,
} = require('./../constants/regexps')

/**
 * Templates Middleware
 * @param {string} themePath
 * @param {string} dataPath
 * @returns {Promise<Function>}
 */
exports.templatesMiddleware = (themePath, dataPath) => {
  const liquid = utils.getLiquidInstance(themePath)
  return async (req, res, next) => {
    try {
      const theme = utils.getThemeConfig(themePath)
      const templates = [...theme.templates]
      const url = new URL(req.url, 'http://127.0.0.1') // Base url is only for parsing url

      const { published_locales } = theme

      let currentLocale = theme.default_locale
      let isDefaultLocale = true

      published_locales.forEach(locale => {
        const localeUrlRegexp = new RegExp(`/(${locale}){1}(/|$)`, 'g')
        if (localeUrlRegexp.test(url.pathname)) {
          currentLocale = locale
          isDefaultLocale = false
        }
      })

      const urlPrefix = isDefaultLocale ? '' : `/${currentLocale}`

      // Index of templates (dev mode)
      if (
        (isDefaultLocale && url.pathname === '/') ||
        (!isDefaultLocale && url.pathname === `/${currentLocale}`)
      ) {
        res.end(
          await liquid.parseAndRender(utils.getUITemplate('index'), {
            templates,
            urlPrefix,
          })
        )
      }
      // Pages API Locations
      else if (url.pathname.match(pagesApiLocationsRE)) {
        utils.responseWithJsonFromFile(
          res,
          `${dataPath}/pages_api/locations.json`
        )
      }
      // Pages API Location
      else if (url.pathname.match(pagesApiLocationRE)) {
        utils.responseWithJsonFromFile(
          res,
          `${dataPath}/pages_api/location.json`
        )
      }
      // Theme templates
      else {
        const template = templates
          .filter(tpl => {
            const templateUrl = `/${
              !isDefaultLocale ? `${currentLocale}/` : ''
            }${tpl.key}`
            return templateUrl === url.pathname
          })
          .shift()
        if (template) {
          let data = utils.getParsedJsonFromFile(
            `${dataPath}/${template.type}.json`
          )
          data.theme_variables = theme.variables || {}
          data.published_locales =
            theme.published_locales.map(l => ({
              code: l,
              name: `Locale ${l.toUpperCase()} name`,
              url: `/${l}/${template.key}`,
            })) || []
          data.locale = currentLocale

          const html = await liquid.renderFile(
            path.join('templates', template.template),
            data,
            {
              globals: {
                locale: currentLocale,
                published_locales,
                urlPrefix,
              },
            }
          )
          res.setHeader('Content-Type', template.content_type)
          res.end(html)
        } else {
          next()
        }
      }
    } catch (errorDescription) {
      // eslint-disable-next-line require-atomic-updates
      res.statusCode = 500
      res.end(
        await liquid.parseAndRender(utils.getUITemplate('error'), {
          errorDescription,
        })
      )
    }
  }
}

/**
 * 404 Middleware
 * @param {string} themePath
 * @param {string} dataPath
 * @returns {Promise<Function>}
 */
exports.notFoundMiddleware = (themePath, dataPath) => {
  const liquid = utils.getLiquidInstance(themePath)
  return async (req, res) => {
    try {
      const data = utils.getParsedJsonFromFile(`${dataPath}/locator.json`)
      const html = await liquid.renderFile('404', data)
      res.setHeader('Content-Type', 'text/html')
      res.statusCode = 404
      res.end(html)
    } catch (errorDescription) {
      res.statusCode = 500
      res.end(
        await liquid.parseAndRender(utils.getUITemplate('error'), {
          errorDescription,
        })
      )
    }
  }
}
