---
Document: AQ8-CALC-001
Title: Memoria de Cálculo Eléctrico y Bombeo (Bomba AP y Arreglo Solar)
Version: 1.0
Status: Engineering Draft
Author: AQUA-8 Electrical Engineering Dept.
Date: 2026-06-26
Review: Pending
Approved: No
Confidentiality: Internal
---

# MEMORIA DE CÁLCULO ELÉCTRICO Y BOMBEO

## 1. Parámetros de Diseño y Base de Cálculo
Para garantizar la operación "Water-as-Battery" impulsada puramente por energía solar en Manaure, hemos restringido la ventana operativa de la planta a las **8 horas de mayor radiación solar diaria**.

- **Producción Objetivo:** 10,000 L/día (10 m³/día).
- **Ventana Operativa Solar:** 8 horas/día.
- **Caudal de Permeado (Producto):** $10 \text{ m}^3 / 8 \text{ h} = 1.25 \text{ m}^3/\text{h}$ (aprox. 21 L/min).
- **Tasa de Recuperación:** 45%.
- **Caudal de Alimentación (Agua de Mar):** $1.25 \text{ m}^3/\text{h} / 0.45 = 2.77 \text{ m}^3/\text{h}$ (aprox. 46 L/min).
- **Salinidad del Agua de Mar (Manaure):** ~35,000 a 40,000 ppm.
- **Presión Osmótica Estimada:** 65 bar (6,500 kPa).

---

## 2. Cálculo Hidráulico y Selección de Bomba de Alta Presión (HPP)

### 2.1. Potencia Hidráulica Sin Recuperación de Energía
Si no utilizáramos un dispositivo recuperador de energía (ERD), la potencia de la bomba sería:
\[ P_{hidraulica} = \frac{Q_{alim} \times P_{presion}}{3600 \times \eta_{bomba}} \]
Donde:
- $Q_{alim}$ = Caudal = $2.77 \text{ m}^3/\text{h}$
- $P_{presion}$ = Presión = $6,500 \text{ kPa}$
- $\eta_{bomba}$ = Eficiencia de bomba de pistones axiales = $0.85$ (85%)

\[ P_{hidraulica} = \frac{2.77 \times 6500}{3600 \times 0.85} = 5.88 \text{ kW} \]
*Consumo Específico Sin ERD:* $5.88 \text{ kW} / 1.25 \text{ m}^3/\text{h} = 4.7 \text{ kWh/m}^3$ (¡Demasiado alto para nuestro objetivo de < 3.0 kWh/m³!).

### 2.2. Potencia Eléctrica con Recuperador Isobárico (ERD)
La corriente de salmuera (el 55% del caudal de entrada, es decir $1.52 \text{ m}^3/\text{h}$) sale de las membranas a ~63 bar. Utilizaremos un ERD isobárico (ej. Danfoss iSave o Clark Pump) con una eficiencia de transferencia de presión del 92%.

- **Ahorro de energía por ERD:** ~ 55% de la carga hidráulica total.
- **Potencia Mecánica Requerida (Eje del Motor):** ~ 2.2 kW.
- **Eficiencia del Motor (IE5 VFD):** 95%.
- **Potencia Eléctrica Nominal (Bomba AP):** **2.31 kW**.

---

## 3. Cuadro de Cargas Eléctricas (Consumo del Sistema)

| Equipo / Sistema | Potencia (kW) | Horas de Uso (h/día) | Energía Diaria (kWh) |
|------------------|---------------|----------------------|----------------------|
| Bomba Alta Presión (RO) con ERD | 2.31 | 8 | 18.48 |
| Bomba de Captación (Sumergible) | 0.55 | 8 | 4.40 |
| Bomba Dosificadora (Químicos) | 0.05 | 8 | 0.40 |
| Lámpara UV (Desinfección) | 0.04 | 8 | 0.32 |
| PLC, SCADA e Instrumentación | 0.08 | 24 | 1.92 |
| Ventilación / Extracción Contenedor | 0.15 | 10 | 1.50 |
| **TOTAL** | **3.18 kW** | - | **27.02 kWh/día** |

### KPI de Ingeniería Logrado:
**Consumo Específico Total:** $3.18 \text{ kW} / 1.25 \text{ m}^3/\text{h} = \mathbf{2.54 \text{ kWh/m}^3}$
*(✅ Cumplimos el objetivo planteado de < 3.0 kWh/m³)*

---

## 4. Dimensionamiento del Sistema Solar (Generación)

Para suplir una carga continua de **3.18 kW** durante 8 horas bajo condiciones extremas (altas temperaturas reducen la eficiencia de los paneles):

### 4.1. Tamaño del Arreglo Solar
- **Derating Factor (Temperatura y Polvo en La Guajira):** 0.75
- **Potencia Pico Requerida (kWp):** $3.18 \text{ kW} / 0.75 = \mathbf{4.24 \text{ kWp}}$

### 4.2. Selección de Paneles (Techo Desplegable)
- **Panel Seleccionado:** Monocristalino N-Type Bi-facial 500W.
- **Cantidad Necesaria:** $4240 \text{ W} / 500 \text{ W} = 8.48 \Rightarrow$ **9 Paneles**.
- Por simetría mecánica en el techo del contenedor, instalaremos **10 paneles de 500W (5.0 kWp total)**.
- **Configuración Eléctrica:** 1 string de 10 paneles en serie.
  - $V_{oc}$ por panel: ~45V DC $\rightarrow$ $V_{total}$ String: **450V DC**.
  - Este voltaje es perfecto para alimentar directamente el Bus DC del Variador de Frecuencia (VFD) de la Bomba de Alta Presión sin transformadores intermedios.
