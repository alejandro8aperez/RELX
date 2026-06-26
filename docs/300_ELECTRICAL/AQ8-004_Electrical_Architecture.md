---
Document: AQ8-004
Title: Electrical Architecture
Version: 0.1
Status: Engineering Draft
Author: AQUA-8 Electrical Engineering Dept.
Date: 2026-06-26
Review: Pending
Approved: No
Confidentiality: Internal
---

# FILOSOFÍA ELÉCTRICA Y DE AUTOMATIZACIÓN

## 1. Alimentación Solar y Microred DC
AQUA-8 opera como una microred aislada optimizada para bombas de alta presión. 
Se implementa una arquitectura **DC-Coupled**, donde los paneles solares, a través de controladores MPPT, alimentan un bus DC principal de ~400V. Los variadores de frecuencia (VFD) se alimentan directamente de este bus DC, eliminando las pérdidas de inversión a AC y rectificación en el VFD.

## 2. "Water-as-Battery" (Filosofía de Almacenamiento)
Se rechaza el uso de grandes bancos de baterías de plomo/litio por su costo, toxicidad y mantenimiento. La planta ajusta su producción de agua en tiempo real a la curva de irradiancia solar. El almacenamiento de energía se realiza de forma térmica y potencial al almacenar **agua dulce en tanques** durante las horas pico de sol. Se utiliza un pequeño banco UPS (24V) exclusivamente para el sistema SCADA y comunicaciones nocturnas.

## 3. Variadores y Motores
- Todos los motores principales (Bomba AP y Captación) serán accionados por VFDs con control vectorial.
- Eficiencia clase IE4/IE5 para minimizar el consumo.

## 4. Comunicaciones y Red Industrial (SCADA)
El "Cerebro" de la planta se encuentra en el Módulo D.
- **Bus de Campo:** Modbus RTU / TCP para VFDs e instrumentación.
- **Autómata:** PLC industrial modular para control distribuido.
- **IoT & Cloud:** Integración Edge-to-Cloud mediante protocolo MQTT para alimentar AQUA-CLOUD y el dashboard de monitoreo remoto.
