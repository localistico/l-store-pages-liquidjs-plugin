// Usage: {% location_json_ld [location_id] %}
/**
 * {% location_json_ld location.id %}
{% location_json_ld location.id name='Example Name' type='ExampleType' description='my custom description' template_key='my-awesome-template' %}
 */
const path = require('path');
const fs = require('fs');

const paramsRE = require('./../constants/regexps').paramsRE;
const keyParamsRE = require('./../constants/regexps').keyParamsRE;

const DEFAULT_LOCATION_TYPE = 'LocalBusiness';

const location_json_ld = {
  // eslint-disable-next-line no-unused-vars
  parse: function(tagToken, remainTokens) {
    let match = keyParamsRE.exec(tagToken.args);
    this.location_id = match[1];
    this.params = match[2].trim();
  },
  // eslint-disable-next-line no-unused-vars
  render: async function(ctx, hash) {
    const templateFilepath = path.resolve(__dirname, './../templates/location-json-ld.liquid');
    let scope;

    // Check if JEST is the environment
    if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
      // Fill with mockup data
      const dataFilepath = `${ctx.opts.root[0]}/../data/store.json`;
      scope = JSON.parse(fs.readFileSync(dataFilepath), 'utf-8');
    } else {
      // Fetch current scope
      scope = ctx.pop();
    }

    // Override params
    scope.location.type = DEFAULT_LOCATION_TYPE;
    if (this.params) {
      let match;
      // eslint-disable-next-line no-cond-assign
      while (match = paramsRE.exec(this.params)) {
        let key = match[1];
        let value = match[3].replace(/^'/,'').replace(/'$/,'');

        switch (key) {

          case 'name':
            scope.location.name = value;
            break;

          case 'type':
            scope.location.type = value;
            break;

          case 'description':
            scope.location.description = value;
            break;

          case 'template_key':
            // TODO: ??
            break;

          default:
            break;
        }
      }
    }

    // Push the scope back to context
    ctx.push(scope);

    // Render and return
    const templates = await this.liquid.getTemplate(templateFilepath, ctx.opts.root);
    return await this.liquid.renderer.renderTemplates(templates, ctx);
  }
};

module.exports = location_json_ld;