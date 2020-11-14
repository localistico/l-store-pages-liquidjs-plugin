const Liquid = require('liquidjs')

// Usage: {{ items | where_exp:"item","item.projects contains 'foo'" }}
const where_exp = function (input, variable, expression) {
  return input.filter(item => {
    let obj = {}
    obj[variable] = item
    const context = new Liquid.Context(obj)
    const cond = new Liquid.Expression(expression).evaluateSync(context)
    return Liquid.isTruthy(cond)
  })
}

module.exports = where_exp
