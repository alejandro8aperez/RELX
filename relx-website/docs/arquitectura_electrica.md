# Especificación de Ingeniería Eléctrica y SCADA: AQUA-8

## 1. Topología del Sistema Solar (Generación)
El sistema operará bajo un esquema de **Microred Híbrida DC-Coupled**, priorizando el uso directo de energía sin almacenamiento en baterías químicas profundas ("Water-as-Battery").

### Especificaciones de Paneles (Techo Desplegable)
- **Tecnología:** Módulos fotovoltaicos Monocristalinos PERC (Bi-faciales recomendados por la alta albedo de la arena de La Guajira).
- **Potencia Nominal:** ~4.0 kWp (aprox. 8-10 paneles de 450W integrados en el techo plegable del Contenedor D).
- **Controladores de Carga:** MPPT Industriales para optimizar el punto de máxima potencia según la irradiancia en tiempo real.

## 2. Diagrama Unifilar (Concepto de Distribución)

El bus principal operará en Corriente Continua (DC) para alimentar directamente el variador de la bomba principal, ahorrando pérdidas por doble conversión.

1. **Generación:** `String FV` -> `Caja Combinadora + DPS` -> `MPPT`
2. **Bus Principal DC:** Barra de ~400V DC.
3. **Cargas Principales (Accionamientos directos):**
   - VFD (Variador de Frecuencia) DC-Input -> Bomba Alta Presión (RO)
   - VFD DC-Input -> Bomba de Captación de Agua de Mar
4. **Cargas Menores y Control:**
   - Inversor DC/AC (Onda Senoidal Pura 1kW) -> Servicios Auxiliares, iluminación, desinfección UV.
   - Fuente Conmutada 24V DC -> PLC, Sensores, Electroválvulas.
5. **Respaldo (Opcional):**
   - Banco UPS pequeño (LiFePO4) 24V/100Ah exclusivamente para mantener activo el SCADA y comunicaciones durante la noche.

## 3. Arquitectura SCADA y Automatización

El cerebro de AQUA-8 se aloja en el Contenedor D, comunicándose vía Modbus/TCP y señales análogas (4-20mA).

### Sensores (Inputs)
- **Módulo A (Captación):** Transmisores de Presión Diferencial (para medir colmatación de filtros), Flujómetro de entrada.
- **Módulo B (Ósmosis):** Transmisores de Presión Alta (>60 bar), Conductivímetro (Salinidad de entrada).
- **Módulo C (Agua Potable):** Conductivímetro (TDS de salida), Sensor ultrasónico de nivel de tanque, Flujómetro de producto.
- **Módulo D (Energía):** Piranómetro (Irradiancia W/m²), Voltímetros/Amperímetros DC de strings, Sensor de temperatura ambiente y de panel.

### Actuadores (Outputs)
- Variadores de Velocidad (VFD) de las bombas.
- Electroválvulas proporcionales para purga y derivación de producto fuera de norma.
- Electroválvula de lavado (CIP).

### Topología de Red y Telemetría
- **Autómata:** PLC Industrial (ej. Siemens S7-1200 o Allen Bradley CompactLogix) o plataforma Edge IPC.
- **Protocolo Industrial:** Modbus RTU (RS-485) para VFDs; Ethernet/IP para HMI local.
- **Gateway IoT:** Módem 4G LTE / Satelital con soporte MQTT. Envía tramas JSON cada 5 minutos a la nube (AWS/Azure) para visualización en el dashboard web.
- **Ciberseguridad:** Túnel VPN, firewall industrial, y operaciones de escritura (comandos) limitadas y autenticadas.
