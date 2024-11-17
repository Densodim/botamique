import { goToAnalytics, goToHome } from './navigation.js';
import { Links } from "./links.js";
import {openModal} from "./modal.js";

document.getElementById('analytics').addEventListener('click', goToAnalytics);
document.getElementById('home').addEventListener('click', goToHome);
Links();
openModal()


document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const workTypeSelect = document.getElementById('workTypeSelect');
    const workButton = document.getElementById('workButton');

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    const today = new Date();
    startDateInput.value = formatDate(today);
    endDateInput.value = formatDate(today);

    function setPeriod(period) {
        const currentDate = new Date();
        let startDate;
        let endDate = new Date(currentDate);

        switch (period) {
            case 'day':
                startDate = new Date(currentDate);
                break;
            case 'week':
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                break;
            case '2weeks':
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 14));
                break;
            case 'month':
                startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
                break;
            case '3months':
                startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
                break;
            case '6months':
                startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
                break;
            default:
                startDate = new Date(currentDate);
        }

        startDateInput.value = formatDate(startDate);
        endDateInput.value = formatDate(endDate);

        fetchAnalytics();
    }

    const filterButtons = document.querySelectorAll('.filter-buttons button');
    let activeButton = document.querySelector('.filter-buttons button.active');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            activeButton = e.target;
            activeButton.classList.add('active');

            const period = activeButton.getAttribute('data-period');
            setPeriod(period);
        });
    });

    workTypeSelect.addEventListener('change', fetchAnalytics);
    workButton.addEventListener('click', fetchAnalytics)


    async function fetchAnalytics() {
        const deviceId = 1;
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const selectedType = workTypeSelect.value;

        const url = `/api/devices/${deviceId}/analytics?startDate=${startDate}&endDate=${endDate}&type=${selectedType}`;
        console.log('Fetching data from:', url);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.error('Ошибка при загрузке данных:', response.status, response.statusText);
                displayNoData();
                return;
            }

            const data = await response.json();
            console.log('Data received from server:', data);

            if (!Array.isArray(data)) {
                console.error('Неправильный формат данных:', data);
                displayNoData();
                return;
            }

            displayAnalytics(data);
        } catch (error) {
            console.error('Error fetch:', error);
            displayNoData();
        }
    }

    function displayAnalytics(analytics) {
        const tableBody = document.getElementById('analyticsBody');
        tableBody.innerHTML = '';

        if (!analytics || analytics.length === 0) {
            displayNoData();
            return;
        }

        analytics.forEach(entry => {
            const row = document.createElement('tr');

            const date = new Date(entry.date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const customDateString = `${day}.${month}.${year}, ${hours}:${minutes}`;

            row.innerHTML = `
                <td>${customDateString}</td>
                <td>
<!--                    <div class="work-status">${entry.status}</div>-->
                    <div class="work-status">${entry.type}</div>
                </td>
                <td>${entry.sample.map(el => `<div>${el}</div>`).join('')}</td>
                <td>${entry.resultCom.map(el=>`<div>${el}</div>`)}</td>
                <td>${entry.result ? '✔️' : '❌'}</td>
                <td><a href="#" class="style-user">${entry.user}</a></td>
            `;
            tableBody.appendChild(row);
        });
    }

    function displayNoData() {
        const tableBody = document.getElementById('analyticsBody');
        tableBody.innerHTML = '<tr><td colspan="5">Нет данных за указанный период</td></tr>';
    }

    fetchAnalytics();
});
