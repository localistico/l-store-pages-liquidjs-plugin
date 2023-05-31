/*
  Usage: {{ "The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?" | replace_with_regex: "/Dog/", "g" "Cat" }}
  Params:
  * input <String>: text to be evaluated and replaced. Required
  * regex <String>: regex (in string form) without flags to use in the regex. Required
  * regex_flags <String>: flags for the regex. Can be empty. Required
  * text_replacement <String>: text to be replaced for found expressions. Can be empty to remove the text. Required
*/

const replace_with_regex = function (
  input = '',
  regex = '',
  regex_flags = '',
  text_replacement = ''
) {
  const re = new RegExp(regex, regex_flags)
  return input.replace(re, text_replacement)
}

module.exports = replace_with_regex
