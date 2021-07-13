require('dotenv').config()
const { Client } = require('@googlemaps/google-maps-services-js');
const maps = new Client({});

const turf = require('@turf/turf');
const fences = require('../data/fences.json');

const params = {
  key: process.env.GOOGLE_API_KEY
};

module.exports = {
  async tags(locations) {
    const pickupPoint = turf.point(await this.getCoordinates(locations.storeAddress));
    const dropoffPoint = turf.point(await this.getCoordinates(locations.customerAddress));

    let tags = [];

    for (fence of fences) {
      const polygon = turf.polygon(fence.polygon);
      const collectionPickup = turf.pointsWithinPolygon(pickupPoint, polygon);
      const collectionDropoff = turf.pointsWithinPolygon(dropoffPoint, polygon);
      
      if(collectionPickup.features.length > 0 || collectionDropoff.features.length > 0) {
        tags.push({
          name: fence.name,
          textColor: fence.textColor,
          backgroundColor: fence.backgroundColor,
          type: fence.type
        })
      }
    }
    return tags
  },
  async getCoordinates(address) {
    params.address = address;
    const res = await maps.geocode({ params: params });

    return [
      res.data.results[0].geometry.location.lng,
      res.data.results[0].geometry.location.lat
    ];
  }
};
