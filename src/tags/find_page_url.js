// Usage: {% find_page_url template_name model %}
const find_page_url = {
  // eslint-disable-next-line no-unused-vars
  parse: function (tagToken, remainTokens) {
    this.name = tagToken.args.split(' ')[0] // template_name
    this.model = tagToken.args.split(' ')[1] // model
  },
  // eslint-disable-next-line no-unused-vars
  render: function (ctx, hash) {
    return `/${this.name}`
  },
}

module.exports = find_page_url
