require('dotenv').config()
const { Client } = require('@googlemaps/google-maps-services-js');
const maps = new Client({});

const params = {
  traffic_model: 'best_guess',
  departure_time: 'now',
  units: 'imperial',
  key: process.env.GOOGLE_API_KEY
};

module.exports = {
  async route(locations) {
    params.origins = [
      `${locations.driverLatitude},${locations.driverLongitude}`,
      locations.storeAddress
    ];
    params.destinations = [locations.storeAddress, locations.customerAddress];

    const distance = await maps.distancematrix({ params: params });
    const driverToStore = distance.data.rows[0].elements[0];
    const storeToCustomer = distance.data.rows[1].elements[1];

    return {
      duration: (driverToStore['duration_in_traffic'].value + storeToCustomer['duration_in_traffic'].value) / 60.0,
      distance: (driverToStore.distance.value + storeToCustomer.distance.value) / 1609.34
    };
  }
};
