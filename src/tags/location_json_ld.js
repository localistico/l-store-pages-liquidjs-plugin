// Usage: {% location_json_ld [location_id] %}
/**
 * {% location_json_ld location.id %}
 * {% location_json_ld location.id name='Example Name' type='ExampleType' description='my custom description' template_key='my-awesome-template' %}
 */
const { paramsRE, keyParamsRE } = require('./../constants/regexps');

const DAYS = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday'
};

const location_json_ld = {
  // eslint-disable-next-line no-unused-vars
  parse: function(tagToken, remainTokens) {
    this.params = {};
    let match = keyParamsRE.exec(tagToken.args);
    this.location_id = match[1];
    const additionalParams = match[2].trim();
    if (additionalParams) {
      let match;
      // eslint-disable-next-line no-cond-assign
      while (match = paramsRE.exec(additionalParams)) {
        let key = match[1];
        let value = match[3].replace(/^'/,'').replace(/'$/,'');
        this.params[key] = value;
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  render: async function(ctx, hash) {
    const engine = this.liquid;
    const business = ctx.get('business');
    const location = ctx.get('location');

    return JSON.stringify({
      '@context': 'http://schema.org',
      '@id': formatLocationUrl(location, this.params['template_key'] || 'store-page', engine ),
      '@type': this.params['type'] || 'LocalBusiness',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': escapeAndStrip(location.street_address, engine),
        'postalCode': escapeAndStrip(location.postcode, engine),
        'addressLocality': escapeAndStrip(location.locality, engine),
        'addressRegion': escapeAndStrip(location.region, engine),
        'addressCountry': escapeAndStrip(location.country_code, engine),
      },
      'identifier': location.id,
      'name': escapeAndStrip(this.params['name'] || location.name, engine),
      'image': locationImage(location, business),
      'telephone': escapeAndStrip(location.phone, engine),
      'description': formatLocationDescription(location, this.params['description'], engine),
      'url': formatLocationUrl(location, this.params['template_key'] || 'store-page', engine ),
      'openingHoursSpecification': formatOpeningHours(location),
      'sameAs': formatLocationLinks(location),
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': `${location.lat}`,
        'longitude': `${location.lng}`,
      }
    });
  }
};

function formatLocationUrl(location, template_key = 'store-page', engine) {
  return engine.parseAndRenderSync(`{% page_url ${template_key} location.id %}`)
}

function formatLocationDescription(location, description, engine) {
   const desc = description || location.short_summary || location.summary || '';
   return engine.parseAndRenderSync(`{{ "${desc}" | newline_to_br | strip_newlines | replace: '<br /><br />', ' ' | replace: '<br />', ' ' | strip_html | escape | strip }}`);
}

function formatLocationLinks(location) {
  let links = location.links || [];
  return links
          .filter(link => link.owned && link.platform !== 'store_pages')
          .map(link => link.url);
}

function locationImage(location, business) {
  const images = location.images || [];
  const image = images.find((image) => image.role === 'main') || business.logo;
  return image.original || '';
}

function formatOpeningHours(location){
  let openingHours = [];
  for (const day in location.hours) {
    location.hours[day].map((range) => {
      openingHours.push({
        "@type": 'OpeningHoursSpecification',
        "dayOfWeek": DAYS[day],
        "opens": range['from'],
        "closes": range['to']
      });
    });
  }
  return openingHours;
}

function escapeAndStrip(str, engine) {
  const strToRender = str || '';
  return engine.parseAndRenderSync(`{{ "${strToRender}" | escape | strip }}`);
}

module.exports = location_json_ld;