// =============================================
//   SocialSafety – ui.js
//   DOM rendering helpers
// =============================================

// ---- Alert card HTML builder ----
function buildAlertCard(alert, compact = false) {
  const statusClass = {
    new: 'badge-new',
    acknowledged: 'badge-acknowledged',
    'in-progress': 'badge-in-progress',
    resolved: 'badge-resolved'
  }[alert.status] || 'badge-new';

  const statusLabel = {
    new: 'new',
    acknowledged: 'acknowledged',
    'in-progress': 'in-progress',
    resolved: 'resolved'
  }[alert.status] || alert.status;

  const actions = compact
    ? `<button class="btn-sm btn-acknowledge" onclick="acknowledgeAlert(${alert.id})">Acknowledge</button>
       <button class="btn-sm btn-false-alarm" onclick="markFalseAlarm(${alert.id})">False Alarm</button>`
    : buildDetailedActions(alert);

  const assignedBadge = alert.assignedUnit
    ? `<span style="font-size:12px;color:var(--text-muted);margin-left:8px;">Assigned: ${alert.assignedUnit}</span>`
    : '';

  return `
    <div class="alert-item ${alert.severity}" id="alert-${alert.id}" data-status="${alert.status}" data-severity="${alert.severity}" data-source="${alert.source}">
      <div class="alert-header">
        <div class="alert-source-row">
          <span class="source-icon">${alert.source}</span>
          <span class="badge ${statusClass}">${statusLabel}</span>
        </div>
        <span class="badge sev-${alert.severity}">${alert.severity}</span>
      </div>
      <div class="alert-text">${alert.text}</div>
      <div class="alert-meta">
        <span>🕐 ${alert.time}</span>
        <span>📍 ${alert.location}</span>
      </div>
      <div class="alert-user">
        ${alert.user} ${alert.verified ? '<span style="color:var(--accent-blue)">✓</span>' : ''} ${assignedBadge}
      </div>
      <div class="alert-actions">${actions}</div>
    </div>`;
}

function buildDetailedActions(alert) {
  if (alert.status === 'resolved') {
    return `<span style="font-size:12px;color:var(--accent-green)">✓ Resolved</span>`;
  }
  if (alert.status === 'acknowledged' || alert.status === 'in-progress') {
    return `
      <button class="btn-sm btn-resolve" onclick="resolveAlert(${alert.id})">Mark Resolved</button>
      <button class="btn-sm btn-details" onclick="showDetails(${alert.id})">Details</button>`;
  }
  return `
    <button class="btn-sm btn-acknowledge" onclick="acknowledgeAlert(${alert.id})">Acknowledge</button>
    <button class="btn-sm btn-false-alarm" onclick="markFalseAlarm(${alert.id})">False Alarm</button>`;
}

// ---- Render alert lists ----
function renderLiveStream() {
  const el = document.getElementById('live-stream');
  if (!el) return;
  const recent = ALERTS.filter(a => a.status !== 'resolved').slice(0, 3);
  el.innerHTML = recent.map(a => buildAlertCard(a, true)).join('');
}

function renderAlertsList() {
  const el = document.getElementById('alerts-list');
  if (!el) return;
  el.innerHTML = ALERTS.map(a => buildAlertCard(a, false)).join('');
  updateAlertCount(ALERTS.length, ALERTS.length);
}

function updateAlertCount(showing, total) {
  const el = document.getElementById('alertCount');
  if (el) el.textContent = `Showing ${showing} of ${total} alerts`;
}

// ---- Render teams grid ----
function renderTeams() {
  const el = document.getElementById('teamsGrid');
  if (!el) return;
  el.innerHTML = TEAMS.map(t => buildTeamCard(t)).join('');
}

