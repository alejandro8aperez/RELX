#!/usr/bin/env python
from capitulos.models import Capitulo

capitulos = [
    {"codigo": "01", "nombre": "Especificaciones Generales y Alcance", "disciplina": "general", "orden": 1},
    {"codigo": "02", "nombre": "Estudios de Suelo y Geotecnia", "disciplina": "geotecnia", "orden": 2},
    {"codigo": "03", "nombre": "Diseño Estructural", "disciplina": "civil", "orden": 3},
    {"codigo": "04", "nombre": "Diseño Hidráulico y Sanitario", "disciplina": "hidraulica", "orden": 4},
    {"codigo": "05", "nombre": "Diseño Eléctrico e Instrumentación", "disciplina": "electrica", "orden": 5},
    {"codigo": "06", "nombre": "Sistemas Mecánicos", "disciplina": "mecanica", "orden": 6},
    {"codigo": "07", "nombre": "Estudio de Impacto Ambiental", "disciplina": "ambiental", "orden": 7},
    {"codigo": "08", "nombre": "Memoria de Cálculo General", "disciplina": "general", "orden": 8},
]

for cap in capitulos:
    Capitulo.objects.get_or_create(codigo=cap["codigo"], defaults=cap)

print("Capítulos maestros creados correctamente.")
