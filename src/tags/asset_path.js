const DEFAULT_ASSETS_BASE_URL = '/assets';

// Usage: {% asset_path path %}
const asset_path = {
  // eslint-disable-next-line no-unused-vars
  parse: function(tagToken, remainTokens) {
    this.str = tagToken.args; // name
  },
  // eslint-disable-next-line no-unused-vars
  render: function(scope, hash) {
    const assets_path = scope.environments.assets_base_url || DEFAULT_ASSETS_BASE_URL;
    return `${assets_path}/${this.str}`;
  }
};

module.exports = asset_path;