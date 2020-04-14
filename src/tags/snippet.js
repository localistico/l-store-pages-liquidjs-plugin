const DEFAULT_SNIPPETS_PATH = 'snippets';

const { paramsRE, keyParamsRE } = require('./../constants/regexps');

// Usage: {% snippet name params %}
const snippet = {
  // eslint-disable-next-line no-unused-vars
  parse: function(tagToken, remainTokens) {
    let match = keyParamsRE.exec(tagToken.args);
    this.key = match[1];
    this.params = match[2].trim();
  },
  // eslint-disable-next-line no-unused-vars
  render: async function(ctx, hash) {
    const filepath = `${DEFAULT_SNIPPETS_PATH}/${this.key}${ctx.opts.extname}`;
    let snippet = {};

    if (this.params) {
      let match;
      // eslint-disable-next-line no-cond-assign
      while (match = paramsRE.exec(this.params)) {
        snippet[match[1]] = await this.liquid.evalValue(match[2] || match[3] || match[4], ctx);
      }
    }
    let scope = {
      snippet
    };
    const templates = await this.liquid.getTemplate(filepath, ctx.opts.root);
    ctx.push(scope);
    const html = await this.liquid.renderer.renderTemplates(templates, scope);
    ctx.pop(scope);
    return html;
  }
};

module.exports = snippet;