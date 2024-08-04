const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3080;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Connect to MongoDB (replace 'Database' with your actual database name)
mongoose.connect('mongodb://0.0.0.0:27017/Database', { useNewUrlParser: true, useUnifiedTopology: true });

const contactSchema = new mongoose.Schema({
    vehicleId: String,
    routeId: String,
    distance: Number,
    capacity: Number,
    date: Date
});

const Contact = mongoose.model('contacts', contactSchema);

// Endpoint to fetch daily progress data for the last 7 days
app.get('/api/vehicle-routing-data', async (req, res) => {
    try {
        const contacts = await Contact.find();

        // Calculate the date 7 days ago
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        // Filter contacts to include only those from the last 7 days
        const filteredContacts = contacts.filter(contact => contact.date >= lastWeek);

        // Initialize daily progress map
        const dailyProgressMap = {};

        // Calculate daily progress count data
        filteredContacts.forEach(contact => {
            const date = contact.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            if (!dailyProgressMap[date]) {
                dailyProgressMap[date] = 0;
            }
            dailyProgressMap[date] += 1; // Increment count for each progress entry
        });

        // Get the last 7 dates and their corresponding values in reverse chronological order
        const last7Dates = Object.keys(dailyProgressMap).slice(-7).sort((a, b) => new Date(b) - new Date(a));
        const last7Values = last7Dates.map(date => dailyProgressMap[date]);

        const dailyProgressData = {
            labels: last7Dates,
            values: last7Values
        };

        // Calculate polar area data by grouping by vehicleId
        const polarAreaMap = {};
        filteredContacts.forEach(contact => {
            if (!polarAreaMap[contact.vehicleId]) {
                polarAreaMap[contact.vehicleId] = 0;
            }
            polarAreaMap[contact.vehicleId] += 1; // Increment count for each vehicle ID
        });

        const polarAreaLabels = Object.keys(polarAreaMap);
        const polarAreaValues = polarAreaLabels.map(vehicleId => polarAreaMap[vehicleId]);

        const polarAreaData = {
            labels: polarAreaLabels,
            values: polarAreaValues
        };

        res.json({ dailyProgressData, polarAreaData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
