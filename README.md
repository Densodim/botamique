# Project

Этот проект представляет собой веб-приложение для управления устройствами и аналитики на основе данных, предоставленных API. Он использует Node.js с Express для сервера и предоставляет функционал для управления устройствами и их статусами, а также для отображения аналитики.

## Структура проекта


## Установка и запуск

### Локальная разработка

Для начала работы с проектом, выполните следующие шаги:

1. Клонируйте репозиторий на вашу локальную машину:

   ```bash
   git clone https://github.com/Densodim/botamique.git
   cd botamique

2. Установите зависимости с помощью npm или pnpm:
   ```bash
    pnpm install

3. Запустите сервер:
   ```bash
   pnpm dev
4. Сервер будет доступен по адресу http://localhost:3000.
5. Проект будет доступен по адресу, предоставленному Vercel https://botamique.vercel.app/


## API
### /api/devices
#### GET — Получить список устройств.

   ````json
[
  {
    "id": 1,
    "name": "pH-метр Mettler-Toledo",
    "status": "Свободен",
    "notification": true,
    "image": "/img/pH.png"
  },
  {
    "id": 2,
    "name": "Спектрофотометр Varian",
    "status": "Свободен",
    "notification": true,
    "image": "/img/cary50Bio.png"
  }
]
````
### /api/devices/:id/toggle
#### POST — Переключить уведомления для устройства с указанным id

````json 
{
  "success": true,
  "notification": false
}
````

### /api/devices/:id/analytics
#### GET — Получить аналитику для устройства с указанным id. Поддерживаются параметры startDate, endDate, и type (фильтры по датам и типам).

```` bash
GET /api/devices/1/analytics?startDate=2024-10-01&endDate=2024-10-31&type=work
````
````json
[
  {
    "type": "В работе",
    "date": "2024-10-08T12:30:00Z",
    "sample": ["Образец/серия: 000100057935_170000010325_0000251849"],
    "user": "morozovava",
    "resultCom": [],
    "result": true
  }
]
````

### Стек технологий
#### Node.js — серверная платформа.
#### Express — веб-фреймворк для Node.js.
#### Vercel — платформа для деплоя серверless приложений.
#### HTML/CSS/JavaScript — для фронтенда.
#### Fetch API — для работы с API на клиентской стороне.




