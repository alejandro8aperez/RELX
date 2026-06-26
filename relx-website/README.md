# AQUA-8 Smart Water Hub 🌊🔋

**Sistema Modular de Desalinización Solar Contenerizado para Comunidades Costeras.**

## Sobre el Proyecto
AQUA-8 es un proyecto de ingeniería de I+D postulado al **RELX Environmental Challenge 2026**. Representa un salto conceptual: de construir plantas desalinizadoras monolíticas a fabricar un "producto industrial tipo LEGO" basado en módulos en contenedores ISO de 20 pies. 

Integrando ingeniería de procesos avanzada con una arquitectura de microred eléctrica y telemetría SCADA inteligente, AQUA-8 produce 10,000 Litros/día consumiendo menos de 3.0 kWh/m³. El piloto "Living Lab" se establecerá en Manaure, La Guajira (Colombia), donde la salmuera (el desecho tóxico tradicional de la desalinización) se integrará con la industria salinera local para lograr una economía circular de Cero Descarga Líquida (ZLD).

## Estructura del Repositorio Web (Dashboard SCADA)
Este directorio contiene la representación web del proyecto, que funciona como un simulador del Dashboard SCADA del contenedor:

- `index.html`: Dashboard industrial y presentación del concepto modular.
- `css/styles.css`: Interfaz estilo panel de control SCADA moderno.
- `js/dashboard.js`: Lógica de simulación de telemetría de los contenedores.
- `assets/images/`: Renders de los módulos AQUA-8.
- `docs/`: Documentación de I+D para la postulación a RELX.

## Ejecución Local
Para visualizar el SCADA Dashboard, sirve este directorio estáticamente:
```bash
npx serve .
# o
python -m http.server 8000
```

## Arquitectura de Módulos (AMDS)
- **Módulo A:** Captación y Pretratamiento.
- **Módulo B:** Ósmosis Inversa (RO) de Alta Presión.
- **Módulo C:** Postratamiento y Almacenamiento.
- **Módulo D:** Energía Solar, Inteligencia SCADA y Telecomunicaciones.
