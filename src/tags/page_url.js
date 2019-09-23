// Usage: {% page_url name [location] %}
const page_url = {
  parse: function(tagToken, remainTokens) {
    this.name = tagToken.args.split(' ')[0]; // name
    this.model = tagToken.args.split(' ')[1]; // model
  },
  render: function(scope, hash) {
    return `/${this.name}`;
  }
};

module.exports = page_url;