// Usage: {{ items | where:"graduation_year","2014" }}
// Converts a JSON string to JSON object
// Example:
// {% capture json_string %}
//   [
//     {"id":"12345","email":"foo@bar.baz"},
//     {"id":"67890","email":"bar@baz.qux"}
//   ]
// {% endcapture %}
// {% assign json_objects = json_string | parse_json %}
// {{ json_objects | map: "email" | join: ", " }}

const parse_json = function (input) {
  return JSON.parse(input)
}

module.exports = parse_json
