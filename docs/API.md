# API Endpoints

## Proyectos
- `GET/POST /api/proyectos/`
- `GET/PUT/DELETE /api/proyectos/{id}/`
- `POST /api/proyectos/{id}/cambiar_estado/`
- `GET /api/proyectos/{id}/resumen/`

## Capítulos
- `GET/POST /api/capitulos/maestros/`
- `GET/POST /api/capitulos/proyecto/`
- `POST /api/capitulos/proyecto/{id}/avanzar_estado/`
- `POST /api/capitulos/proyecto/{id}/retroceder_estado/`

## Documentos
- `GET/POST /api/documentos/`

## Memoria de Cálculo
- `GET/POST /api/memoria/`
- `GET /api/memoria/{id}/generar_pdf/`
- `POST /api/memoria/{id}/aprobar/`
- `POST /api/memoria/{id}/rechazar/`

## Aprobaciones
- `GET/POST /api/aprobaciones/`
- `POST /api/aprobaciones/transicionar/`
