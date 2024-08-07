// script.js

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#hoursTable tbody');
    const totalButton = document.getElementById('calculateTotal');
    const resetButton = document.getElementById('reset');
    
    // Generate 31 rows for the table
    for (let i = 1; i <= 31; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="time" class="check-in"></td>
            <td><input type="time" class="check-out"></td>
            <td class="hours">0</td>
        `;
        tableBody.appendChild(row);
    }

    // Calculate hours for a single row
    function calculateRowHours(row) {
        const checkIn = row.querySelector('.check-in').value;
        const checkOut = row.querySelector('.check-out').value;

        if (checkIn && checkOut) {
            const [inHours, inMinutes] = checkIn.split(':').map(Number);
            const [outHours, outMinutes] = checkOut.split(':').map(Number);
            
            const inTime = new Date();
            inTime.setHours(inHours, inMinutes, 0, 0);
            
            const outTime = new Date();
            outTime.setHours(outHours, outMinutes, 0, 0);
            
            let hoursWorked = (outTime - inTime) / (1000 * 60 * 60);
            
            if (hoursWorked < 0) {
                hoursWorked += 24; // Adjust for overnight shifts
            }

            row.querySelector('.hours').textContent = hoursWorked.toFixed(2);
            return hoursWorked;
        } else {
            row.querySelector('.hours').textContent = '0';
            return 0;
        }
    }

    // Calculate total hours
    function calculateTotalHours() {
        const rows = tableBody.querySelectorAll('tr');
        let totalHours = 0;

        rows.forEach(row => {
            totalHours += calculateRowHours(row);
        });

        alert(`إجمالي ساعات العمل: ${totalHours.toFixed(2)} ساعة`);
    }

    // Handle total button click
    totalButton.addEventListener('click', calculateTotalHours);

    // Handle reset button click
    resetButton.addEventListener('click', () => {
        tableBody.querySelectorAll('input').forEach(input => input.value = '');
        tableBody.querySelectorAll('.hours').forEach(cell => cell.textContent = '0');
    });

    // Save and load data from localStorage
    function saveData() {
        const rows = tableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => ({
            checkIn: row.querySelector('.check-in').value,
            checkOut: row.querySelector('.check-out').value
        }));
        localStorage.setItem('hoursData', JSON.stringify(data));
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem('hoursData'));
        if (data) {
            const rows = tableBody.querySelectorAll('tr');
            data.forEach((item, index) => {
                if (rows[index]) {
                    rows[index].querySelector('.check-in').value = item.checkIn;
                    rows[index].querySelector('.check-out').value = item.checkOut;
                    calculateRowHours(rows[index]); // Recalculate hours for loaded data
                }
            });
        }
    }

    // Load saved data on page load
    loadData();

    // Save data on changes
    tableBody.addEventListener('input', saveData);
    tableBody.addEventListener('input', event => {
        if (event.target.classList.contains('check-in') || event.target.classList.contains('check-out')) {
            calculateRowHours(event.target.closest('tr'));
        }
    });
});
