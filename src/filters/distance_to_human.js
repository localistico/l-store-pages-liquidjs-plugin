// Usage: {{ distance | distance_to_human }}
const distance_to_human = function (distance) {
  return distance < 1000
    ? `${distance.toFixed(0)} m`
    : `${(distance / 1000).toFixed(1)} km`
}

module.exports = distance_to_human
