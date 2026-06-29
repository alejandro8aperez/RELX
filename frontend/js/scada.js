// ============================================
// AQUA-8 SCADA Dashboard — Live Telemetry
// ============================================

const API_BASE = '';
let isConnected = false;
let demoMode = false;
let localSimInterval = null;

const fallbackModules = {
    A: { name: "Captacion y Pretratamiento", status: "online", temp: 28.5, pressure: 2.1, flow: 450 },
    B: { name: "Osmosis Inversa (RO)", status: "online", temp: 26.0, pressure: 55.0, flow: 420, tds_in: 35000, tds_out: 450 },
    C: { name: "Postratamiento y Almacenamiento", status: "online", temp: 25.0, pressure: 1.5, flow: 415, tank_level: 78 },
    D: { name: "Energia Solar y SCADA", status: "online", solar_prod: 18.5, battery: 92, consumption: 12.3, scada_status: "active" }
};

// ============================================
// FETCH
// ============================================

async function fetchTelemetry() {
    try {
        const res = await fetch(`${API_BASE}/api/telemetry`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        updateDashboard(data);
        isConnected = true;
        demoMode = false;
        updateConnectionStatus(true);
    } catch (e) {
        console.warn('API no disponible, usando simulacion local:', e.message);
        isConnected = false;
        if (!demoMode) {
            demoMode = true;
            updateConnectionStatus(false);
            startLocalSimulation();
        }
    }
}

async function fetchAlarms() {
    try {
        const res = await fetch(`${API_BASE}/api/alarms`);
        if (!res.ok) return;
        const data = await res.json();
        renderAlarms(data.alarms);
    } catch (e) {}
}

// ============================================
// UPDATE DASHBOARD
// ============================================

function updateDashboard(data) {
    if (!data || !data.modules) return;
    const modules = data.modules;

    if (modules.A) updateModuleA(modules.A);
    if (modules.B) updateModuleB(modules.B);
    if (modules.C) updateModuleC(modules.C);
    if (modules.D) updateModuleD(modules.D);

    if (data.production_total !== undefined) {
        updateEl('production-total', formatNumber(data.production_total));
    }

    if (modules.B) {
        const rejection = calcRejection(modules.B.tds_in, modules.B.tds_out);
        updateEl('kpi-rejection', rejection);
        updateEl('kpi-quality', modules.B.tds_out || '--');
    }
    if (modules.D) {
        const eff = modules.D.consumption ? (modules.D.consumption / 10).toFixed(2) : '--';
        updateEl('kpi-consumption', eff);
    }

    if (data.uptime_seconds !== undefined) {
        updateEl('uptime', formatUptime(data.uptime_seconds));
    }
    if (data.timestamp) {
        updateEl('last-update', new Date(data.timestamp).toLocaleString('es-CO'));
    }
    if (data.location) {
        updateEl('location-name', data.location.name);
    }
}

function updateModuleA(d) {
    updateEl('mod-a-status', d.status);
    updateIndicator('mod-a-indicator', d.status);
    updateEl('mod-a-temp', d.temp + ' °C');
    updateEl('mod-a-pressure', d.pressure + ' bar');
    updateEl('mod-a-flow', d.flow + ' L/h');
}

function updateModuleB(d) {
    updateEl('mod-b-status', d.status);
    updateIndicator('mod-b-indicator', d.status);
    updateEl('mod-b-temp', d.temp + ' °C');
    updateEl('mod-b-pressure', d.pressure + ' bar');
    updateEl('mod-b-flow', d.flow + ' L/h');
    updateEl('mod-b-tds-in', formatNumber(d.tds_in) + ' ppm');
    updateEl('mod-b-tds-out', d.tds_out + ' ppm');
    updateEl('mod-b-rejection', calcRejection(d.tds_in, d.tds_out) + '%');
}

function updateModuleC(d) {
    updateEl('mod-c-status', d.status);
    updateIndicator('mod-c-indicator', d.status);
    updateEl('mod-c-temp', d.temp + ' °C');
    updateEl('mod-c-pressure', d.pressure + ' bar');
    updateEl('mod-c-flow', d.flow + ' L/h');
    const level = Math.round(d.tank_level);
    updateEl('mod-c-tank', level + '%');
    updateBar('mod-c-tank-bar', d.tank_level);
}

function updateModuleD(d) {
    updateEl('mod-d-status', d.status);
    updateIndicator('mod-d-indicator', d.status);
    updateEl('mod-d-solar', d.solar_prod + ' kW');
    updateEl('mod-d-battery', Math.round(d.battery) + '%');
    updateEl('mod-d-consumption', d.consumption + ' kW');
    updateEl('mod-d-scada', d.scada_status);
    updateBar('mod-d-battery-bar', d.battery);
}

// ============================================
// HELPERS
// ============================================

function updateEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateIndicator(id, status) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'status-indicator';
    if (status === 'warning' || status === 'maintenance') el.classList.add('warning');
    else if (status === 'error' || status === 'offline') el.classList.add('error');
}

