// =============================================
//   SocialSafety – charts.js
//   All Chart.js initializations
// =============================================

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
      ticks: { color: '#7b8099', font: { family: "'DM Sans'" } }
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
      ticks: { color: '#7b8099', font: { family: "'DM Sans'" } }
    }
  }
};

let charts = {};

function initDashboardCharts() {
  // Severity bar chart
  const sCtx = document.getElementById('severityChart');
  if (sCtx && !charts.severity) {
    charts.severity = new Chart(sCtx, {
      type: 'bar',
      data: {
        labels: CHART_DATA.severity.labels,
        datasets: [{
          data: CHART_DATA.severity.values,
          backgroundColor: CHART_DATA.severity.colors.map(c => c + '99'),
          borderColor: CHART_DATA.severity.colors,
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: { ...CHART_DEFAULTS }
    });
  }

  // Volume line chart
  const vCtx = document.getElementById('volumeChart');
  if (vCtx && !charts.volume) {
    charts.volume = new Chart(vCtx, {
      type: 'line',
      data: {
        labels: CHART_DATA.volume24h.labels,
        datasets: [{
          data: CHART_DATA.volume24h.values,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.12)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: { ...CHART_DEFAULTS }
    });
  }
}

function initAnalyticsCharts() {
  // Weekly stacked line chart
  const wCtx = document.getElementById('weeklyChart');
  if (wCtx && !charts.weekly) {
    charts.weekly = new Chart(wCtx, {
      type: 'line',
      data: {
        labels: CHART_DATA.weekly.labels,
        datasets: CHART_DATA.weekly.datasets.map(d => ({
          label: d.label,
          data: d.data,
          borderColor: d.color,
          backgroundColor: d.color + '22',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointRadius: 3
        }))
      },
      options: {
        ...CHART_DEFAULTS,
        plugins: {
          legend: {
            display: true,
            labels: { color: '#7b8099', font: { family: "'DM Sans'", size: 11 }, boxWidth: 12 }
          }
        }
      }
    });
  }

  // Response time bar chart
  const rCtx = document.getElementById('responseChart');
  if (rCtx && !charts.response) {
    charts.response = new Chart(rCtx, {
      type: 'bar',
      data: {
        labels: CHART_DATA.response.labels,
        datasets: [{
          data: CHART_DATA.response.values,
          backgroundColor: 'rgba(168,85,247,0.6)',
          borderColor: '#a855f7',
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: { ...CHART_DEFAULTS }
    });
  }

  // Sources doughnut
  const srcCtx = document.getElementById('sourcesChart');
  if (srcCtx && !charts.sources) {
    charts.sources = new Chart(srcCtx, {
      type: 'doughnut',
      data: {
        labels: CHART_DATA.sources.labels,
        datasets: [{
          data: CHART_DATA.sources.values,
          backgroundColor: ['#3b82f6','#ec4899','#1877f2','#25d366','#ef4444','#22c55e'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: { color: '#7b8099', font: { family: "'DM Sans'", size: 11 }, boxWidth: 12 }
          }
        }
      }
    });
  }

  // Resolution rate line chart
  const resCtx = document.getElementById('resolutionChart');
  if (resCtx && !charts.resolution) {
    charts.resolution = new Chart(resCtx, {
      type: 'line',
      data: {
        labels: CHART_DATA.weekly.labels,
        datasets: [{
          data: CHART_DATA.resolution.values,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.12)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointRadius: 4
        }]
      },
      options: {
        ...CHART_DEFAULTS,
        scales: {
          ...CHART_DEFAULTS.scales,
          y: {
            ...CHART_DEFAULTS.scales.y,
            min: 0, max: 100,
            ticks: {
              ...CHART_DEFAULTS.scales.y.ticks,
              callback: v => v + '%'
            }
          }
        }
      }
    });
  }
}

// Simulate live data ticking
function startLiveTick() {
  setInterval(() => {
    if (charts.volume) {
      const vals = charts.volume.data.datasets[0].data;
      vals.push(Math.max(1, vals[vals.length - 1] + Math.floor(Math.random() * 5 - 2)));
      if (vals.length > 8) vals.shift();
      charts.volume.update('none');
    }
  }, 5000);
}
