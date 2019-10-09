/**
 * l-store-pages-tags-and-filters plugin for LiquidJS
 *
 * How to use:
 *
 *    const Liquid = require('liquidjs');
 *    const engine = new Liquid.Liquid();
 *    engine.plugin(require('../plugins/l-store-pages-tags-and-filters'));
 *
 */

 module.exports = function() {

  // Tags
  this.registerTag('asset_path',         require('./tags/asset_path'));
  this.registerTag('snippet',            require('./tags/snippet'));
  this.registerTag('asset_content',      require('./tags/asset_content'));
  this.registerTag('page_url',           require('./tags/page_url'));

  // Filters
  this.registerFilter('group_by',        require('./filters/group_by'));
  this.registerFilter('where',           require('./filters/where'));
  this.registerFilter('where_exp',       require('./filters/where_exp'));
  this.registerFilter('sort',            require('./filters/sort'));
}