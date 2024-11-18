const express = require('express');
const path = require('path');
const app = express();

const devices = [
    {
        id: 1, name: 'pH-метр Mettler-Toledo', status: 'Свободен', notification: true, image: '/img/pH.png',
        analytic: [
            {
                type: 'В работе',
                date: new Date(2024, 10, 8, 15, 30),
                sample: ['Образец/серия: 000100057935_170000010325_0000251849'],
                user: 'morozovava',
                resultCom: [],
                result: true
            }
        ]
    },
    { id: 2, name: 'Спектрофотометр Varian', status: 'Свободен', notification: true, image: '/img/cary50Bio.png' }
];

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

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

app.get('/api/devices/:id/analytics', (req, res) => {
    const deviceId = parseInt(req.params.id);
    const { startDate, endDate } = req.query;

    const device = devices.find(d => d.id === deviceId);
    if (!device) {
        return res.status(404).json({ success: false, message: 'Device not found' });
    }

    let analytics = device.analytic || [];
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        analytics = analytics.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= start && entryDate <= end;
        });
    }

    res.json(analytics);
});

module.exports = app;
