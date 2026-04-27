// =============================================
//   SocialSafety – app.js
//   Navigation, actions, live simulation
// =============================================

// ---- Page Navigation ----
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const page = item.dataset.page;
    navigateTo(page);
  });
});

function navigateTo(page) {
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  // Show page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  // Lazy init
  if (page === 'dashboard') {
    renderLiveStream();
    setTimeout(initDashboardCharts, 50);
  }
  if (page === 'alerts') {
    renderAlertsList();
  }
  if (page === 'map') {
    renderMap();
  }
  if (page === 'teams') {
    renderTeams();
  }
  if (page === 'analytics') {
    setTimeout(initAnalyticsCharts, 50);
  }
  if (page === 'settings') {
    renderSources();
    initSettingsTabs();
  }
}

// ---- Settings Tabs ----
function initSettingsTabs() {
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      if (panel) panel.classList.add('active');
    });
  });
}

// ---- Alert Actions ----
function acknowledgeAlert(id) {
  const alert = ALERTS.find(a => a.id === id);
  if (!alert) return;
  alert.status = 'acknowledged';
  refreshAlertDisplays();
  updateStatCards();
  showToast(`Alert #${id} acknowledged`, 'success');
}

function markFalseAlarm(id) {
  const idx = ALERTS.findIndex(a => a.id === id);
  if (idx === -1) return;
  ALERTS.splice(idx, 1);
  refreshAlertDisplays();
  updateStatCards();
  showToast(`Alert marked as false alarm`, 'info');
}

function resolveAlert(id) {
  const alert = ALERTS.find(a => a.id === id);
  if (!alert) return;
  alert.status = 'resolved';
  refreshAlertDisplays();
  updateStatCards();
  showToast(`Alert #${id} resolved`, 'success');
}

function showDetails(id) {
  const alert = ALERTS.find(a => a.id === id);
  if (!alert) return;
  showToast(`Details: ${alert.text.substring(0, 50)}...`, 'info');
}

function resolveTeam(id) {
  const team = TEAMS.find(t => t.id === id);
  if (!team) return;
  team.status = 'returning';
  team.activeAlerts = 0;
  renderTeams();
  showToast(`${team.name} returning to base`, 'success');
}

function refreshAlertDisplays() {
  const activePage = document.querySelector('.page.active')?.id;
  if (activePage === 'page-dashboard') renderLiveStream();
  if (activePage === 'page-alerts')    renderAlertsList();
}

// ---- Stat card update ----
function updateStatCards() {
  const total    = ALERTS.length;
  const newA     = ALERTS.filter(a => a.status === 'new').length;
  const progress = ALERTS.filter(a => a.status === 'in-progress').length;
  const resolved = ALERTS.filter(a => a.status === 'resolved').length;

  const update = (id, val) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.transform = 'scale(1.1)';
      el.textContent = val;
      setTimeout(() => el.style.transform = '', 200);
    }
  };

  update('stat-total', total);
  update('stat-new', newA);
  update('stat-progress', progress);
  update('stat-resolved', resolved);
}

// ---- Settings actions ----
function toggleSource(id, el) {
  el.classList.toggle('active');
  const src = SOURCES.find(s => s.id === id);
  if (src) src.enabled = el.classList.contains('active');
  showToast(`${id} monitoring ${src?.enabled ? 'enabled' : 'disabled'}`, 'info');
}

function toggleSetting(el) {
  el.classList.toggle('active');
}

function updateThreshold(idx, val) {
  THRESHOLDS[idx].value = parseInt(val);
  showToast('Threshold updated', 'success');
}

// ---- Export ----
function exportAlerts() {
  const rows = [
    ['ID', 'Source', 'Severity', 'Status', 'Text', 'Location', 'Time', 'User'],
    ...ALERTS.map(a => [a.id, a.source, a.severity, a.status, `"${a.text}"`, a.location, a.time, a.user])
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `alerts_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  showToast('Alerts exported as CSV', 'success');
}

// ---- Live simulation ----
function startLiveSimulation() {
  const newAlerts = [
    { source: 'TWITTER',   severity: 'high',   text: 'Gas leak reported near school building #Emergency', location: 'Oak Street School, NY' },
    { source: 'SMS',       severity: 'medium',  text: 'Elevator stuck, people trapped inside', location: '500 5th Ave, New York, NY' },
    { source: 'INSTAGRAM', severity: 'low',     text: 'Tree fallen blocking road #Help needed', location: 'Central Park West, NY' },
    { source: 'WHATSAPP',  severity: 'critical',text: 'Shooting reported near mall entrance', location: 'Queens Center Mall, NY' }
  ];

  let tick = 0;
  setInterval(() => {
    if (tick >= newAlerts.length) return;
    const tpl = newAlerts[tick++];
    const newAlert = {
      id: ALERTS.length + 100 + tick,
      ...tpl,
      status: 'new',
      time: 'Just now',
      user: 'Reported by citizen',
      verified: false,
      assignedUnit: null,
      lat: Math.random() * 80 + 10,
      lng: Math.random() * 80 + 10
    };
    ALERTS.unshift(newAlert);
    updateStatCards();

    const activePage = document.querySelector('.page.active')?.id;
    if (activePage === 'page-dashboard') renderLiveStream();
    if (activePage === 'page-alerts')    filterAlerts();

    showToast(`New ${tpl.severity} alert: ${tpl.source}`, tpl.severity === 'critical' || tpl.severity === 'high' ? 'error' : 'info');
  }, 18000); // new alert every 18 seconds
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('dashboard');
  startLiveSimulation();
  startLiveTick();

  // Stat card transitions
  document.querySelectorAll('.stat-value').forEach(el => {
    el.style.transition = 'transform 0.2s ease';
  });
});
