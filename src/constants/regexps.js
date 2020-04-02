module.exports.paramsRE = /([\w-]+)\s*=\s*(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*')|([\w\.-]+))/g;
module.exports.keyParamsRE = /^([^\s]+)(.*)/;