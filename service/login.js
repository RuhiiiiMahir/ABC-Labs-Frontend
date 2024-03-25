document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const baseURL = "http://localhost:1999/api/v1/users";
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');
        const user = {
            username: username,
            password: password
        };
        fetch(baseURL + "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid username or password');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userName', data.fullname);
                console.log("Local " + localStorage.getItem('userId'));
                alert("User ID:" + data.id + "\n" + "User Name:" + data.username);
                switch (data.userRole) {
                    case "admin":
                        window.location.href = 'admin.html'
                        break;
                    case "patient":
                        window.location.href = 'index.html';
                        break;
                    case "doctor":
                        window.location.href = 'doctor.html';
                        break;
                    case "laboratorian":
                        window.location.href = 'laboratorian.html';
                        break;
                    default:

                        break;
                }
            })
            .catch(error => {

                alert(error.message);
            });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const regForm = document.getElementById('reg-form');

    regForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(regForm);

        for (const [key, value] of formData.entries()) {
            if (value.trim() === '') {
                showModal('Please fill in all fields.');
                return;
            }
        }

        // Validate username
        const username = formData.get('username');
        if (!username.trim()) {
            showModal('Username cannot be empty.');
            return;
        }

        // Validate password
        const password = formData.get('password');
        if (password.length < 6 || password.length > 20) {
            showModal('Password must be between 6 and 20 characters.');
            //showModal();
            return;
        }

        // Validate fullname
        const fullname = formData.get('fullname');
        if (!/^[a-zA-Z\s]*$/.test(fullname)) {
            showModal('Full Name can only contain alphabets and spaces.');
            return;
        }

        // Validate email
        const email = formData.get('email');
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showModal('Invalid email format.');
            return;
        }

        // Validate date of birth
        const dob = new Date(formData.get('dob'));
        const currentDate = new Date();

        if (dob >= currentDate) {
            showModal('Please select a valid date of birth.');
            return;
        }

        const role = formData.get('role');

        const userData = {
            username: username,
            password: password,
            fullname: fullname,
            email: email,
            dob: dob.toISOString().split('T')[0],
            userRole: role
        };
        // Convert userData object to JSON string for alert
        const userDataString = JSON.stringify(userData, null, 2);

        // Display alert with userData
        alert(userDataString);

        fetch('http://localhost:1999/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (response.ok) {

                    alert('Registration successful');
                    window.location.href = 'login.html';
                } else {

                    alert('Registration failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);

            });
    });
});