function buildTeamCard(team) {
  const statusCls = {
    'on-scene':   'status-on-scene',
    'dispatched': 'status-dispatched',
    'available':  'status-available',
    'returning':  'status-returning'
  }[team.status] || 'status-available';

  const actions = (team.status === 'on-scene' || team.status === 'in-progress')
    ? `<button class="btn-sm btn-resolve" onclick="resolveTeam(${team.id})">Mark Resolved</button>
       <button class="btn-sm btn-details">Details</button>`
    : `<button class="btn-sm btn-details">Details</button>`;

  const alertCount = team.activeAlerts > 0
    ? `${team.activeAlerts} active alert`
    : 'No active alerts';

  return `
    <div class="team-card">
      <div class="team-header">
        <div class="team-title-row">
          <div class="team-avatar ${team.color}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <div class="team-name">${team.name}</div>
            <div class="team-type">${team.type}</div>
          </div>
        </div>
        <span class="team-status ${statusCls}">${team.status.replace('-', ' ')}</span>
      </div>
      <div class="team-info">
        <div class="team-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${team.location}
        </div>
        <div class="team-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          ${team.personnel} personnel
        </div>
        <div class="team-info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Response time: ${team.responseTime} min
        </div>
      </div>
      <div class="team-footer">
        <span class="team-alert-count">${alertCount}</span>
        <div class="team-actions">${actions}</div>
      </div>
    </div>`;
}

// ---- Render settings sources ----
function renderSources() {
  const el = document.getElementById('sourceList');
  if (!el) return;
  el.innerHTML = SOURCES.map(s => `
    <div class="source-item">
      <div class="source-info">
        <div class="source-icon-box">${s.icon}</div>
        <div>
          <div class="source-name">${s.name}</div>
          <div class="source-desc">${s.desc}</div>
        </div>
      </div>
      <div class="toggle ${s.enabled ? 'active' : ''}" onclick="toggleSource('${s.id}', this)"></div>
    </div>`).join('');

  const tEl = document.getElementById('thresholdList');
  if (!tEl) return;
  tEl.innerHTML = THRESHOLDS.map((t, i) => `
    <div class="threshold-item">
      <span class="threshold-label">${t.label}</span>
      <input class="threshold-input" type="number" value="${t.value}" onchange="updateThreshold(${i}, this.value)">
    </div>`).join('');
}

// ---- Render map ----
function renderMap() {
  const pinsEl = document.getElementById('mapPins');
  if (!pinsEl) return;
  pinsEl.innerHTML = ALERTS.map(a => `
    <div class="map-pin ${a.severity}"
         style="left:${a.lng}%;top:${a.lat}%;"
         title="${a.text}">
      <div class="map-pin-label">${a.severity.toUpperCase()} – ${a.location}</div>
    </div>`).join('');
}

// ---- Filter alerts ----
function filterAlerts() {
  const search   = (document.getElementById('alertSearch')?.value || '').toLowerCase();
  const status   = document.getElementById('filterStatus')?.value || '';
  const severity = document.getElementById('filterSeverity')?.value || '';
  const source   = document.getElementById('filterSource')?.value || '';

  const filtered = ALERTS.filter(a => {
    const matchSearch   = !search   || a.text.toLowerCase().includes(search) || a.location.toLowerCase().includes(search);
    const matchStatus   = !status   || a.status === status;
    const matchSeverity = !severity || a.severity === severity;
    const matchSource   = !source   || a.source === source;
    return matchSearch && matchStatus && matchSeverity && matchSource;
  });

  const el = document.getElementById('alerts-list');
  if (el) {
    el.innerHTML = filtered.length
      ? filtered.map(a => buildAlertCard(a, false)).join('')
      : '<div style="text-align:center;padding:40px;color:var(--text-muted)">No alerts match the current filters</div>';
  }
  updateAlertCount(filtered.length, ALERTS.length);
}

// ---- Toast notification ----
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:var(--card-bg);border:1px solid var(--card-border);
    border-radius:10px;padding:12px 18px;
    font-size:13px;font-family:var(--font);color:var(--text);
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation:slideIn 0.3s ease;
    display:flex;align-items:center;gap:10px;
  `;
  const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' };
  toast.innerHTML = `<span style="width:8px;height:8px;border-radius:50%;background:${colors[type]};flex-shrink:0;display:inline-block;"></span>${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
