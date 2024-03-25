document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:1999/api/v1/users/patients')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('fullname');
            const doctorName = document.getElementById('doctor-name');
            doctorName.value = localStorage.getItem('userName');
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
    const testForm = document.getElementById('test-form');

    testForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // Get form data
        const formData = new FormData(testForm);
        const userID = formData.get('fullname');
        const testType = formData.get('test-type');
        const doctorName = formData.get('doctor-name');
        const assignDate = formData.get('assign-date');

        console.log('User ID:', userID);
        console.log('Test Type:', testType);
        console.log('Doctor Name:', doctorName);
        console.log('Assign Date:', assignDate);

        fetch('http://localhost:1999/api/v1/tests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: { id: userID },
                testType: testType,
                doctorName: doctorName,
                assignDate: assignDate
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Test saved successfully');
                    alert('Test saved successfully');
                } else {
                    console.error('Failed to save test');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

