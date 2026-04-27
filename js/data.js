// =============================================
//   SocialSafety – data.js
//   Central data store
// =============================================

const ALERTS = [
  {
    id: 1,
    source: 'TWITTER',
    status: 'new',
    severity: 'critical',
    text: 'Major fire at downtown building! Smoke everywhere. #SOS #Emergency',
    time: '3 minutes ago',
    location: '123 Broadway, New York, NY',
    user: 'Sarah Chen',
    verified: true,
    assignedUnit: null,
    lat: 35, lng: 45
  },
  {
    id: 2,
    source: 'EMERGENCY-APP',
    status: 'acknowledged',
    severity: 'critical',
    text: 'Medical emergency - child not breathing',
    time: '6 minutes ago',
    location: '456 Park Ave, New York, NY',
    user: 'John Martinez',
    verified: false,
    assignedUnit: 'Unit 42',
    lat: 55, lng: 30
  },
  {
    id: 3,
    source: 'INSTAGRAM',
    status: 'in-progress',
    severity: 'high',
    text: 'Car accident on highway - multiple vehicles involved #Help',
    time: '13 minutes ago',
    location: 'I-95 North, Mile 14',
    user: 'Mike Johnson',
    verified: false,
    assignedUnit: 'Unit 17',
    lat: 70, lng: 60
  },
  {
    id: 4,
    source: 'WHATSAPP',
    status: 'new',
    severity: 'high',
    text: 'Armed robbery in progress at convenience store',
    time: '16 minutes ago',
    location: '789 Queens Blvd, Queens, NY',
    user: 'Anonymous Tipster',
    verified: false,
    assignedUnit: null,
    lat: 40, lng: 70
  },
  {
    id: 5,
    source: 'SMS',
    status: 'in-progress',
    severity: 'medium',
    text: 'Flooding in basement apartment, water rising fast',
    time: '22 minutes ago',
    location: '234 Riverside Dr, New York, NY',
    user: 'Emma Wilson',
    verified: true,
    assignedUnit: 'Unit 8',
    lat: 25, lng: 50
  },
  {
    id: 6,
    source: 'FACEBOOK',
    status: 'new',
    severity: 'medium',
    text: 'Suspicious package left unattended near subway entrance',
    time: '31 minutes ago',
    location: '14th St & 8th Ave Subway, NY',
    user: 'Tom Bradley',
    verified: false,
    assignedUnit: null,
    lat: 60, lng: 45
  },
  {
    id: 7,
    source: 'TWITTER',
    status: 'resolved',
    severity: 'low',
    text: 'Power outage affecting 3 city blocks, no street lights #Help',
    time: '45 minutes ago',
    location: 'Bronx, NY',
    user: 'Maria Garcia',
    verified: true,
    assignedUnit: 'Utilities',
    lat: 20, lng: 35
  },
  {
    id: 8,
    source: 'EMERGENCY-APP',
    status: 'new',
    severity: 'low',
    text: 'Injured stray dog blocking traffic on main road',
    time: '1 hour ago',
    location: 'FDR Drive, Manhattan',
    user: 'Alex Kim',
    verified: false,
    assignedUnit: null,
    lat: 80, lng: 25
  }
];

const TEAMS = [
  {
    id: 1,
    name: 'Police Unit 42',
    type: 'Police',
    status: 'on-scene',
    location: '456 Park Ave, New York, NY',
    personnel: 2,
    responseTime: 8,
    activeAlerts: 1,
    color: 'blue'
  },
  {
    id: 2,
    name: 'Fire Squad 17',
    type: 'Fire',
    status: 'dispatched',
    location: 'En route to 123 Broadway',
    personnel: 6,
    responseTime: 5,
    activeAlerts: 1,
    color: 'red'
  },
  {
    id: 3,
    name: 'Bomb Squad Alpha',
    type: 'Police',
    status: 'on-scene',
    location: 'Times Square Station',
    personnel: 4,
    responseTime: 12,
    activeAlerts: 1,
    color: 'blue'
  },
  {
    id: 4,
    name: 'Medical Unit 8',
    type: 'Medical',
    status: 'returning',
    location: 'Returning from 567 Lexington Ave',
    personnel: 3,
    responseTime: 15,
    activeAlerts: 0,
    color: 'green'
  },
  {
    id: 5,
    name: 'Utilities Response',
    type: 'Utility',
    status: 'available',
    location: 'Depot - Bronx HQ',
    personnel: 3,
    responseTime: 20,
    activeAlerts: 0,
    color: 'yellow'
  },
  {
    id: 6,
    name: 'Police Unit 15',
    type: 'Police',
    status: 'available',
    location: 'Precinct 15, Manhattan',
    personnel: 3,
    responseTime: 10,
    activeAlerts: 0,
    color: 'blue'
  }
];

const SOURCES = [
  { id: 'twitter',  name: 'Twitter / X',           desc: 'Monitor hashtags: #SOS, #Help, #Emergency', icon: 'X',  enabled: true },
  { id: 'instagram',name: 'Instagram',              desc: 'Monitor public posts and stories',          icon: 'IG', enabled: true },
  { id: 'facebook', name: 'Facebook',               desc: 'Monitor public posts',                      icon: 'FB', enabled: true },
  { id: 'whatsapp', name: 'WhatsApp Tip Line',      desc: 'Dedicated emergency reporting number',      icon: 'WA', enabled: true },
  { id: 'sms',      name: 'SMS Gateway',            desc: 'Emergency text message hotline',            icon: 'SM', enabled: true },
  { id: 'app',      name: 'SocialSafety Mobile App',desc: 'Dedicated emergency reporting app',        icon: 'SS', enabled: true }
];

const THRESHOLDS = [
  { label: 'Critical – min confidence %', value: 90 },
  { label: 'High – min confidence %',     value: 75 },
  { label: 'Medium – min confidence %',   value: 60 },
  { label: 'Auto-escalation (minutes)',   value: 15 }
];

// ---- chart data ----
const CHART_DATA = {
  severity: {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    values: [2, 2, 2, 2],
    colors: ['#ef4444','#f97316','#eab308','#3b82f6']
  },
  volume24h: {
    labels: ['12am','3am','6am','9am','12pm','3pm','6pm','9pm'],
    values:  [3, 1, 5, 8, 12, 15, 9, 5]
  },
  weekly: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      { label: 'Critical', data: [1,3,2,4,2,1,2], color: '#ef4444' },
      { label: 'High',     data: [2,1,3,2,3,2,2], color: '#f97316' },
      { label: 'Medium',   data: [3,4,2,3,2,4,2], color: '#eab308' },
      { label: 'Low',      data: [2,3,4,2,1,3,3], color: '#3b82f6' }
    ]
  },
  response: {
    labels: ['<5m','5-10m','10-20m','20-30m','>30m'],
    values: [4,8,12,6,3]
  },
  sources: {
    labels: ['Twitter','Instagram','Facebook','WhatsApp','SMS','App'],
    values: [35,20,15,18,7,5]
  },
  resolution: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    values: [78,82,75,90,85,70,88]
  }
};
