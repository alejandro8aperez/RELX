import time
import random
import json
from datetime import datetime

class AquaCorePLC:
    def __init__(self):
        # Estados del sistema (Actuadores)
        self.vfd_captacion = False     # P-101
        self.vfd_alta_presion = False  # P-201
        self.valvula_derivacion = "TANQUE" # CV-301 ("TANQUE" o "DRENAJE")
        
        # Variables de Proceso (Sensores)
        self.nivel_tanque_pct = 85.0   # LT-301 (%)
        self.calidad_tds_ppm = 250.0   # QT-201 (ppm)
        self.presion_entrada_bar = 2.0 # PT-101
        self.presion_salida_bar = 1.8  # PT-102
        
        # Setpoints (Parámetros de control)
        self.sp_nivel_max = 98.0
        self.sp_nivel_min = 20.0
        self.sp_tds_max = 500.0
        self.sp_dif_presion_max = 1.5

        # Estado General
        self.estado_planta = "STANDBY"
        self.alarmas_activas = []

    def leer_sensores(self):
        """Simula la lectura de sensores de campo (4-20mA / Modbus)"""
        if self.estado_planta == "PRODUCIENDO":
            # Si produce, el tanque se llena y los filtros se ensucian lentamente
            self.nivel_tanque_pct += 0.5
            self.presion_salida_bar -= random.uniform(0.001, 0.05) 
            
            # Fluctuación de calidad de agua
            if random.random() > 0.95:
                # Simular pico de mala calidad
                self.calidad_tds_ppm = random.uniform(450, 600)
            else:
                self.calidad_tds_ppm = random.uniform(150, 300)
        else:
            # Si está apagada, la comunidad consume agua del tanque
            self.nivel_tanque_pct -= 0.8
            self.calidad_tds_ppm = 0.0

        # Limitar valores físicos
        self.nivel_tanque_pct = max(0, min(100, self.nivel_tanque_pct))

    def lazo_control_nivel(self):
        """Lazo P&ID 3: Control de Nivel de Tanque (LT-301)"""
        if self.nivel_tanque_pct >= self.sp_nivel_max and self.estado_planta == "PRODUCIENDO":
            print("[INFO] Tanque Lleno. Iniciando secuencia Soft Stop...")
            self.vfd_captacion = False
            self.vfd_alta_presion = False
            self.estado_planta = "STANDBY"
            self.valvula_derivacion = "DRENAJE" # Posición segura
            
        elif self.nivel_tanque_pct <= self.sp_nivel_min and self.estado_planta == "STANDBY":
            print("[INFO] Nivel Bajo. Iniciando secuencia de Arranque (Soft Start)...")
            self.vfd_captacion = True
            time.sleep(1) # Simula retraso mecánico
            self.vfd_alta_presion = True
            self.estado_planta = "PRODUCIENDO"
            self.valvula_derivacion = "TANQUE"

    def lazo_control_calidad(self):
        """Lazo P&ID 1: Válvula de Derivación por Alta Salinidad (QT-201)"""
        if self.estado_planta == "PRODUCIENDO":
            if self.calidad_tds_ppm > self.sp_tds_max:
                if self.valvula_derivacion != "DRENAJE":
                    print(f"[ALERTA] Alta Salinidad ({self.calidad_tds_ppm:.1f} ppm). Abriendo CV-301 a DRENAJE.")
                    self.valvula_derivacion = "DRENAJE"
                    self.alarmas_activas.append("ALTA_SALINIDAD")
            else:
                if self.valvula_derivacion == "DRENAJE" and "ALTA_SALINIDAD" not in self.alarmas_activas:
                    print(f"[INFO] Calidad recuperada ({self.calidad_tds_ppm:.1f} ppm). CV-301 a TANQUE.")
                    self.valvula_derivacion = "TANQUE"
                
                if "ALTA_SALINIDAD" in self.alarmas_activas:
                    self.alarmas_activas.remove("ALTA_SALINIDAD")

    def lazo_control_ensuciamiento(self):
        """Lazo P&ID 2: Diferencial de Presión en Filtros (PT-101 vs PT-102)"""
        dif_presion = self.presion_entrada_bar - self.presion_salida_bar
        if dif_presion > self.sp_dif_presion_max:
            if "FILTRO_COLMATADO" not in self.alarmas_activas:
                print(f"[ALERTA CRÍTICA] Diferencial Presión Alto ({dif_presion:.2f} bar). Cambio de filtro F-103 requerido.")
                self.alarmas_activas.append("FILTRO_COLMATADO")
                # En un caso real severo, apagaríamos la planta.

    def emitir_telemetria_mqtt(self):
        """Simula el envío de datos JSON a AQUA-CLOUD cada ciclo"""
        payload = {
            "timestamp": datetime.utcnow().isoformat(),
            "estado": self.estado_planta,
            "sensores": {
                "nivel_tanque_pct": round(self.nivel_tanque_pct, 1),
                "tds_ppm": round(self.calidad_tds_ppm, 1),
                "presion_in_bar": round(self.presion_entrada_bar, 2),
                "presion_out_bar": round(self.presion_salida_bar, 2),
                "dif_presion_bar": round(self.presion_entrada_bar - self.presion_salida_bar, 2)
            },
            "actuadores": {
                "vfd_p101_on": self.vfd_captacion,
                "vfd_p201_on": self.vfd_alta_presion,
                "valvula_cv301": self.valvula_derivacion
            },
            "alarmas": self.alarmas_activas
        }
        print(f"[MQTT PUBLISH] Topic: aqua8/manaure/telemetry -> {json.dumps(payload)}")
        print("-" * 60)

    def ciclo_scan(self):
        """Ciclo principal de ejecución del PLC (Scan Cycle)"""
        self.leer_sensores()
        self.lazo_control_nivel()
        self.lazo_control_calidad()
        self.lazo_control_ensuciamiento()
        self.emitir_telemetria_mqtt()

# Ejecución de la simulación
if __name__ == "__main__":
    print("==================================================")
    print("  AQUA-CORE PLC SIMULATOR v1.0 (Modo Consola)     ")
    print("==================================================")
    
    plc = AquaCorePLC()
    plc.estado_planta = "PRODUCIENDO"
    plc.vfd_captacion = True
    plc.vfd_alta_presion = True
    
    try:
        # Simulamos 10 ciclos (representando un tiempo acelerado)
        for i in range(10):
            plc.ciclo_scan()
            time.sleep(1.5) # Pausa entre ciclos
    except KeyboardInterrupt:
        print("\n[INFO] Simulación terminada por el usuario.")
