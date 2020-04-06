const Liquid = require('liquidjs');
const plugin = require('../src/index');
const path = require('path');
const fs = require('fs');

let liquid;
beforeAll(function () {
  liquid = new Liquid.Liquid({
    root: path.resolve(__dirname, './stub'),
    extname: '.liquid',
  });
  liquid.plugin(plugin);
});

test('should return function', async () => {
  expect(plugin).toBeInstanceOf(Function)
})

describe('Tags', () => {
  describe('asset_content', () => {
    test('asset_content should render the content of a css file', async () => {
      const html = await liquid.parseAndRender('{% asset_content style.css %}');
      expect(html).toBe('h1 { color: red; }');
    });
    test('asset_content should render the content of a js file', async () => {
      const html = await liquid.parseAndRender('{% asset_content script.js %}');
      expect(html).toBe('console.log(\'javascript works!\');');
    });
    test('asset_content should render the content of a svg file', async () => {
      const html = await liquid.parseAndRender('{% asset_content draw.svg %}');
      expect(html).toBe('<svg></svg>');
    });
    test('should throw that file has a not allowed extension', async function () {
      expect(liquid.parseAndRender('{% asset_content pic.jpg %}'))
        .rejects.toThrow();
    });
    test('should throw that the file was not found', async function () {
      expect(liquid.parseAndRender('{% asset_content unknown.css %}'))
        .rejects.toThrow();
    });
  });

  describe('asset_path', () => {
    test('should render a correct asset_path', async () => {
      const html = await liquid.parseAndRender('{% asset_path draw.svg %}');
      expect(html).toBe('/assets/draw.svg');
    });
    test('should throw that the asset file was not found', async function () {
      expect(liquid.parseAndRender('{% asset_content unknown.css %}'))
        .rejects.toThrow();
    });
  });

  describe('page_url', () => {
    test('should render a correct page_url', async () => {
      const html = await liquid.parseAndRender('{% page_url store-locator %}');
      expect(html).toBe('/store-locator');
    });
  });

  describe('snippet', function () {
    test('should render the snippet content', async function () {
      const html = await liquid.parseAndRender('{% snippet header %}');
      expect(html).toBe('<h1>This is the header</h1>');
    });
    test('should throw if snippet does not exist', async function () {
      expect(liquid.parseAndRender('{% snippet missing %}'))
        .rejects.toThrow();
    });
  });

  describe('location_json_ld', function () {
    let scope;

    beforeEach(() => {
      scope = JSON.parse(fs.readFileSync(path.resolve(__dirname, './data/store.json')), 'utf-8');
    });

    test('should render the jsonld content', async function () {
      const jsonldMockup = JSON.parse(fs.readFileSync(path.resolve(__dirname, './stub/location-json-ld.json')), 'utf-8');
      const jsonld = JSON.parse(await liquid.parseAndRender('{% location_json_ld location.id %}', scope));
      expect(jsonld).toStrictEqual(jsonldMockup);
    });

    test('should render the jsonld content overriding params', async function () {
      const jsonldMockup = JSON.parse(fs.readFileSync(path.resolve(__dirname, './stub/location-json-ld-with-params.json')), 'utf-8');
      const jsonld = JSON.parse(await liquid.parseAndRender('{% location_json_ld location.id  name=\'Example Name\' type=\'ExampleType\' description=\'my custom description\' template_key=\'my-awesome-template\' %}', scope));
      expect(jsonld).toStrictEqual(jsonldMockup);
    });

  });
});

describe('Filters', () => {
  describe('sort', () => {
    test('should render sorted items', async () => {
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
      expect(html).toBe('one/two/three/');
    });
  });

  describe('group_by', () => {
    test('should render grouped items', async () => {
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
      expect(html).toBe('madrid(john/celia/paco/) - london(peter/) - málaga(jose/) - soria(javi/) - ');
    });
  });

  describe('where', () => {
    test('should render filtered items by where', async () => {
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
      expect(html).toBe('john/celia/paco/');
    });
  });

  describe('where_exp', () => {
    test('should render filtered items by where_exp', async () => {
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
      expect(html).toBe('málaga/barcelona/soria/');
    });
  });
});