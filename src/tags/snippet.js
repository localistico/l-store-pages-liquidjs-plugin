const fs = require('fs')

const DEFAULT_SNIPPETS_PATH = 'snippets'
const DEFAULT_REMOTE_SNIPPETS_PATH = 'remote_snippets'

const { paramsRE, keyParamsRE } = require('./../constants/regexps')

// Usage: {% snippet name params %}
const snippet = {
  // eslint-disable-next-line no-unused-vars
  parse: function (tagToken, remainTokens) {
    let match = keyParamsRE.exec(tagToken.args)
    this.key = match[1]
    this.params = match[2].trim()
  },
  // eslint-disable-next-line no-unused-vars
  render: async function (ctx, hash) {
    const theme_snippet_filepath = `${DEFAULT_SNIPPETS_PATH}/${this.key}${ctx.opts.extname}`
    const remote_snippet_filepath = `${ctx.opts.root}/${DEFAULT_REMOTE_SNIPPETS_PATH}/${this.key}${ctx.opts.extname}`

    const snippet_filepath_to_render = fs.existsSync(remote_snippet_filepath)
      ? remote_snippet_filepath
      : theme_snippet_filepath

    let snippet = {}

    if (this.params) {
      let match
      // eslint-disable-next-line no-cond-assign
      while ((match = paramsRE.exec(this.params))) {
        snippet[match[1]] = await this.liquid.evalValue(
          match[2] || match[3] || match[4],
          ctx
        )
      }
    }
    let scope = {
      snippet,
    }
    const templates = await this.liquid.getTemplate(
      snippet_filepath_to_render,
      ctx.opts.root
    )
    ctx.push(scope)
    const html = await this.liquid.renderer.renderTemplates(templates, ctx)
    ctx.pop(scope)
    return html
  },
}

module.exports = snippet
