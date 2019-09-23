const Liquid = require('liquidjs');

// Usage: {{ items | where_exp:"item","item.projects contains 'foo'" }}
const where_exp = function(input, variable, expression) {
  return input.filter((item) => {
    try {
      let obj = {};
      obj[variable] = item;
      const context = new Liquid.Context(obj);
      const cond = new Liquid.Expression(expression).evaluateSync(context);
      return Liquid.isTruthy(cond);
    } catch(e) {
      console.log('Error caught:', e);
    }
  });
};

module.exports = where_exp;