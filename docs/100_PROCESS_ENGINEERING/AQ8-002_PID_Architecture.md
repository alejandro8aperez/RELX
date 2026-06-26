---
Document: AQ8-002
Title: Piping and Instrumentation Diagram (P&ID) Architecture
Version: 1.0
Status: Engineering Draft
Author: AQUA-8 Process Engineering Dept.
Date: 2026-06-26
Review: Pending
Approved: No
Confidentiality: Internal
---

# ARQUITECTURA DE TUBERÍAS E INSTRUMENTACIÓN (P&ID)

Este documento describe la lógica de flujo, válvulas e instrumentación de la plataforma AQUA-8. La nomenclatura de equipos sigue el estándar ISA-S5.1.

## 1. Nomenclatura P&ID Básica
- **P-100:** Bombas (Pumps).
- **F-100:** Filtros (Filters).
- **V-100:** Válvulas Manuales (Valves).
- **CV-100:** Válvulas de Control / Solenoides (Control Valves).
- **PI / PT:** Indicador / Transmisor de Presión (Pressure Transmitter).
- **FI / FT:** Indicador / Transmisor de Flujo (Flow Transmitter).
- **QI / QT:** Analizador de Calidad (Conductividad/ORP).
- **RO-100:** Tren de Ósmosis Inversa.
- **ERD-100:** Dispositivo Recuperador de Energía (Isobárico).

---

## 2. Diagrama Lógico P&ID (Mermaid)

El siguiente diagrama detalla la interconexión de las tuberías (líneas continuas) y la instrumentación eléctrica (líneas punteadas hacia el PLC).

```mermaid
graph TD
    %% Leyenda de líneas
    %% --> Tubería de Proceso
    %% -.-> Señal Eléctrica al PLC

    subgraph "MÓDULO A: PRETRATAMIENTO (CONTENEDOR 1)"
        IN((Captación Mar)) -->|Tubería HDPE| P_101[Bomba Captación P-101]
        P_101 --> FT_101((FT-101))
        FT_101 --> F_101[Filtro Malla Autolimpiante F-101]
        
        F_101 --> CV_101{Válvula Control CV-101}
        CV_101 --> F_102[Filtro Multimedia F-102]
        
        F_102 --> PT_101((PT-101))
        PT_101 --> F_103[Filtro Cartucho 5µm F-103]
        F_103 --> PT_102((PT-102))
        
        %% Diferencial de presión
        PT_101 -.->|Señal 4-20mA| PLC
        PT_102 -.->|Señal 4-20mA| PLC
    end

    subgraph "MÓDULO B: ÓSMOSIS Y ERD (CONTENEDOR 2)"
        PT_102 --> P_201[Bomba Alta Presión P-201]
        
        P_201 --> PT_201((PT-201 Alta Presión))
        PT_201 --> RO_201[Rack Membranas RO-201]
        
        %% Flujo de Salmuera (Rechazo) a Alta Presión
        RO_201 -->|Salmuera ~63 bar| ERD_201[Recuperador Isobárico ERD-201]
        ERD_201 -->|Salmuera Baja Presión| CV_201{Válvula Reguladora CV-201}
        CV_201 --> OUT_BRINE((Descarga a Salinas))
        
        %% Presión transferida por el ERD al agua de alimentación
        ERD_201 -.->|Agua Presurizada| P_201
        
        %% Flujo de Permeado (Producto)
        RO_201 -->|Permeado Baja Presión| QT_201((Conductivímetro QT-201))
        QT_201 -.->|Lectura TDS| PLC
    end

    subgraph "MÓDULO C: POSTRATAMIENTO (CONTENEDOR 3)"
        QT_201 --> CV_301{Válvula Derivación CV-301}
        
        CV_301 -->|Falla Calidad| DRAIN((Drenaje))
        CV_301 -->|Calidad OK| F_301[Filtro Calcita F-301]
        
        F_301 --> UV_301[Esterilizador UV-301]
        UV_301 --> TK_301[(Tanque Producto TK-301)]
        
        TK_301 --> LT_301((Transmisor Nivel LT-301))
        LT_301 -.->|Control Llenado| PLC
    end

    subgraph "MÓDULO D: SCADA (CONTENEDOR 4)"
        PLC[PLC Principal Modbus/TCP]
        PLC -.->|Comando VFD| P_101
        PLC -.->|Comando VFD| P_201
        PLC -.->|Abre/Cierra| CV_301
    end
    
    style PLC fill:#f59e0b,stroke:#b45309,color:#fff
    style RO_201 fill:#10b981,stroke:#047857,color:#fff
    style TK_301 fill:#0ea5e9,stroke:#0369a1,color:#fff
```

## 3. Criterios de Tuberías (Piping)
- **Baja Presión (Captación y Permeado):** PVC Cédula 80 o HDPE (Polietileno de Alta Densidad). Corrosión cero y bajo costo.
- **Alta Presión (RO y ERD):** Acero Inoxidable Dúplex (2205) o Super Dúplex (2507) para resistir presiones >65 bar y corrosión por cloruros a largo plazo.

## 4. Filosofía de Control (Lazos P&ID)
1. **Lazo de Calidad:** Si el conductivímetro `QT-201` detecta TDS > 500 ppm, el PLC abre inmediatamente la válvula desviadora de 3 vías `CV-301` enviando el agua al drenaje para evitar contaminar el tanque de almacenamiento `TK-301`.
2. **Lazo de Ensuciamiento:** Si el diferencial de presión entre `PT-101` y `PT-102` supera los 1.5 bar, el PLC dispara una alarma en AQUA-SCADA indicando que se debe cambiar el filtro de cartucho `F-103`.
3. **Lazo de Nivel:** Cuando el tanque `TK-301` llega al 100% de nivel (`LT-301`), el PLC entra en secuencia de apagado suave (Soft Stop), reduciendo progresivamente la velocidad de los variadores (VFD) de las bombas `P-101` y `P-201`.
