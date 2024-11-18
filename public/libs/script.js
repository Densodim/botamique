'use strict';
import {goToAnalytics, goToHome} from './navigation.js'
import {Links} from "./links.js";

document.getElementById('home').addEventListener('click', goToHome);
Links();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analytics').addEventListener('click', goToAnalytics);

    loadDevices();
});

async function loadDevices() {
    try {
        const response = await fetch('/api/devices');
        const devices = await response.json();
        renderDevices(devices);

        console.log(devices)
        
    } catch (error) {
        console.error('Ошибка при загрузке устройств:', error);
    }
}

function renderDevices(devices) {
    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = '';

    devices.forEach(device => {
        const row = document.createElement('div');
        row.classList.add('device-row');

        const nameDiv = document.createElement('div');
        nameDiv.classList.add('device-name');
        nameDiv.textContent = device.name;

        const imageDiv = document.createElement('div');
        const img = document.createElement('img');
        img.src = device.image;
        img.alt = device.name;
        img.style.width = '50px';
        imageDiv.appendChild(img);


        const statusDiv = document.createElement('div');
        statusDiv.classList.add('status');
        const statusSelect = document.createElement('select');
        ['Свободен', 'Занят'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (device.status === status) option.selected = true;
            statusSelect.appendChild(option);
        });
        statusSelect.addEventListener('change', () => updateDeviceStatus(device.id, statusSelect.value));
        statusDiv.appendChild(statusSelect);

        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('action');
        const notificationSpan = document.createElement('span');
        notificationSpan.classList.add('notification');
        notificationSpan.textContent = device.notification ? '🔔' : '🔕';
        notificationSpan.addEventListener('click', () => toggleNotification(device.id, notificationSpan));
        notificationDiv.appendChild(notificationSpan);

        row.appendChild(imageDiv);
        row.appendChild(nameDiv);
        row.appendChild(statusDiv);
        row.appendChild(notificationDiv);
        deviceList.appendChild(row);
    });
}

async function updateDeviceStatus(id, status) {
    try {
        await fetch(`/api/devices/${id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    } catch (error) {
        console.error('Ошибка при обновлении статуса:', error);
    }
}

async function toggleNotification(id, notificationSpan) {
    try {
        const response = await fetch(`/api/devices/${id}/toggle`, { method: 'POST' });
        const result = await response.json();
        if (result.success) {
            notificationSpan.textContent = result.notification ? '🔔' : '🔕';
        }
    } catch (error) {
        console.error('Ошибка при переключении уведомления:', error);
    }
}




