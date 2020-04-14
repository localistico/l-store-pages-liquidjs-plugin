// Usage: {% page_url name [location] %}
const page_url = {
  // eslint-disable-next-line no-unused-vars
  parse: function(tagToken, remainTokens) {
    this.name = tagToken.args.split(' ')[0]; // name
    this.model = tagToken.args.split(' ')[1]; // model
  },
  // eslint-disable-next-line no-unused-vars
  render: function(ctx, hash) {
    return `/${this.name}`;
  }
};

module.exports = page_url;