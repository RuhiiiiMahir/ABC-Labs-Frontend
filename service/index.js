document.addEventListener('DOMContentLoaded', function () {
    const url = `http://localhost:1999/api/v1/appointments/user/${localStorage.getItem('userId')}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const appointmentTableBody = document.getElementById('appointment-table-body');

            data.forEach(appointment => {
                const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${appointment.appointmentID}</td>
                    <td>${appointment.testType}</td>
                    <td>${formattedDate}</td>
                    <td>${appointment.appointmentTime}</td>
                    <td id="button-cell-${appointment.appointmentID}">
                        <button onclick="rescheduleAppointment(${appointment.appointmentID})">Pay</button>
                    </td>
                `;
                appointmentTableBody.appendChild(row);

                checkPaymentStatus(appointment.appointmentID);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function checkPaymentStatus(appointmentId) {
    const paymentUrl = `http://localhost:1999/api/v1/payments/${appointmentId}`;
    fetch(paymentUrl)
        .then(response => response.json())
        .then(paymentData => {
            if (paymentData.status === 'Paid') {
                const buttonCell = document.getElementById(`button-cell-${appointmentId}`);
                const payButton = buttonCell.querySelector('button');
                payButton.disabled = true;
                payButton.innerText = 'Paid';
                payButton.style.backgroundColor = 'red';
            }
        })
        .catch(error => {
            console.error('Error checking payment status:', error);
        });
}

function rescheduleAppointment(appointmentId) {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '150.00' 
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                
                console.log('Payment successful:', details);
                ////////////////////
                savePaymentDetails(details, appointmentId);
                
                document.getElementById('payment-success-message').style.display = 'block';

                document.getElementById('paypal-button-container').style.display = 'none';
            });
        },
        onError: function(err) {
            console.error('Payment error:', err);
        }
    }).render('#paypal-button-container');
}

function cancelAppointment(appointmentId) {
    
}
function savePaymentDetails(paymentDetails, appointmentId) {
    const url = 'http://localhost:1999/api/v1/payments';
    const paymentData = {
        appointment: {
            appointmentID: appointmentId,
        },
        amount: paymentDetails.purchase_units[0].amount.value,
        paymentDate: new Date().toISOString(),
        paymentMethod: 'PayPal',
        status: 'Paid'
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Payment saved:', data);
        
        document.getElementById('payment-success-message').style.display = 'block';
        document.getElementById('paypal-button-container').style.display = 'none';
    })
    .catch(error => {
        console.error('Error saving payment:', error);
    });
}
// report view
document.addEventListener('DOMContentLoaded', function () {
    const reportTableBody = document.getElementById('report-table-body');
    const reportViewer = document.getElementById('report-viewer');
    const reportIframe = document.getElementById('report-iframe');
    const closeViewerButton = document.getElementById('close-viewer');

    function fetchReports() {
        fetch('http://localhost:1999/api/v1/reports')
            .then(response => response.json())
            .then(data => {

                reportTableBody.innerHTML = '';

                data.forEach(report => {
                    const row = document.createElement('tr');
                    const fileName = report.reportFilePath.split('/').pop().split('\\').pop();
                    row.innerHTML = `
                        <td>${report.reportID}</td>
                        <td>${report.user.fullname}</td>
                        <td>${fileName}</td>
                        <td>
                            <button class="view-report" data-report-url="${report.reportFilePath}">View</button>
                        </td>
                    `;
                    reportTableBody.appendChild(row);
                });

                const viewReportButtons = document.querySelectorAll('.view-report');
                viewReportButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const reportUrl = this.getAttribute('data-report-url');
                        showReport(reportUrl);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
            });
    }

    function showReport(reportUrl) {
        reportIframe.src = reportUrl;
        reportViewer.classList.remove('hidden');
    }

    closeViewerButton.addEventListener('click', function () {
        reportViewer.classList.add('hidden');
        reportIframe.src = '';
    });

    fetchReports();
});
