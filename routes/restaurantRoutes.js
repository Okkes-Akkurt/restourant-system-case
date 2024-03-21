const express = require('express');
const router = express.Router();
const restaurantController = require('../controller/restaurantController.js');


router.get('/', restaurantController.getAllRestaurants);

router.post('/', restaurantController.createRestaurant);

router.get('/:id', restaurantController.getRestaurantDetails);

module.exports = router;
