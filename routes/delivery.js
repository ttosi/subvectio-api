const routes = require('express').Router();
const mapService = require('../services/mapService');
const geofenceService = require('../services/geofenceService');
const authService = require('../services/authService');

routes.use(async (req, res, next) => {
  if (!(await authService.authorize(req.headers['token'])))
    return res.status(403).send();
  next();
});

routes.get('/', async (req, res) => {
  res.status(200).json({ error: 'not implemented' });
});

routes.post('/', async (req, res) => {
  console.log(`request -- ${req.body.driverLatitude}`)
  console.log(`request -- ${req.body.driverLongitude}`)
  console.log(`request -- ${req.body.storeAddress}`)
  console.log(`request -- ${req.body.customerAddress}`)

  const data = await Promise.all([
    mapService.route(req.body),
    geofenceService.tags(req.body)
  ])
  
  const delivery = {
    ...data[0],
    tags: data[1]
  };

  console.log(delivery)

  // Geotags names:
  //   avoid at night
  //   sketchy
  //   good tips
  //   bad tips
  //   campus
  //   downtown
  //   southside

  res.status(200).send(delivery);
});

module.exports = routes;
