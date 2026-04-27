# SocialSafety – Command Dashboard

## File Structure

```
socialsafety/
├── index.html          ← Open this in your browser
├── css/
│   └── main.css        ← All styles
└── js/
    ├── data.js         ← All mock data (alerts, teams, settings)
    ├── charts.js       ← Chart.js chart initializations
    ├── ui.js           ← DOM rendering helpers
    └── app.js          ← Navigation, actions, live simulation
```

## How to run

1. Download/copy the entire `socialsafety/` folder to your computer
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. No server or build step needed — works offline

## Features

- **Dashboard** – Live stats, severity bar chart, 24h volume line chart, live alert stream
- **Alert Stream** – Filterable list of all 8 alerts with search, status/severity/source filters, Export CSV
- **Map View** – Geographic pin map showing alert locations by severity
- **Response Teams** – 6 unit cards with status badges, personnel info, dispatch actions
- **Analytics** – Weekly trends, response time distribution, source breakdown, resolution rate
- **Settings** – Alert source toggles, security config, user management, data retention, integrations

## Live Simulation

New alerts auto-appear every ~18 seconds to simulate real-time feed.
Charts update every 5 seconds.

## External dependencies (CDN)

- [Chart.js 4.4](https://cdn.jsdelivr.net/npm/chart.js)
- [Google Fonts – DM Sans + JetBrains Mono](https://fonts.google.com)

Both load from CDN — internet connection required on first load.
