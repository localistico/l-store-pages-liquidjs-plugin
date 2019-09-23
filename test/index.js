const Liquid = require("liquidjs");
const chai = require("chai");
const plugin = require("../src/index");

describe('plugin', function () {
  let liquid;
  before(function () {
    liquid = new Liquid.Liquid();
    liquid.plugin(plugin);
  });
  describe('asset_path', function () {
    it('should return asset_path', async function() {
      const html = await liquid.parseAndRender('{% asset_path favicon.png %}');
      chai.expect(html).to.equal('/assets/favicon.png');
    });
  });
});