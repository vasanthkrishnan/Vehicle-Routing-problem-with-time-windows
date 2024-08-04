//Customer
document.getElementById('addMore').addEventListener('click', function() {
    const numCustomer = parseInt(document.getElementById('numCustomer').value);
    const inputContainer = document.getElementById('inputContainer');
    const currentGroup = document.querySelectorAll('#inputContainer .inputGroup').length / 4;

    if (currentGroup < numCustomer) {
        const newInputGroupCustomerID = document.createElement('div');
        newInputGroupCustomerID.className = 'col-12 col-sm-6 inputGroup';
        newInputGroupCustomerID.innerHTML = `
            <input type="text" class="form-control border-0" placeholder="Customer ID" style="height: 55px;">
        `;

        const newInputGroupLatitude = document.createElement('div');
        newInputGroupLatitude.className = 'col-12 col-sm-6 inputGroup';
        newInputGroupLatitude.innerHTML = `
            <input type="text" class="form-control border-0" placeholder="Latitude" style="height: 55px;">
        `;

        const newInputGroupLongitude = document.createElement('div');
        newInputGroupLongitude.className = 'col-12 col-sm-6 inputGroup';
        newInputGroupLongitude.innerHTML = `
            <input type="text" class="form-control border-0" placeholder="Longitude" style="height: 55px;">
        `;

        const newInputGroupCustomerDemand = document.createElement('div');
        newInputGroupCustomerDemand.className = 'col-12 col-sm-6 inputGroup';
        newInputGroupCustomerDemand.innerHTML = `
            <input type="text" class="form-control border-0" placeholder="Demand" style="height: 55px;">
        `;

        inputContainer.appendChild(newInputGroupCustomerID);
        inputContainer.appendChild(newInputGroupLatitude);
        inputContainer.appendChild(newInputGroupLongitude);
        inputContainer.appendChild(newInputGroupCustomerDemand);
    } else {
        alert('Maximum Number of Customers Reached');
    }
});


//Vehicle
document.getElementById('Addmore').addEventListener('click', function() {
    const numVehicle = parseInt(document.getElementById('numVehicle').value);
    const inputContainer = document.getElementById('Inputcontainer');
    const currentGroup = document.querySelectorAll('#Inputcontainer .Inputgroup').length / 2;

    if (currentGroup < numVehicle) {
        const newInputGroupVehicleID = document.createElement('div');
        newInputGroupVehicleID.className = 'col-12 col-sm-6 Inputgroup';
        newInputGroupVehicleID.innerHTML = `
            <input type="text" class="form-control border-0" placeholder="Vehicle ID" style="height: 55px;">
        `;

        const newInputGroupCapacity = document.createElement('div');
        newInputGroupCapacity.className = 'col-12 col-sm-6 Inputgroup';
        newInputGroupCapacity.innerHTML = `
            <input type="text" class="form-control border-0" placeholder="Capacity" style="height: 55px;">
        `;

        inputContainer.appendChild(newInputGroupVehicleID);
        inputContainer.appendChild(newInputGroupCapacity);
    } else {
        alert('Maximum Number of Vehicles Reached');
    }
});
