---
Document: ADR-001
Title: Why ISO Containers?
Version: 1.0
Status: Approved
Author: AQUA-8 Engineering Team
Date: 2026-06-26
Review: Completed
Approved: Yes
Confidentiality: Internal
---

# Architecture Decision Record 001: Contenedores ISO

## Contexto
Las plantas desalinizadoras para comunidades pequeñas y medianas tradicionalmente se construyen *in situ*, lo que requiere obras civiles, edificaciones y montaje de tuberías en terrenos a menudo remotos y sin infraestructura.

## Decisión
Hemos decidido estandarizar el diseño de la plataforma AQUA-8 utilizando **Contenedores Marítimos ISO de 20 pies** como el chasis y la envolvente principal de la planta. Cada contenedor albergará un módulo específico del proceso (Captación, RO, Postratamiento, Energía/SCADA).

## Justificación
1. **Transporte Estandarizado:** Los contenedores de 20 pies pueden ser transportados globalmente por barcos y camiones estándar, reduciendo drásticamente los costos logísticos.
2. **Fabricación "Plug and Play":** La planta se ensambla y prueba al 100% en una fábrica controlada, garantizando calidad de ingeniería, y se envía lista para usar.
3. **Reducción de Obra Civil:** No se necesitan edificios, solo una losa o soportes básicos de concreto, reduciendo el tiempo de instalación en campo a menos de 8 horas.
4. **Modularidad Estricta:** Un contenedor defectuoso o tecnológicamente obsoleto puede ser retirado y reemplazado por un modelo más nuevo sin afectar la infraestructura del resto de la planta.
5. **Seguridad y Control Climático:** Los contenedores proporcionan una barrera física robusta contra el ambiente marino severo (corrosión, arena) y facilitan el control de temperatura interno.

## Consecuencias
- El espacio es la mayor restricción de ingeniería. Los equipos deben seleccionarse basándose en un *footprint* ultracompacto.
- Se requiere un diseño avanzado de ventilación/extracción para manejar el calor dentro del contenedor metálico en el clima de La Guajira.
