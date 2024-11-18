const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

let devices = [
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
            },
            {
                type: 'Калибровка',
                date: new Date(2024, 10, 9, 15, 46),
                sample: ['Номер колонки: Колонка 2', 'Образец: Образец 2', 'Образец: образец 1', 'Метод: метов тестовый'],
                user: 'morozovava',
                resultCom: ['Промывка с указанием вещества: Вещество'],
                result: false
            },
            {
                type: 'Измерение',
                date: new Date(2024, 9, 9, 15, 46),
                sample: ['Номер колонки: Колонка 2', 'Образец: Образец 2', 'Образец: образец 1', 'Метод: метов тестовый'],
                user: 'morozovava',
                resultCom: ['Промывка с указанием вещества: Вещество'],
                result: false
            }]
    },
    {id: 2, name: 'Спектрофотометр Varian', status: 'Свободен', notification: true, image: '/img/cary50Bio.png'},
    {id: 3, name: 'Титратор', status: 'Свободен', notification: false, image: '/img/titrator.png'},
    {id: 4, name: 'Коагулометр Tcoag, KC 4 Delta', status: 'Свободен', notification: false, image: '/img/tcoag.png'}
];

app.use(express.static(path.join(__dirname, '')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.get('/api/devices', (req, res) => {
    res.json(devices);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/devices/:id/toggle', (req, res) => {
    const deviceId = parseInt(req.params.id);
    const device = devices.find(d => d.id === deviceId);
    if (device) {
        device.notification = !device.notification;
        res.json({success: true, notification: device.notification});
    } else {
        res.status(404).json({success: false, message: 'Device not found'});
    }
});

app.get('/api/devices/:id/analytics', (req, res) => {
    const deviceId = parseInt(req.params.id);
    const { startDate, endDate, type } = req.query;

    console.log(`ID ${deviceId} date: ${startDate} - ${endDate}, type: ${type}`);

    const device = devices.find(d => d.id === deviceId);

    if (!device) {
        return res.status(404).json({ success: false, message: 'Device not found' });
    }

    let analytics = device.analytic;

    if (!analytics || !Array.isArray(analytics)) {
        return res.status(500).json({ success: false, message: 'Analytics data not found' });
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ success: false, message: 'Invalid date format' });
        }

        analytics = analytics.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= start && entryDate <= end;
        });
    }

    const typeMapping = {
        work: 'в работе',
        calibration: 'калибровка',
        measurement: 'измерение',
        preparation: 'подготовка'
    };

    if (type && type !== 'all') {
        const selectedType = type.toLowerCase().trim();
        const filterType = typeMapping[selectedType] || selectedType;

        analytics = analytics.filter(entry => {
            const entryType = entry.type ? entry.type.toLowerCase().trim() : '';
            return entryType === filterType;
        });
    }

    const analyticsWithFormattedDates = analytics.map(entry => ({
        ...entry,
        date: entry.date.toISOString()
    }));

    res.json(analyticsWithFormattedDates);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
