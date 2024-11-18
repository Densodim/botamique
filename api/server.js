const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Пример данных устройств
let devices = [
    {
        id: 1, name: 'pH-метр Mettler-Toledo', status: 'Свободен', notification: true, image: '/img/pH.png',
        analytic: [
            {
                type: 'В работе',
                date: new Date(2024, 10, 8, 15, 30),
                sample: ['Образец/серия: 000100057935_170000010325_0000251849'],
                user: 'morozovava',
                result: true
            }
        ]
    },
    { id: 2, name: 'Спектрофотометр Varian', status: 'Свободен', notification: true, image: '/img/cary50Bio.png' },
    { id: 3, name: 'Титратор', status: 'Свободен', notification: false, image: '/img/titrator.png' },
    { id: 4, name: 'Коагулометр Tcoag, KC 4 Delta', status: 'Свободен', notification: false, image: '/img/tcoag.png' }
];

// Настройка статических файлов
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// API маршруты
app.get('/api/devices', (req, res) => {
    res.json(devices);
});

app.post('/api/devices/:id/toggle', (req, res) => {
    const deviceId = parseInt(req.params.id);
    const device = devices.find(d => d.id === deviceId);
    if (device) {
        device.notification = !device.notification;
        res.json({ success: true, notification: device.notification });
    } else {
        res.status(404).json({ success: false, message: 'Device not found' });
    }
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
