const DEFAULT_ASSETS_CONTENT_PATH = 'app/assets';
const ALLOWED_FILE_EXT = ['.css', '.js', '.svg'];

// Usage: {% asset_content name %}
const asset_content = {
  parse: function(tagToken, remainTokens) {
    this.str = tagToken.args; // name
  },
  render: async function(scope, hash) {
    const path = require('path');
    const extname = path.extname(this.str);
    const assets_content_path = scope.environments.assets_content_path || DEFAULT_ASSETS_CONTENT_PATH;
    if (ALLOWED_FILE_EXT.includes(extname)) {
      const filepath = path.join(scope.opts.root[0], assets_content_path, this.str);
      const content = this.liquid.fs.readFileSync(filepath);
      return content;
    } else {
      return `Asset not found at ${assets_content_path}/${this.str}`;
    }
  }
};

module.exports = asset_content;