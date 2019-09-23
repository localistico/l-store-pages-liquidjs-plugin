const DEFAULT_SNIPPETS_PATH = 'snippets';

const keyParamsRE = /^([^\s]+)(.*)/;
const paramsRE = /([\w-]+)\s*=\s*(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*')|([\w\.-]+))/g;

// Usage: {% snippet name params %}
const snippet = {
  parse: function(tagToken, remainTokens) {
    let match = keyParamsRE.exec(tagToken.args);
    this.key = match[1];
    this.params = match[2].trim();
  },
  render: async function(scope, hash) {
    try {
      const filepath = `${DEFAULT_SNIPPETS_PATH}/${this.key}${scope.opts.extname}`;
      let snippet = {};
      if (this.params) {
        let match;
        while (match = paramsRE.exec(this.params)) {
          snippet[match[1]] = await this.liquid.evalValue(match[2] || match[3] || match[4], scope);
        }
      }
      let ctx = {
        snippet
      };
      const templates = await this.liquid.getTemplate(filepath, scope.opts.root);
      scope.push(ctx);
      const html = await this.liquid.renderer.renderTemplates(templates, scope);
      scope.pop(ctx);
      return html;
    } catch(e) {
      console.log('Error caught:', e);
    }
  }
};

module.exports = snippet;