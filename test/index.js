const Liquid = require('liquidjs');
const chai = require('chai');
const plugin = require('../src/index');
const path = require('path');

chai.should();
const expect = chai.expect;

describe('l-store-liquidjs-plugin', function () {

  let liquid;
  before(function () {
    liquid = new Liquid.Liquid({
      root: path.resolve(__dirname, './stub/'),
      extname: '.liquid',
    });
    liquid.plugin(plugin);
  });

  it('should return function', async () => {
    expect(plugin).to.be.instanceof(Function)
  })

  describe('Tags', function () {
    describe('asset_content', function () {
      it('should not throw if file does not exist', async function () {
        (async function () {
          await liquid.parseAndRender('{% asset_content undefined.extension %}');
        }.should.not.throw());
      });
      it('should render the content of a css file', async function () {
        const html = await liquid.parseAndRender('{% asset_content style.css %}');
        expect(html).to.equal('h1 { color: red; }');
      });
      it('should render the content of a js file', async function () {
        const html = await liquid.parseAndRender('{% asset_content script.js %}');
        expect(html).to.equal('console.log(\'javascript works!\');');
      });
      it('should render the content of a svg file', async function () {
        const html = await liquid.parseAndRender('{% asset_content draw.svg %}');
        expect(html).to.equal('<svg></svg>');
      });
      it('should notice that the file has a not allowed extension', async function () {
        const html = await liquid.parseAndRender('{% asset_content pic.jpg %}');
        expect(html).to.equal('File extension not allowed for asset_content');
      });
      it('should notice that the file was not found', async function () {
        const html = await liquid.parseAndRender('{% asset_content unknown.css %}');
        expect(html).to.equal('Asset not found at assets/unknown.css');
      });
    });

    describe('asset_path', function () {
      it('should render a correct asset_path', async function () {
        const html = await liquid.parseAndRender('{% asset_path favicon.png %}');
        expect(html).to.equal('/assets/favicon.png');
      });
    });

    describe('page_url', function () {
      it('should render a correct page_url', async function () {
        const html = await liquid.parseAndRender('{% page_url store-locator %}');
        expect(html).to.equal('/store-locator');
      });
    });

    describe('snippet', function () {
      it('should not throw if snippet does not exist', async function () {
        (async function () {
          await liquid.parseAndRender('{% snippet missing %}');
        }.should.not.throw());
      });
      it('should notice when the snippet is not found', async function () {
        const html = await liquid.parseAndRender('{% snippet missing %}');
        expect(html).to.equal('Snippet render fails');
      });
      it('should render the snippet content', async function () {
        const html = await liquid.parseAndRender('{% snippet header %}');
        expect(html).to.equal('<h1>This is the header</h1>');
      });
    });
  });

  describe('Filters', function () {
    describe('sort', function () {
      it('should render sorted items', async function () {
        const items = [{
            distance: 3,
            name: 'three',
          },
          {
            distance: 1,
            name: 'one',
          },
          {
            distance: 2,
            name: 'two',
          },
        ];
        const html = await liquid.parseAndRender('{% assign sorted_items = items | sort:"distance" %}{% for item in sorted_items %}{{ item.name }}/{% endfor%}', {
          items
        });
        expect(html).to.equal('one/two/three/');
      });
    });

    describe('group_by', function () {
      it('should render grouped items', async function () {
        const items = [
          {
            name: 'john',
            city: 'madrid',
          },
          {
            name: 'peter',
            city: 'london',
          },
          {
            name: 'jose',
            city: 'málaga',
          },
          {
            name: 'celia',
            city: 'madrid',
          },
          {
            name: 'javi',
            city: 'soria',
          },
          {
            name: 'paco',
            city: 'madrid',
          },
        ];
        const html = await liquid.parseAndRender('{% assign grouped_items = items | group_by:"city" %}{% for group_item in grouped_items %}{{ group_item.name }}({% for item in group_item.items %}{{ item.name }}/{% endfor%}) - {% endfor%}', {
          items
        });
        expect(html).to.equal('madrid(john/celia/paco/) - london(peter/) - málaga(jose/) - soria(javi/) - ');
      });
    });

    describe('where', function () {
      it('should render filtered items by where', async function () {
        const items = [
          {
            name: 'john',
            city: 'madrid',
          },
          {
            name: 'peter',
            city: 'london',
          },
          {
            name: 'jose',
            city: 'málaga',
          },
          {
            name: 'celia',
            city: 'madrid',
          },
          {
            name: 'javi',
            city: 'soria',
          },
          {
            name: 'paco',
            city: 'madrid',
          },
        ];
        const html = await liquid.parseAndRender('{% assign filtered_items = items | where:"city","madrid" %}{% for item in filtered_items %}{{ item.name }}/{% endfor%}', {
          items
        });
        expect(html).to.equal('john/celia/paco/');
      });
    });

    describe('where_exp', function () {
      it('should render filtered items by where_exp', async function () {
        const items = [
          {
            city: 'madrid',
            distance: 0,
          },
          {
            city: 'london',
            distance: 1000,
          },
          {
            city: 'málaga',
            distance: 1,
          },
          {
            city: 'barcelona',
            distance: 8,
          },
          {
            city: 'soria',
            distance: 9,
          },
          {
            city: 'newyork',
            distance: 33,
          },
        ];
        const html = await liquid.parseAndRender('{% assign filtered_items = items | where_exp:"item","item.distance > 0"  | where_exp:"item","item.distance < 10" %}{% for item in filtered_items %}{{ item.city }}/{% endfor%}', {
          items
        });
        expect(html).to.equal('málaga/barcelona/soria/');
      });
    });



  });
});