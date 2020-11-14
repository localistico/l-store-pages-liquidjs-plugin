// Usage: {{ items | sort:"distance" }}
const sort = function (input, property) {
  if (property) {
    input.sort((a, b) => {
      if (a[property] > b[property]) {
        return 1
      }
      if (a[property] < b[property]) {
        return -1
      }
      return 0
    })
    return input
  } else {
    return input.sort()
  }
}

module.exports = sort
