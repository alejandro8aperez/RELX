---
Document: AQ8-005
Title: SCADA & Industrial Network Topology
Version: 1.0
Status: Engineering Draft
Author: AQUA-8 Electrical & Automation Dept.
Date: 2026-06-26
Review: Pending
Approved: No
Confidentiality: Internal
---

# TOPOLOGÍA DE RED INDUSTRIAL Y SCADA

## 1. Arquitectura de Red (Niveles Purdue Modificados)

El sistema AQUA-8 utiliza una topología en estrella estructurada en tres niveles físicos y lógicos, optimizada para operaciones remotas (Edge-to-Cloud) bajo condiciones de baja conectividad.

### Nivel 0/1: Instrumentación y Actuadores (Campo)
Ubicado distribuido entre los Módulos A, B y C.
- **Protocolo Principal:** Modbus RTU (RS-485). Elegido por su extrema robustez frente a interferencias electromagnéticas (EMI) generadas por los variadores de los contenedores.
- **Equipos en RS-485:** 
  - VFD Bomba Alta Presión.
  - VFD Bomba Captación.
  - Transmisores de Presión Digitales.
- **Señales Análogas Convencionales:** Lazos de 4-20mA para conductivímetros, piranómetro (sensor solar) y nivel ultrasónico del tanque. Se cablean directamente a las I/O remotas del PLC.

### Nivel 2: Control Local (Edge - Módulo D)
El "Cerebro" de AQUA-8 reside en el Contenedor D.
- **Autómata Central (PLC):** Plataforma IEC-61131-3 (ej. Siemens S7-1200 o Edge Controller).
- **HMI Local:** Panel táctil industrial de 10" montado en la puerta del tablero para operación en modo manual/mantenimiento.
- **Bus de Control:** Ethernet Industrial (Profinet o EtherNet/IP) conectando el PLC, el HMI y los módulos de I/O de expansión.

### Nivel 3/4: Telemetría y Cloud (IoT)
La conexión de Manaure con el resto del mundo.
- **Gateway IoT:** Módem / Router Industrial 4G LTE con fallback Satelital (ej. Teltonika RUT o similar).
- **Protocolo Cloud:** **MQTT** (Message Queuing Telemetry Transport) sobre TLS.
  - *Publish:* El Gateway emite tramas JSON ligeras cada 5 minutos (Caudal, Presiones, TDS, Generación Solar) hacia el broker en la nube (AQUA-CLOUD).
  - *Subscribe:* El sistema está suscrito a comandos críticos (ej. Parada de Emergencia remota o ajuste del *Setpoint* de producción).
- **Ciberseguridad:** Túnel VPN IPSec entre el Gateway del contenedor y el servidor central de AQUA-8. Bloqueo de puertos no utilizados y firewall físico de hardware en el Edge.

---

## 2. Diagrama de Arquitectura de Red

```mermaid
graph TD
    %% Nivel Nube (IT / ERP)
    subgraph AQUA_CLOUD [AQUA-CLOUD & 8AMPERIOS ERP]
        A[Broker MQTT / AWS IoT]
        B[Dashboard Web AQUA-8]
        C[Base de Datos Time-Series]
        A <--> B
        A --> C
    end

    %% Nivel Edge / SCADA Local (Módulo D)
    subgraph MOD_D [CONTENEDOR D: EDGE CONTROL]
        D[Router IoT 4G/Satelital con Firewall]
        E[Switch Industrial Ethernet no administrado]
        F[PLC Principal]
        G[HMI Táctil Local]
        
        D -- "VPN / MQTT (TLS)" --> A
        D --- E
        F --- E
        G --- E
    end

    %% Nivel Campo (Proceso)
    subgraph CAMPO [INSTRUMENTACIÓN DE PROCESO (Mod A, B, C)]
        H[Red Modbus RTU / RS-485]
        I[VFD Bomba AP]
        J[VFD Bomba Captación]
        K[Entradas Análogas 4-20mA]
        L[Sensores Presión / Nivel / Calidad]
        
        F -- "Módulo Maestro RS-485" --> H
        H --> I
        H --> J
        F -- "Módulo I/O" --> K
        L --> K
    end

    style AQUA_CLOUD fill:#0f172a,stroke:#3b82f6,color:#fff
    style MOD_D fill:#1e293b,stroke:#f59e0b,color:#fff
    style CAMPO fill:#334155,stroke:#10b981,color:#fff
```

## 3. Filosofía de "Autonomía Resiliente"
Dada la ubicación aislada del proyecto piloto (Manaure), la red está diseñada para **no depender de la nube para operar**. Si la conexión 4G o satelital falla, el PLC local tiene la lógica P&ID (Proporcional-Integral-Derivativo) y los algoritmos de seguimiento solar (MPPT lógico) programados localmente. El sistema continuará operando de forma 100% segura, almacenando los datos históricos en una memoria SD local (Edge Data Logging) hasta que se restablezca la conexión, momento en el cual sincronizará el búfer con AQUA-CLOUD.
