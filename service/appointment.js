function scheduleAppointment() {
    window.location.href = "appointment.html";
}
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:1999/api/v1/users/patients')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('fullname');

            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.fullname;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
document.addEventListener('DOMContentLoaded', function () {
    const doctornameSelect = document.getElementById('Recommending Doctor');

    fetch('http://localhost:1999/api/v1/users/doctors')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.fullname;
                option.text = user.fullname;
                doctornameSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
document.addEventListener('DOMContentLoaded', function () {
    const technicianameSelect = document.getElementById('assigned-technician');

    fetch('http://localhost:1999/api/v1/users/laboratorian')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const option = document.createElement('option');
                option.value = user.fullname;
                option.text = user.fullname;
                technicianameSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const appointmentForm = document.getElementById('appointment-form');

    appointmentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // Get form data
        const formData = new FormData(appointmentForm);
        for (const [key, value] of formData.entries()) {
            if (value.trim() === '') {
                alert('Please fill in all fields.');
                return;
            }
        }
        const userID = formData.get('fullname');

        const appointmentDate = new Date(formData.get('appointment-date'));
        const currentDate = new Date();

        if (appointmentDate < currentDate) {
            alert('Please select a valid date.');
            return;
        }
        const appointmentTime = formData.get('appointment-time');
        const testType = formData.get('test-type');
        const assignedTechnician = formData.get('assigned-technician');
        if (!/^[a-zA-Z\s]*$/.test(assignedTechnician)) {
            alert('Laboratorian name can only contain alphabets and spaces.');
            return;
        }
        const recommendingDoctor = formData.get('Recommending Doctor');
        if (!/^[a-zA-Z\s]*$/.test(recommendingDoctor)) {
            alert('Doctor name can only contain alphabets and spaces.');
            return;
        }


        if (!userID || !appointmentDate || !appointmentTime || !testType || !assignedTechnician || !recommendingDoctor) {
            alert('All fields are required');
            return;
        }

        console.log('User ID:', userID);
        console.log('Appointment Date:', appointmentDate);
        console.log('Appointment Time:', appointmentTime);
        console.log('Test Type:', testType);
        console.log('Assigned Technician:', assignedTechnician);
        console.log('Recommending Doctor:', recommendingDoctor);


        fetch('http://localhost:1999/api/v1/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: { id: userID },
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime,
                testType: testType,
                assignedTechnician: assignedTechnician,
                recommendingDoctor: recommendingDoctor
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Appointment scheduled successfully');
                    alert('Appointment scheduled successfully')
                    window.location.href = 'laboratorion.html';
                } else {
                    console.error('Failed to schedule appointment');
                }
            })
            .catch(error => {
                console.error('Error:', error);

            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:1999/api/v1/appointments')
        .then(response => response.json())
        .then(data => {
            const appointmentTableBody = document.getElementById('appointment-table-body');

            data.forEach(appointment => {
                const row = document.createElement('tr');
                // Convert the appointmentDate to a formatted date string
                const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString();

                row.innerHTML = `
                    <td>${appointment.appointmentID}</td>
                    <td>${appointment.testType}</td>
                    <td>${formattedDate}</td>
                    <td>${appointment.appointmentTime}</td>
                `;
                appointmentTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

