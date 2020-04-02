// eslint-disable-next-line no-useless-escape
module.exports.paramsRE = /([\w-]+)\s*=\s*(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*')|([\w\.-]+))/g;
module.exports.keyParamsRE = /^([^\s]+)(.*)/;