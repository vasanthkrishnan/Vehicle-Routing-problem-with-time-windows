const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/solve-vrptw', (req, res) => {
    // Your VRPTW solving logic here
    res.json({
        routes: [[0, 1, 2], [3, 4, 5]], // Example data
        totalDistances: [20, 30], // Example data
        remainingCapacities: [5, 4] // Example data
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
