// Usage: {{ items | where:"graduation_year","2014" }}
const where = function (input, property, value) {
  return input.filter(item => item[property] === value)
}

module.exports = where
