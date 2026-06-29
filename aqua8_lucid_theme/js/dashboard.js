// ============================================================
// AQUA-8 Lucid Dashboard — Conectado a API en vivo
// ============================================================

const API_BASE = '';
let isConnected = false;
let demoMode = false;

// Datos de fallback para modo offline
const fallbackModules = {
    A: { name: "Captación y Pretratamiento", status: "online", temp: 28.5, pressure: 2.1, flow: 450 },
    B: { name: "Ósmosis Inversa (RO)", status: "online", temp: 26.0, pressure: 55.0, flow: 420, tds_in: 35000, tds_out: 450 },
    C: { name: "Postratamiento y Almacenamiento", status: "online", temp: 25.0, pressure: 1.5, flow: 415, tank_level: 78 },
    D: { name: "Energía Solar y SCADA", status: "online", solar_prod: 18.5, battery: 92, consumption: 12.3, scada_status: "active" }
};

// ============================================================
// FETCH DE TELEMETRÍA EN VIVO
// ============================================================

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
        console.warn('API no disponible, usando simulación local:', e.message);
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
    } catch (e) {
        // Silencioso en modo offline
    }
}

async function fetchHistorical() {
    try {
        const res = await fetch(`${API_BASE}/api/historical?hours=24`);
        if (!res.ok) return;
        const data = await res.json();
        renderCharts(data.data);
    } catch (e) {
        // Silencioso
    }
}

// ============================================================
// ACTUALIZAR DASHBOARD CON DATOS REALES
// ============================================================

function updateDashboard(data) {
    if (!data || !data.modules) return;

    const modules = data.modules;

    // Módulo A — Captación
    if (modules.A) updateModuleA(modules.A);

    // Módulo B — RO
    if (modules.B) updateModuleB(modules.B);

    // Módulo C — Postratamiento
    if (modules.C) updateModuleC(modules.C);

    // Módulo D — Energía
    if (modules.D) updateModuleD(modules.D);

    // KPIs globales
    if (data.production_total !== undefined) {
        updateElement('production-total', formatNumber(data.production_total));
    }

    // Calcular KPIs derivados
    if (modules.B) {
        const rejection = calculateRejection(modules.B.tds_in, modules.B.tds_out);
        updateElement('kpi-rejection', rejection);
        updateElement('kpi-quality', modules.B.tds_out || '--');
    }
    if (modules.D) {
        const eff = modules.D.consumption ? (modules.D.consumption / 10).toFixed(2) : '--';
        updateElement('kpi-consumption', eff);
    }

    // Uptime
    if (data.uptime_seconds !== undefined) {
        updateElement('uptime', formatUptime(data.uptime_seconds));
    }

    // Timestamp
    if (data.timestamp) {
        updateElement('last-update', new Date(data.timestamp).toLocaleString('es-CO'));
    }

    // Location
    if (data.location) {
        updateElement('location-name', data.location.name);
    }
}

function updateModuleA(data) {
    updateElement('mod-a-status', data.status);
    updateStatusIndicator('mod-a-indicator', data.status);
    updateElement('mod-a-temp', data.temp + ' °C');
    updateElement('mod-a-pressure', data.pressure + ' bar');
    updateElement('mod-a-flow', data.flow + ' L/h');
}

function updateModuleB(data) {
    updateElement('mod-b-status', data.status);
    updateStatusIndicator('mod-b-indicator', data.status);
    updateElement('mod-b-temp', data.temp + ' °C');
    updateElement('mod-b-pressure', data.pressure + ' bar');
    updateElement('mod-b-flow', data.flow + ' L/h');
    updateElement('mod-b-tds-in', formatNumber(data.tds_in) + ' ppm');
    updateElement('mod-b-tds-out', data.tds_out + ' ppm');
    updateElement('mod-b-rejection', calculateRejection(data.tds_in, data.tds_out) + '%');
}

function updateModuleC(data) {
    updateElement('mod-c-status', data.status);
    updateStatusIndicator('mod-c-indicator', data.status);
    updateElement('mod-c-temp', data.temp + ' °C');
    updateElement('mod-c-pressure', data.pressure + ' bar');
    updateElement('mod-c-flow', data.flow + ' L/h');
    updateElement('mod-c-tank', Math.round(data.tank_level) + '%');
    updateTankVisual('mod-c-tank-bar', data.tank_level);
}

function updateModuleD(data) {
    updateElement('mod-d-status', data.status);
    updateStatusIndicator('mod-d-indicator', data.status);
    updateElement('mod-d-solar', data.solar_prod + ' kW');
    updateElement('mod-d-battery', Math.round(data.battery) + '%');
    updateElement('mod-d-consumption', data.consumption + ' kW');
    updateElement('mod-d-scada', data.scada_status);
    updateBatteryVisual('mod-d-battery-bar', data.battery);
}

// ============================================================
// HELPERS
// ============================================================

function updateElement(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateStatusIndicator(id, status) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'status-indicator';
    if (status === 'warning' || status === 'maintenance') {
        el.classList.add('warning');
    } else if (status === 'error' || status === 'offline') {
        el.classList.add('error');
    } else if (status === 'online' || status === 'active' || status === 'running') {
        el.classList.add('online');
    }
}

function updateTankVisual(id, level) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, level)) + '%';
}

function updateBatteryVisual(id, level) {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, Math.max(0, level)) + '%';
}

function calculateRejection(tdsIn, tdsOut) {
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

// ============================================================
// ALARMAS
// ============================================================

function renderAlarms(alarms) {
    const container = document.getElementById('alarms-list');
    if (!container) return;

    if (!alarms || alarms.length === 0) {
        container.innerHTML = '<div class="alarm-empty">✓ Sin alarmas activas</div>';
        return;
    }

    container.innerHTML = alarms.slice(0, 10).map(a => {
        const typeClass = a.alarm_type || 'info';
        const time = a.timestamp ? new Date(a.timestamp).toLocaleTimeString('es-CO') : '--';
        const moduleCode = a.module_code || (a.module ? a.module.code : 'SYS');
        return `<div class="alarm-item ${typeClass}">
            <span class="alarm-time">${time}</span>
            <span class="alarm-module">${moduleCode}</span>
            <span class="alarm-msg">${a.message}</span>
        </div>`;
    }).join('');
}

// ============================================================
// GRÁFICOS (placeholder)
// ============================================================

function renderCharts(data) {
    window.historicalData = data;
    document.dispatchEvent(new CustomEvent('aqua8-data-update', { detail: data }));
}

// ============================================================
// SIMULACIÓN LOCAL (modo offline/demo)
// ============================================================

let localSimInterval = null;

function startLocalSimulation() {
    if (localSimInterval) return;
    console.log('🎮 Modo demo activado');

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

function stopLocalSimulation() {
    if (localSimInterval) {
        clearInterval(localSimInterval);
        localSimInterval = null;
    }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌊 AQUA-8 Lucid Dashboard iniciado');

    fetchTelemetry();
    fetchAlarms();
    fetchHistorical();

    setInterval(fetchTelemetry, 3000);
    setInterval(fetchAlarms, 10000);
    setInterval(fetchHistorical, 60000);

    setInterval(() => {
        if (demoMode) fetchTelemetry();
    }, 10000);
});

window.Aqua8 = {
    fetchTelemetry,
    fetchAlarms,
    fetchHistorical,
    isConnected: () => isConnected,
    isDemo: () => demoMode
};
