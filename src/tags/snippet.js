const DEFAULT_SNIPPETS_PATH = 'snippets';

// eslint-disable-next-line no-useless-escape
const paramsRE = /([\w-]+)\s*=\s*(?:("[^"\\]*(?:\\.[^"\\]*)*")|('[^'\\]*(?:\\.[^'\\]*)*')|([\w\.-]+))/g;
const keyParamsRE = /^([^\s]+)(.*)/;

// Usage: {% snippet name params %}
const snippet = {
  // eslint-disable-next-line no-unused-vars
  parse: function(tagToken, remainTokens) {
    let match = keyParamsRE.exec(tagToken.args);
    this.key = match[1];
    this.params = match[2].trim();
  },
  // eslint-disable-next-line no-unused-vars
  render: async function(scope, hash) {
    const filepath = `${DEFAULT_SNIPPETS_PATH}/${this.key}${scope.opts.extname}`;
    let snippet = {};

    try {
      if (this.params) {
        let match;
        // eslint-disable-next-line no-cond-assign
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
      return 'Snippet render fails';
    }
  }
};

module.exports = snippet;