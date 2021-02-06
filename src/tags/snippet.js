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
  render: function* (ctx, emitter) {
    const { liquid, params } = this
    const { renderer } = liquid

    const theme_snippet_filepath = `${DEFAULT_SNIPPETS_PATH}/${this.key}${ctx.opts.extname}`
    const remote_snippet_filepath = `${DEFAULT_REMOTE_SNIPPETS_PATH}/${this.key}${ctx.opts.extname}`
    const existRemoteSnippet = fs.existsSync(
      `${ctx.opts.root}/${remote_snippet_filepath}`
    )
    const snippet_filepath_to_render = existRemoteSnippet
      ? remote_snippet_filepath
      : theme_snippet_filepath

    let snippet = {}

    if (params) {
      let match
      // eslint-disable-next-line no-cond-assign
      while ((match = paramsRE.exec(params))) {
        snippet[match[1]] = liquid.evalValueSync(
          match[2] || match[3] || match[4],
          ctx
        )
      }
    }
    let scope = { snippet }
    const templates = liquid.parseFileSync(
      snippet_filepath_to_render,
      ctx.opts.root
    )
    ctx.push(scope)
    yield renderer.renderTemplates(templates, ctx, emitter)
    ctx.pop(scope)
  },
}

module.exports = snippet
