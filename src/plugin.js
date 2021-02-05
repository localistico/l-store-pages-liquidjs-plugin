/**
 * l-store-pages-tags-and-filters plugin for LiquidJS
 *
 * How to use:
 *
 *    const Liquid = require('liquidjs');
 *    const engine = new Liquid.Liquid();
 *    engine.plugin(require('../plugins/l-store-pages-tags-and-filters').plugin);
 *
 */

module.exports = function () {
  // Tags
  this.registerTag('asset_path', require('./tags/asset_path'))
  this.registerTag('snippet', require('./tags/snippet'))
  this.registerTag('asset_content', require('./tags/asset_content'))
  this.registerTag('page_url', require('./tags/page_url'))
  this.registerTag('find_page_url', require('./tags/find_page_url'))
  this.registerTag('location_json_ld', require('./tags/location_json_ld'))

  // Filters
  this.registerFilter('group_by', require('./filters/group_by'))
  this.registerFilter('where', require('./filters/where'))
  this.registerFilter('where_exp', require('./filters/where_exp'))
  this.registerFilter('sort', require('./filters/sort'))
  this.registerFilter(
    'distance_to_human',
    require('./filters/distance_to_human')
  )
  this.registerFilter('json', require('./filters/json'))
}
