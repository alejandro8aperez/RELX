import os
import random
import json
from datetime import datetime, timedelta
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI(title="AQUA-8 Cloud Platform", version="1.0.0")

# Servir archivos estáticos del frontend desde relx-website
app.mount("/assets", StaticFiles(directory="relx-website/assets"), name="assets")
app.mount("/css", StaticFiles(directory="relx-website/css"), name="css")
app.mount("/js", StaticFiles(directory="relx-website/js"), name="js")
app.mount("/docs-site", StaticFiles(directory="relx-website/docs"), name="docs-site")

# ==================== DATOS SIMULADOS ====================

class Aqua8Simulator:
    def __init__(self):
        self.modules = {
            "A": {"name": "Captación y Pretratamiento", "status": "online", "temp": 28.5, "pressure": 2.1, "flow": 450},
            "B": {"name": "Ósmosis Inversa (RO)", "status": "online", "temp": 26.0, "pressure": 55.0, "flow": 420, "tds_in": 35000, "tds_out": 450},
            "C": {"name": "Postratamiento y Almacenamiento", "status": "online", "temp": 25.0, "pressure": 1.5, "flow": 415, "tank_level": 78},
            "D": {"name": "Energía Solar y SCADA", "status": "online", "solar_prod": 18.5, "battery": 92, "consumption": 12.3, "scada_status": "active"}
        }
        self.alarms = []
        self.production_total = 0
        self.start_time = datetime.now()

    def update(self):
        # Simular variaciones realistas
        for key in self.modules:
            mod = self.modules[key]
            if key == "A":
                mod["temp"] = round(28 + random.uniform(-2, 2), 1)
                mod["pressure"] = round(2.0 + random.uniform(-0.3, 0.3), 2)
                mod["flow"] = int(450 + random.uniform(-30, 30))
            elif key == "B":
                mod["temp"] = round(26 + random.uniform(-1, 1), 1)
                mod["pressure"] = round(55 + random.uniform(-5, 5), 1)
                mod["flow"] = int(420 + random.uniform(-20, 20))
                mod["tds_in"] = int(35000 + random.uniform(-500, 500))
                mod["tds_out"] = int(450 + random.uniform(-50, 50))
            elif key == "C":
                mod["temp"] = round(25 + random.uniform(-1, 1), 1)
                mod["pressure"] = round(1.5 + random.uniform(-0.2, 0.2), 2)
                mod["flow"] = int(415 + random.uniform(-15, 15))
                mod["tank_level"] = min(100, max(0, mod["tank_level"] + random.uniform(-2, 3)))
            elif key == "D":
                mod["solar_prod"] = round(18.5 + random.uniform(-3, 3), 1)
                mod["battery"] = min(100, max(0, mod["battery"] + random.uniform(-1, 2)))
                mod["consumption"] = round(12.3 + random.uniform(-1, 1), 1)

        # Calcular producción acumulada (aprox 10,000 L/día = ~7 L/min)
        elapsed = (datetime.now() - self.start_time).total_seconds()
        self.production_total = int((elapsed / 60) * 7)

        # Generar alarmas aleatorias ocasionales
        if random.random() < 0.02:  # 2% de probabilidad por ciclo
            alarm_types = [
                {"type": "warning", "message": "Presión RO ligeramente alta", "module": "B"},
                {"type": "info", "message": "Limpieza automática iniciada", "module": "A"},
                {"type": "warning", "message": "Nivel de tanque > 90%", "module": "C"},
                {"type": "info", "message": "Optimización energética activada", "module": "D"}
            ]
            alarm = random.choice(alarm_types)
            alarm["timestamp"] = datetime.now().isoformat()
            alarm["id"] = len(self.alarms)
            self.alarms.insert(0, alarm)
            self.alarms = self.alarms[:50]  # Mantener solo últimas 50

    def get_telemetry(self):
        self.update()
        return {
            "modules": self.modules,
            "production_total": self.production_total,
            "uptime_seconds": int((datetime.now() - self.start_time).total_seconds()),
            "timestamp": datetime.now().isoformat(),
            "location": {"name": "Manaure, La Guajira", "lat": 11.78, "lon": -72.45}
        }

    def get_alarms(self):
        return {"alarms": self.alarms, "count": len(self.alarms)}

    def get_historical(self, hours=24):
        # Generar datos históricos simulados
        data = []
        now = datetime.now()
        for i in range(hours * 4):  # Cada 15 min
            t = now - timedelta(minutes=15 * i)
            data.append({
                "timestamp": t.isoformat(),
                "production": int(7 * 15 * i + random.uniform(-50, 50)),
                "energy_consumption": round(12 + random.uniform(-2, 2), 1),
                "solar_generation": round(18 + random.uniform(-4, 4), 1),
                "tds_out": int(450 + random.uniform(-30, 30)),
                "tank_level": min(100, max(0, 50 + random.uniform(-20, 20)))
            })
        return {"data": list(reversed(data))}

simulator = Aqua8Simulator()

# ==================== ENDPOINTS API ====================

@app.get("/")
async def root():
    return FileResponse("relx-website/index.html")

@app.get("/api/telemetry")
async def telemetry():
    return simulator.get_telemetry()

@app.get("/api/alarms")
async def alarms():
    return simulator.get_alarms()

@app.get("/api/historical")
async def historical(hours: int = 24):
    return simulator.get_historical(hours)

@app.get("/api/status")
async def status():
    return {
        "platform": "AQUA-8 Cloud",
        "version": "1.0.0",
        "status": "operational",
        "modules_online": 4,
        "timestamp": datetime.now().isoformat()
    }

# ==================== WEBSOCKET (TIEMPO REAL) ====================

class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = simulator.get_telemetry()
            await websocket.send_json(data)
            await __import__("asyncio").sleep(2)  # Enviar cada 2 segundos
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# ==================== MAIN ====================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
