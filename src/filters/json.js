// Usage: {{ object | json }}
const json = function (obj) {
  return JSON.stringify(obj)
}

module.exports = json
