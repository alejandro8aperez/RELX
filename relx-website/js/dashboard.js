// dashboard.js - SCADA Simulator for AQUA-8

document.addEventListener('DOMContentLoaded', () => {
    // Clock update
    const clockElement = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }, 1000);

    // DOM Elements for telemetry
    const valInflow = document.getElementById('val-inflow');
    const valPressure = document.getElementById('val-pressure');
    const valBrine = document.getElementById('val-brine');
    const valTds = document.getElementById('val-tds');
    const valTank = document.getElementById('val-tank');
    const valPower = document.getElementById('val-power');
    
    const kpiProd = document.getElementById('kpi-prod');
    const kpiEnergy = document.getElementById('kpi-energy');
    
    const tankFill = document.getElementById('tank-fill');
    const powerFill = document.getElementById('power-fill');

    // Base values
    let currentInflow = 925;
    let currentPressure = 65.2;
    let currentTds = 115;
    let tankLevel = 75;
    let currentPower = 3.2;

    // Simulate SCADA data polling every 1.5 seconds
    setInterval(() => {
        // Solar Power Fluctuation (2.8 to 3.5 kW)
        const powerJitter = (Math.random() * 0.2) - 0.1;
        currentPower = Math.max(2.8, Math.min(3.5, currentPower + powerJitter));
        valPower.textContent = `${currentPower.toFixed(2)} kW`;
        powerFill.style.width = `${(currentPower / 4.0) * 100}%`;
        
        // Update KPI Energy (Specific Energy Consumption kWh/m3)
        // Inversely proportional to power efficiency (simulation)
        const specEnergy = (currentPower / 3.2) * 2.8; 
        kpiEnergy.textContent = specEnergy.toFixed(2);

        // Inflow Fluctuation (based on power availability)
        const inflowJitter = (Math.random() * 10) - 5;
        currentInflow = Math.max(900, Math.min(950, currentInflow + inflowJitter));
        valInflow.textContent = `${Math.round(currentInflow)} L/h`;

        // Brine outflow (Constant ~55% of inflow due to 45% recovery)
        const brineOut = currentInflow * 0.55;
        valBrine.textContent = `${Math.round(brineOut)} L/h`;

        // Pressure Fluctuation
        const presJitter = (Math.random() * 0.4) - 0.2;
        currentPressure = Math.max(64.0, Math.min(67.0, currentPressure + presJitter));
        valPressure.textContent = `${currentPressure.toFixed(1)} bar`;

        // TDS Fluctuation
        if (Math.random() > 0.8) {
            const tdsJitter = (Math.random() > 0.5) ? 1 : -1;
            currentTds = Math.max(110, Math.min(125, currentTds + tdsJitter));
            valTds.textContent = `${currentTds} ppm`;
        }

        // Tank Level (Slowly increasing)
        if (tankLevel < 100) {
            tankLevel += 0.1;
            valTank.textContent = `${tankLevel.toFixed(1)}%`;
            tankFill.style.width = `${tankLevel}%`;
        }

    }, 1500);
});
