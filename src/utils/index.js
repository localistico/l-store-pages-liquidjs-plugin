const path = require('path')
const fs = require('fs')
const { Liquid } = require('liquidjs')
const storePagesLiquidPlugin = require('../plugin')

const TEMPLATE_EXTNAME = '.liquid'

/**
 * Returns a instance of liquid engine for the themepath
 * @param {string} themePath
 */
exports.getLiquidInstance = themePath => {
  // Init the liquid engine
  const liquid = new Liquid({
    root: themePath,
    extname: TEMPLATE_EXTNAME,
  })
  // Add store pages tags and filters
  liquid.plugin(storePagesLiquidPlugin)
  return liquid
}

/**
 * Returns template content from the UI folder
 * @param {string} templateName
 */
exports.getUITemplate = templateName => {
  const templatePath = path.resolve(
    __dirname,
    `../server/ui-templates/${templateName}${TEMPLATE_EXTNAME}`
  )
  return fs.readFileSync(templatePath, 'utf-8')
}

/**
 * Returns the theme.json config file from theme folder
 * @param {string} themePath
 */
exports.getThemeConfig = themePath => {
  const themeConfigFilepath = path.join(themePath, 'theme.json')
  return JSON.parse(fs.readFileSync(themeConfigFilepath, 'utf-8'))
}

/**
 * Returns JSON from data file
 * @param {string} dataFilepath
 */
exports.getParsedJsonFromFile = dataFilepath => {
  return JSON.parse(fs.readFileSync(dataFilepath), 'utf-8')
}

/**
 * Response with the content of JSON file
 * @param {httpResponse} res
 * @param {string} dataFilepath
 */
exports.responseWithJsonFromFile = (res, dataFilepath) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(fs.readFileSync(dataFilepath))
}

/**
 * Returns a flatten version of the object tree
 * @param {object} target Object
 * @returns
 */
exports.flatten = target => {
  const output = {}

  function step(object, prev) {
    Object.keys(object).forEach(function (key) {
      const value = object[key]
      const isarray = Array.isArray(value)
      const type = Object.prototype.toString.call(value)
      const isobject = type === '[object Object]' || type === '[object Array]'

      const newKey = prev ? prev + '.' + key : key

      if (!isarray && isobject && Object.keys(value).length) {
        return step(value, newKey)
      }

      output[newKey] = value
    })
  }

  step(target)

  return output
}
