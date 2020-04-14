const DEFAULT_ASSETS_CONTENT_PATH = 'assets';
const ALLOWED_FILE_EXT = ['.css', '.js', '.svg'];

const fs = require('fs');
const path = require('path');

// Usage: {% asset_content name %}
const asset_content = {
  // eslint-disable-next-line no-unused-vars
  parse: function(tagToken, remainTokens) {
    this.str = tagToken.args; // name
  },
  // eslint-disable-next-line no-unused-vars
  render: async function(ctx, hash) {
    const extname = path.extname(this.str);
    const assets_content_path = ctx.environments.assets_content_path || DEFAULT_ASSETS_CONTENT_PATH;
    const filepath = `${ctx.opts.root[0]}/${assets_content_path}/${this.str}`;
    if (ALLOWED_FILE_EXT.includes(extname)) {
      return fs.readFileSync(filepath);
    } else {
      throw Error(`File extension "${extname}" not allowed for asset_content`);
    }
  }
};

module.exports = asset_content;