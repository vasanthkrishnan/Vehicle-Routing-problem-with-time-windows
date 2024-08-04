const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const GeneticAlgorithm = require('./geneticAlgorithm'); // Assuming GeneticAlgorithm class is in 'geneticAlgorithm.js'

const app = express();
const port = 3035;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Example vehicles with capacities
const vehicles = [
    { id: 1, capacity: 20 },
    { id: 2, capacity: 25 },
    { id: 3, capacity: 15 },
    { id: 4, capacity: 30 },
    { id: 5, capacity: 25 }
];

// Genetic Algorithm instance
app.post('/best-route', async (req, res) => {
    const customers = req.body.customers;
    const ga = new GeneticAlgorithm(customers, vehicles, 10, 100, 0.01);

    const routes = ga.run();
    const routesWithVehicleIds = routes.map(vehicleRoute => ({
        vehicleId: vehicleRoute.vehicleId,
        route: vehicleRoute.route.map(customer => ({
            id: customer.id,
            x: customer.x,
            y: customer.y
        }))
    }));

    const orsRoutes = await Promise.all(routesWithVehicleIds.map(async (vehicleRoute) => {
        const coordinates = vehicleRoute.route.map(customer => [customer.y, customer.x]);
        const response = await axios.post(
            'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
            {
                coordinates: coordinates
            },
            {
                headers: {
                    'Authorization': '5b3ce3597851110001cf624860c18f058bd442ab80c4762a8474a319', // Replace with your API key
                    'Content-Type': 'application/json'
                }
            }
        );
        return {
            vehicleId: vehicleRoute.vehicleId,
            route: vehicleRoute.route, // Keep the original customer route
            geoRoute: response.data.features[0].geometry.coordinates.map(coord => ({ x: coord[1], y: coord[0] }))
        };
    }));
    res.json(orsRoutes);
});
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