function updateBar(id, val) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, val)) + '%';
}

function calcRejection(tdsIn, tdsOut) {
    if (!tdsIn || tdsIn === 0) return '0.0';
    return ((1 - tdsOut / tdsIn) * 100).toFixed(1);
}

function formatNumber(n) {
    if (n === undefined || n === null) return '--';
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}

function updateConnectionStatus(connected) {
    const el = document.getElementById('connection-status');
    if (!el) return;
    if (connected) {
        el.innerHTML = '<span class="dot"></span><span>En vivo</span>';
        el.className = 'connection-badge';
    } else {
        el.innerHTML = '<span class="dot"></span><span>Modo demo</span>';
        el.className = 'connection-badge offline';
    }
}

function renderAlarms(alarms) {
    const container = document.getElementById('alarms-list');
    if (!container) return;
    if (!alarms || alarms.length === 0) {
        container.innerHTML = '<div class="alarm-empty" style="text-align: center; color: var(--text-muted); padding: 20px;">✓ Sin alarmas activas</div>';
        return;
    }
    container.innerHTML = alarms.slice(0, 10).map(a => {
        const typeClass = a.alarm_type || 'info';
        const time = a.timestamp ? new Date(a.timestamp).toLocaleTimeString('es-CO') : '--';
        const mod = a.module_code || (a.module ? a.module.code : 'SYS');
        return `<div class="alarm-item ${typeClass}">
            <span class="alarm-time">${time}</span>
            <span class="alarm-module">${mod}</span>
            <span class="alarm-msg">${a.message}</span>
        </div>`;
    }).join('');
}

// ============================================
// LOCAL SIMULATION (offline/demo mode)
// ============================================

function startLocalSimulation() {
    if (localSimInterval) return;
    localSimInterval = setInterval(() => {
        for (let key in fallbackModules) {
            const mod = fallbackModules[key];
            if (key === 'A') {
                mod.temp = +(28 + (Math.random() - 0.5) * 4).toFixed(1);
                mod.pressure = +(2.0 + (Math.random() - 0.5) * 0.6).toFixed(2);
                mod.flow = Math.round(450 + (Math.random() - 0.5) * 60);
            } else if (key === 'B') {
                mod.temp = +(26 + (Math.random() - 0.5) * 2).toFixed(1);
                mod.pressure = +(55 + (Math.random() - 0.5) * 10).toFixed(1);
                mod.flow = Math.round(420 + (Math.random() - 0.5) * 40);
                mod.tds_in = Math.round(35000 + (Math.random() - 0.5) * 1000);
                mod.tds_out = Math.round(450 + (Math.random() - 0.5) * 100);
            } else if (key === 'C') {
                mod.temp = +(25 + (Math.random() - 0.5) * 2).toFixed(1);
                mod.pressure = +(1.5 + (Math.random() - 0.5) * 0.4).toFixed(2);
                mod.flow = Math.round(415 + (Math.random() - 0.5) * 30);
                mod.tank_level = Math.min(100, Math.max(0, mod.tank_level + (Math.random() - 0.5) * 5));
            } else if (key === 'D') {
                mod.solar_prod = +(18.5 + (Math.random() - 0.5) * 6).toFixed(1);
                mod.battery = Math.min(100, Math.max(0, mod.battery + (Math.random() - 0.5) * 3));
                mod.consumption = +(12.3 + (Math.random() - 0.5) * 2).toFixed(1);
            }
        }
        const now = new Date().toISOString();
        updateDashboard({
            modules: fallbackModules,
            production_total: Math.floor(Date.now() / 1000 / 60 * 7),
            uptime_seconds: Math.floor(Date.now() / 1000),
            timestamp: now,
            location: { name: "Manaure, La Guajira", lat: 11.78, lon: -72.45 }
        });
    }, 3000);
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    fetchTelemetry();
    fetchAlarms();
    setInterval(fetchTelemetry, 3000);
    setInterval(fetchAlarms, 10000);
    setInterval(() => { if (demoMode) fetchTelemetry(); }, 10000);
});

window.Aqua8 = {
    fetchTelemetry,
    fetchAlarms,
    isConnected: () => isConnected,
    isDemo: () => demoMode
};
