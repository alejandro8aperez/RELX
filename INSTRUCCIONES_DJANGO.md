# 🚀 AQUA-8 Django — Instrucciones para Render

## Paso 1: Copiar archivos a tu repo

Copia TODO el contenido de la carpeta `django_project/` a la **RAÍZ** de tu repositorio RELX.

Tu estructura debe quedar:

```
RELX/
├── manage.py                 ← NUEVO
├── build.sh                  ← NUEVO
├── requirements.txt          ← YA EXISTE (con Django)
├── aqua8_project/             ← NUEVO (carpeta)
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── aqua8/                   ← NUEVO (carpeta)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── tests.py
│   ├── migrations/
│   │   └── __init__.py
│   └── management/
│       ├── __init__.py
│       └── commands/
│           ├── __init__.py
│           └── seed_data.py
├── relx-website/            ← YA EXISTE
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── docs/                    ← YA EXISTE
├── cad/                     ← YA EXISTE
└── ...
```

## Paso 2: Commit y push

```bash
git add .
git commit -m "Add Django backend for AQUA-8 cloud platform"
git push origin main
```

## Paso 3: Configurar en Render

1. Ve a tu dashboard de Render → New → **Web Service**
2. Selecciona tu repo `alejandro8ap/RELX`
3. Configura estos campos:

| Campo | Valor |
|-------|-------|
| **Name** | `AQUA-8` |
| **Language** | Python 3 |
| **Branch** | main |
| **Root Directory** | *(vacío — raíz del repo)* |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn aqua8_project.wsgi:application` |
| **Instance Type** | Free |

4. **Variables de entorno** (agrega estas):

| Nombre | Valor |
|--------|-------|
| `SECRET_KEY` | Genera uno largo y aleatorio (ej: `django-insecure-aqua8-...`) |
| `DEBUG` | `False` |
| `PYTHON_VERSION` | `3.11` |

5. Presiona **Deploy Web Service**

## Paso 4: Verificar

Espera 2-3 minutos a que Render construya y despliegue.

Tu URL será: `https://aqua-8.onrender.com`

### Endpoints API:

| Endpoint | Descripción |
|----------|-------------|
| `/` | Tu dashboard HTML (`relx-website/index.html`) |
| `/admin/` | Panel de administración Django |
| `/api/telemetry/` | Datos en vivo de los 4 módulos |
| `/api/alarms/` | Alarmas activas |
| `/api/historical/?hours=24` | Datos históricos para gráficos |
| `/api/status/` | Estado general de la plataforma |
| `/api/simulate/` | POST — genera un nuevo tick de datos (para testing) |

### Panel Admin:

- Usuario: `admin`
- Contraseña: Crea un superusuario con `python manage.py createsuperuser` (en local) o usa el shell de Render.

## Paso 5: Conectar el frontend (dashboard.js)

Reemplaza tu `relx-website/js/dashboard.js` con el archivo `dashboard.js` que te di anteriormente (conectado a la API). El `index.html` se sirve automáticamente desde Django.

## Notas importantes

- El plan **Free** de Render se duerme después de 15 min de inactividad. La primera visita tardará ~30 seg en "despertar".
- Si cambias el `requirements.txt`, Render reinstalará automáticamente.
- Si cambias modelos, necesitas hacer `makemigrations` localmente y subir los archivos de migración.
- Para datos persistentes en producción, agrega **PostgreSQL** en Render (también hay free tier).

## Comandos útiles (local)

```bash
# Instalar dependencias
pip install -r requirements.txt

# Migrar base de datos
python manage.py migrate

# Poblar datos simulados
python manage.py seed_data

# Crear superusuario
python manage.py createsuperuser

# Correr servidor local
python manage.py runserver

# Abrir en: http://localhost:8000
# Admin: http://localhost:8000/admin/
```
