document.addEventListener('DOMContentLoaded', () => {

    // Generate form button click handler
    document.getElementById('generateFormBtn').addEventListener('click', () => {
        const numCustomers = document.getElementById('numCustomer').value;
        const customerInputs = document.getElementById('customerInputs');
        customerInputs.innerHTML = '';
        
        // Generate input fields for each customer
        for (let i = 0; i < numCustomers; i++) {
            customerInputs.innerHTML += `
                <div class="col-12 col-sm-6">
                    <h4>Customer ${i + 1}</h4>
                    <input type="number" id="lat${i}" class="form-control" placeholder="Latitude" style="height: 55px;">
                    <input type="number" id="lng${i}" class="form-control" placeholder="Longitude" style="height: 55px;">
                    <input type="number" id="demand${i}" class="form-control" placeholder="Demand" style="height: 55px;">
                    <input type="time" id="startTime${i}" class="form-control" placeholder="Start Time" style="height: 55px;">
                    <input type="time" id="endTime${i}" class="form-control" placeholder="End Time" style="height: 55px;">
                </div>
            `;
        }
        document.getElementById('CustomerForm').style.display = 'block'; // Show the form
    });

    // Solve button click handler
    document.getElementById('solveBtn').addEventListener('click', () => {
        const numCustomers = document.getElementById('numCustomer').value;
        const customers = [];

        // Collect customer data from form inputs
        for (let i = 0; i < numCustomers; i++) {
            const lat = document.getElementById(`lat${i}`).value;
            const lng = document.getElementById(`lng${i}`).value;
            const demand = document.getElementById(`demand${i}`).value;
            const startTime = document.getElementById(`startTime${i}`).value;
            const endTime = document.getElementById(`endTime${i}`).value;
            customers.push({ id: i + 2, x: parseFloat(lat), y: parseFloat(lng), demand: parseInt(demand), startTime, endTime });
        }

        // Add depot at the start (hardcoded for Chennai)
        customers.unshift({ id: 1, x: 13.0827, y: 80.2707, demand: 0, startTime: "00:00", endTime: "23:59" });

        // Send POST request to server to solve VRPTW
        fetch('http://localhost:3035/best-route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customers })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(routes => {
            // Initialize Leaflet map centered around Chennai
            const map = L.map('map').setView([13.0827, 80.2707], 13);
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const colors = ['red', 'blue', 'green', 'orange', 'purple'];

            // Plot routes and markers for each vehicle
            routes.forEach((vehicle, index) => {
                const vehicleId = vehicle.vehicleId;

                // Draw polyline for the route using geoRoute
                const latlngs = vehicle.geoRoute.map(coord => [coord.x, coord.y]);
                L.polyline(latlngs, { color: colors[index % colors.length] }).addTo(map);

                // Add markers for customer locations only
                vehicle.route.forEach((customer) => {
                    if (customer.id !== 1) { // Skip the depot
                        L.marker([customer.x, customer.y]).addTo(map).bindTooltip(`Location ${customer.id} (Vehicle ${vehicleId})`);
                    } else if (index === 0) {
                        // Add marker for the depot once
                        L.marker([customer.x, customer.y])
                            .addTo(map)
                            .bindTooltip(`Depot (Vehicle ${vehicleId})`)
                            .openTooltip();
                    }
                });
            });

            // Fit map bounds to all routes
            const allLatlngs = routes.flatMap(vehicle => vehicle.geoRoute.map(coord => [coord.x, coord.y]));
            map.fitBounds(L.polyline(allLatlngs).getBounds());
        })
        .catch(error => console.error('Error:', error)); // Log any fetch errors
    });
});
