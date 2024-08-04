async function fetchData() {
    try {
        const response = await fetch('http://localhost:3080/api/vehicle-routing-data');
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        // Return mock data for testing purposes
        return {
            dailyProgressData: {
                labels: ["Day 1", "Day 2", "Day 3"],
                values: [10, 20, 30]
            },
            polarAreaData: {
                labels: ["Category 1", "Category 2", "Category 3"],
                values: [10, 20, 30]
            }
        };
    }
}

const dailyProgressBarChartCtx = document.getElementById('dailyProgressBarChart').getContext('2d');
const dailyProgressBarChart = new Chart(dailyProgressBarChartCtx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Daily Progress',
            data: [],
            backgroundColor: 'rgba(0, 123, 255, 1)',
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const polarAreaChartCtx = document.getElementById('myChart').getContext('2d');
const polarAreaChart = new Chart(polarAreaChartCtx, {
    type: 'polarArea',
    data: {
        labels: [],
        datasets: [{
            label: 'Daily Progress',
            data: [],
            backgroundColor: [
                'rgba(50, 12, 123, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
        }]
    },
    options: {
        responsive: true,
    }
});

function updateBarChart(chart, newData) {
    if (newData && newData.labels && newData.values) {
        chart.data.labels = newData.labels;
        chart.data.datasets[0].data = newData.values;
        chart.update();
    } else {
        console.error('Invalid bar chart data:', newData);
    }
}

function updatePolarAreaChart(chart, newData) {
    if (newData && newData.labels && newData.values) {
        chart.data.labels = newData.labels;
        chart.data.datasets[0].data = newData.values;
        chart.update();
    } else {
        console.error('Invalid polar area chart data:', newData);
    }
}

async function loadAndUpdateCharts() {
    try {
        const data = await fetchData();
        console.log('Data for charts:', data);

        if (data.dailyProgressData) {
            console.log('Updating Bar Chart with data:', data.dailyProgressData);
            updateBarChart(dailyProgressBarChart, data.dailyProgressData);
        } else {
            console.error('No dailyProgressData found:', data);
        }

        if (data.polarAreaData) {
            console.log('Updating Polar Area Chart with data:', data.polarAreaData);
            updatePolarAreaChart(polarAreaChart, data.polarAreaData);
        } else {
            console.error('No polarAreaData found:', data);
        }
    } catch (error) {
        console.error('Error loading and updating charts:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadAndUpdateCharts);
document.getElementById('solveButton').addEventListener('click', loadAndUpdateCharts);
