// eslint-disable-next-line no-useless-escape
module.exports.paramsRE = /([\w-]+)\s*=\s*(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*')|([\w\.-]+))/g
module.exports.keyParamsRE = /^([^\s]+)(.*)/
module.exports.pagesApiLocationsRE = /\/pages_api\/(.+)\/locations$/
module.exports.pagesApiLocationRE = /\/pages_api\/(.+)\/locations\/(\S)+/
