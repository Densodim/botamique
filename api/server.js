const express = require('express');
const path = require('path');

const app = express();

// Статические файлы
app.use(express.static(path.join(__dirname, '../public')));

let devices = [
    { id: 1, name: 'pH-метр Mettler-Toledo', status: 'Свободен', notification: true, image: '/img/pH.png' },
    { id: 2, name: 'Спектрофотометр Varian', status: 'Свободен', notification: true, image: '/img/cary50Bio.png' },
    { id: 3, name: 'Титратор', status: 'Свободен', notification: false, image: '/img/titrator.png' },
    { id: 4, name: 'Коагулометр Tcoag, KC 4 Delta', status: 'Свободен', notification: false, image: '/img/tcoag.png' }
];

// API для получения устройств
app.get('/api/devices', (req, res) => {
    res.json(devices);
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
