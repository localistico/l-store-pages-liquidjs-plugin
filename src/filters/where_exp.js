const Liquid = require('liquidjs')

// Usage: {{ items | where_exp:"item","item.projects contains 'foo'" }}
const where_exp = function (input, variable, expression) {
  return input.filter(item => {
    const { liquid } = this
    const { options } = liquid
    const { operators, operatorsTrie } = options
    let obj = {}
    obj[variable] = item
    const ctx = new Liquid.Context(obj)
    const cond = new Liquid.Expression(
      expression,
      operators,
      operatorsTrie
    ).evaluate(ctx)
    return Liquid.isTruthy(cond, ctx)
  })
}

module.exports = where_exp
