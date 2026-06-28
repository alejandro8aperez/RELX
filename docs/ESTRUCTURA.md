# AQUA-8 - Estructura del Proyecto

## Arquitectura
- **Backend:** Django 5.x + DRF + PostgreSQL
- **Frontend:** React 18 + Vite + TailwindCSS
- **Infra:** Docker + Nginx

## Módulos (Capítulos de Ingeniería)
| Código | Disciplina | Descripción |
|--------|-----------|-------------|
| 01 | General | Especificaciones y alcance |
| 02 | Geotecnia | Estudios de suelo |
| 03 | Civil | Diseño estructural |
| 04 | Hidráulica | Diseño hidráulico/sanitario |
| 05 | Eléctrica | Diseño eléctrico e instrumentación |
| 06 | Mecánica | Sistemas mecánicos |
| 07 | Ambiental | Impacto ambiental |
| 08 | Memoria | Memoria de cálculo general |

## Versionado
Cada entidad tiene historial de versiones via el módulo `versionado` usando GenericForeignKey.
