// Converts a CSV string to an Array object
//
// Example:
// {% capture csv_string %}
//   Order Name,Order ID,Order Date
//   1234,1234567890,2021/03/23
//   1235,1234567891,2021/03/24
// {% endcapture %}
// {% assign csv_rows = csv_string | parse_csv %}

const parse = require('csv-parse/lib/sync')

const parse_csv = function (input, options = []) {
  const [headers, headersValue] = options
  const enableHeaders =
    (headers && headers === 'headers' && headersValue) || false
  return parse(input, {
    columns: enableHeaders,
    trim: true,
    skip_empty_lines: true,
  })
}

module.exports = parse_csv
