from django.core.management.base import BaseCommand
from aqua8.models import Proyecto, CapituloMaestro, Capitulo, Documento, MemoriaCalculo, CategoriaPresupuesto, PartidaPresupuestaria
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Pobla datos de ingenieria de la Planta Desalinizadora Manaure'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Eliminando datos existentes...'))
        for model in [PartidaPresupuestaria, CategoriaPresupuesto, Documento, MemoriaCalculo, Capitulo, CapituloMaestro, Proyecto]:
            try:
                model.objects.all().delete()
            except Exception:
                pass

        self.stdout.write(self.style.NOTICE('\nCreando proyecto Planta Desalinizadora Manaure...'))

        proyecto = Proyecto.objects.create(
            codigo='MAN-001',
            nombre='Planta Desalinizadora Manaure',
            descripcion='Diseno, construccion y puesta en marcha de una planta desalinizadora por osmosis inversa con capacidad de 500.000 L/dia, alimentada por energia solar fotovoltaica, en el municipio de Manaure, La Guajira.',
            ubicacion='Manaure, La Guajira',
            estado='ejecucion',
        )
        self.stdout.write(self.style.SUCCESS(f'  OK {proyecto.codigo}: {proyecto.nombre}'))

        capitulos_data = [
            ('EST', 'Estudios y Diseno', 'Estudios topograficos, batimetricos, geotecnicos y diseno conceptual de la planta'),
            ('CAP', 'Captacion de Agua de Mar', 'Sistema de captacion de agua de mar con rejas, desbaste y pozo costero'),
            ('PRE', 'Pretratamiento', 'Sistema de filtracion por grava, arena, carbon activado y microfiltracion'),
            ('RO', 'Osmosis Inversa', 'Sistema de osmosis inversa con membranas espirales de alta eficiencia'),
            ('POS', 'Postratamiento', 'Remineralizacion, desinfeccion UV y cloracion para agua potable'),
            ('ALM', 'Almacenamiento y Distribucion', 'Tanque de almacenamiento de 1000 m3 y red de distribucion domiciliaria'),
            ('ELE', 'Sistema Electrico', 'Subestacion, transformadores, tableros de distribucion y cableado'),
            ('SOL', 'Sistema Solar Fotovoltaico', 'Campo solar de 250 kWp con paneles monocristalinos y baterias Li-ion'),
            ('CIV', 'Obras Civiles', 'Caseta de operaciones, cimentaciones, vias internas y cerramiento'),
            ('HYD', 'Hidraulica y Tuberias', 'Red de tuberias de impulsion, conduccion y distribucion en HDPE y PVC'),
            ('INS', 'Instrumentacion y Control', 'SCADA, PLC, sensores de nivel, caudal, presion, TDS y temperatura'),
            ('SST', 'Seguridad y Salud en el Trabajo', 'Plan de seguridad, EPP, senalizacion y protocolos de emergencia'),
            ('AMB', 'Gestion Ambiental', 'Plan de manejo ambiental, vertimiento de salmuera y compensacion'),
        ]

        maestros = {}
        for codigo, nombre, desc in capitulos_data:
            m = CapituloMaestro.objects.create(codigo=codigo, nombre=nombre, descripcion=desc)
            maestros[codigo] = m
            self.stdout.write(f'  OK Capitulo Maestro {codigo}: {nombre}')

        for codigo, _, _ in capitulos_data:
            Capitulo.objects.create(proyecto=proyecto, capitulo_maestro=maestros[codigo], estado='aprobado')
        self.stdout.write(self.style.SUCCESS(f'  OK {len(capitulos_data)} capitulos creados para {proyecto.codigo}'))

        documentos_data = [
            ('EST-001', 'Estudio Topografico Manaure', 'pdf', '8.2 MB'),
            ('EST-002', 'Estudio Batimetrico Linea Costera', 'pdf', '12.5 MB'),
            ('EST-003', 'Estudio Geotecnico Suelos', 'pdf', '15.1 MB'),
            ('EST-004', 'Diseno Conceptual Planta', 'pdf', '6.8 MB'),
            ('CAP-001', 'Plano Captacion Pozo Costero', 'dwg', '3.4 MB'),
            ('CAP-002', 'Especificaciones Bombas Captacion', 'pdf', '2.1 MB'),
            ('PRE-001', 'Diagrama Filtracion Pretratamiento', 'dwg', '1.8 MB'),
            ('PRE-002', 'Hoja Tecnica Filtros Arena', 'pdf', '1.2 MB'),
            ('RO-001', 'Diseno Bastidores Osmosis Inversa', 'dwg', '5.6 MB'),
            ('RO-002', 'Especificacion Membranas Espirales', 'pdf', '3.4 MB'),
            ('RO-003', 'Curva Operacion RO', 'xlsx', '0.9 MB'),
            ('POS-001', 'Sistema Remineralizacion', 'pdf', '2.3 MB'),
            ('POS-002', 'Especificacion Lamparas UV', 'pdf', '1.1 MB'),
            ('ALM-001', 'Plano Tanque 1000 m3', 'dwg', '4.7 MB'),
            ('ALM-002', 'Red Distribucion Domiciliaria', 'dwg', '8.9 MB'),
            ('ELE-001', 'Diagrama Unifilar Subestacion', 'dwg', '2.5 MB'),
            ('ELE-002', 'Calculo Cargas Electricas', 'xlsx', '1.3 MB'),
            ('SOL-001', 'Distribucion Paneles Campo Solar', 'dwg', '3.8 MB'),
            ('SOL-002', 'Hoja Tecnica Panel Monocristalino 550W', 'pdf', '1.5 MB'),
            ('SOL-003', 'Estudio Radiacion Solar Manaure', 'pdf', '4.2 MB'),
            ('CIV-001', 'Plano Caseta Operaciones', 'dwg', '3.1 MB'),
            ('CIV-002', 'Plano Cimentaciones Equipos', 'dwg', '2.7 MB'),
            ('HYD-001', 'Isometrico Tuberias Proceso', 'dwg', '6.2 MB'),
            ('HYD-002', 'Memoria Hidraulica Red', 'pdf', '7.8 MB'),
            ('INS-001', 'Arquitectura SCADA AQUA-8', 'pdf', '5.4 MB'),
            ('INS-002', 'Listado Variables y Tags', 'xlsx', '0.7 MB'),
            ('SST-001', 'Plan Seguridad y Salud', 'pdf', '9.3 MB'),
            ('SST-002', 'Matriz Riesgos Planta', 'xlsx', '1.1 MB'),
            ('AMB-001', 'Plan Manejo Ambiental', 'pdf', '14.6 MB'),
            ('AMB-002', 'Estudio Dispersion Salmuera', 'pdf', '11.2 MB'),
        ]

        now = timezone.now()
        for i, (cod_doc, nombre, tipo, tamano) in enumerate(documentos_data):
            Documento.objects.create(
                proyecto=proyecto,
                nombre=nombre,
                descripcion=f'Documento tecnico del capitulo {cod_doc[:3]}',
                tipo=tipo,
                tamano=tamano,
                fecha_subida=now - timedelta(days=len(documentos_data) - i),
            )
        self.stdout.write(self.style.SUCCESS(f'  OK {len(documentos_data)} documentos creados'))

        memorias_data = [
            ('Calculo de Captacion', 'hidraulico', 'Caudal de diseno: 580 m3/dia, velocidad captacion: 0.8 m/s'),
            ('Diseno Filtracion Pretratamiento', 'hidraulico', 'Velocidad filtracion: 12 m/h, area: 24 m2, perdida carga: 2.5 m'),
            ('Calculo Modulos RO', 'membranas', '14 bastidores, 42 membranas/bastidor, flujo: 420 m3/dia, recuperacion: 45%'),
            ('Dimensionamiento Postratamiento', 'quimico', 'Dosis cal: 15 mg/L, Cl2: 2.5 mg/L, tiempo contacto: 30 min'),
            ('Calculo Almacenamiento', 'hidraulico', 'Volumen: 1000 m3, diametro: 12 m, altura: 9.5 m, autonomia: 48 h'),
            ('Calculo Estructural Caseta', 'estructural', 'Cubierta metalica IPE 300, columnas HEB 200, viento: 120 km/h'),
            ('Balance de Masas', 'proceso', 'Agua captada: 580 m3/dia, producto: 500 m3/dia, salmuera: 80 m3/dia'),
            ('Dimensionamiento Campo Solar', 'electrico', '250 kWp, 455 paneles de 550W, 2 inversores de 125 kW'),
            ('Calculo Baterias Li-ion', 'electrico', 'Capacidad: 500 kWh, autonomia nocturna: 6h, profundidad descarga: 80%'),
            ('Calculo Resistencia Salmuera', 'ambiental', 'Caudal salmuera: 80 m3/dia, TDS: 65000 ppm, difusor 50 m costa'),
        ]

        for titulo, tipo_calculo, resultado in memorias_data:
            MemoriaCalculo.objects.create(
                proyecto=proyecto,
                titulo=titulo,
                tipo_calculo=tipo_calculo,
                resultado=resultado,
                estado='aprobado',
            )
        self.stdout.write(self.style.SUCCESS(f'  OK {len(memorias_data)} memorias de calculo creadas'))

        self.stdout.write(self.style.NOTICE('\nCreando presupuesto CAPEX...'))

        categorias_data = [
            ('CONTENEDOR Y OBRA', 1, [
                (1, 'Contenedor 20\' maritimo usado/reacondicionado', 1, 'und', 3500.00, 13300000, 'High Cube preferible'),
                (2, 'Acondicionamiento interior (aislamiento, anticorrosivo, ventilacion, iluminacion)', 1, 'global', 4500.00, 17100000, 'Pintura epoxica marina'),
                (3, 'Obra civil menor (base, anclajes, drenaje)', 1, 'global', 1500.00, 5700000, 'Losa de concreto in situ'),
            ]),
            ('CAPTACION AGUA MAR', 2, [
                (4, 'Tuberia HDPE PE100 PN10 Ø 2-3" - 200 m', 200, 'm', 18.00, 68400, 'Resistente UV y salinidad'),
                (5, 'Bomba sumergible AISI 316L - captacion marina', 1, 'und', 2500.00, 9500000, 'Inoxidable, ~1-2 HP'),
                (6, 'Filtro de toma + rejilla + boya de senalizacion', 1, 'global', 600.00, 2280000, 'Anti-incrustante'),
                (7, 'Anclajes submarinos, lastres y tendido', 1, 'global', 1200.00, 4560000, 'Mano de obra buceo'),
            ]),
            ('PRE-TRATAMIENTO', 3, [
                (8, 'Skid de Ultrafiltracion (UF) - hasta 1 m3/h', 1, 'und', 4500.00, 17100000, 'Modulos PVDF, hueco fibra'),
                (9, 'Filtro multimedia + filtro de cartucho 5 µm', 1, 'global', 800.00, 3040000, 'Pre-pre-tratamiento'),
                (10, 'Dosificacion quimica (antiescala, hipoclorito, bisulfito)', 1, 'global', 700.00, 2660000, 'Bombas dosificadoras + tanques'),
            ]),
            ('OSMOSIS REVERSA SWRO', 4, [
                (11, 'Skid SWRO 3.000 L/dia - bomba alta presion china', 1, 'und', 7500.00, 28500000, 'Bomba CNP/similar acero inox'),
                (12, 'Membranas SWRO chinas (Vontron/Keensen) 4040', 2, 'und', 350.00, 1330000, 'Vida util ~2-3 anios'),
                (13, 'Carcasas (vessels) FRP para membranas', 2, 'und', 280.00, 1064000, 'Fibra reforzada'),
                (14, 'Sensores OR (presion, conductividad, ORP, pH, flujo)', 1, 'kit', 900.00, 3420000, 'Esenciales para SCADA'),
            ]),
            ('POST-TRATAMIENTO', 5, [
                (15, 'Esterilizador UV inox 1-2 m3/h', 1, 'und', 700.00, 2660000, 'Lampara amalgama'),
                (16, 'Remineralizacion (calcita / dosificacion)', 1, 'global', 600.00, 2280000, 'Opcional pero recomendado'),
                (17, 'Filtros de pulido (carbon activado)', 1, 'und', 250.00, 950000, 'Sabor / olor'),
            ]),
            ('ALMACENAMIENTO', 6, [
                (18, 'Tanque pulmon 5.000 L (compra confirmada)', 1, 'und', 900.00, 3420000, 'Polietileno alimenticio'),
                (19, 'Tanque para agua de rechazo / salmuera', 1, 'und', 400.00, 1520000, 'Antes de vertimiento autorizado'),
                (20, 'Tuberias PVC/PPR internas + accesorios', 1, 'global', 1200.00, 4560000, 'Toda la red interna'),
            ]),
            ('ENERGIA SOLAR', 7, [
                (21, 'Paneles solares monocristalinos 550W (~10-12 kWp)', 22, 'und', 130.00, 494000, 'Tier 1 chino (Jinko/LONGi)'),
                (22, 'Inversor solar hibrido on-grid (sin baterias) 12 kW', 1, 'und', 2500.00, 9500000, 'MPPT, monitoreo remoto'),
                (23, 'Estructura de soporte galvanizada (techo contenedor / suelo)', 1, 'global', 1200.00, 4560000, 'Anti-corrosion Guajira'),
                (24, 'Cableado solar, protecciones DC/AC, puesta a tierra', 1, 'global', 1500.00, 5700000, 'Cumple RETIE'),
            ]),
            ('CONTROL Y SCADA', 8, [
                (25, 'PLC + HMI local (SCADA basico)', 1, 'und', 1800.00, 6840000, 'Marca Delta/Siemens economico'),
                (26, 'Tablero electrico + arrancadores + protecciones', 1, 'und', 1500.00, 5700000, 'IP65 para ambiente marino'),
                (27, 'Sensores generales (nivel tanques, presiones)', 1, 'kit', 700.00, 2660000, 'Adicionales al kit OR'),
            ]),
            ('INGENIERIA Y PUESTA EN MARCHA', 9, [
                (28, 'Ingenieria de detalle + planos electricos/hidraulicos', 1, 'global', 2500.00, 9500000, 'Memoria de calculo'),
                (29, 'Transporte contenedor + equipos a Manaure', 1, 'global', 2500.00, 9500000, 'Desde Barranquilla/Cartagena'),
                (30, 'Instalacion, montaje y mano de obra local', 1, 'global', 3000.00, 11400000, 'Considera logistica Guajira'),
                (31, 'Puesta en marcha, pruebas, capacitacion operador', 1, 'global', 1500.00, 5700000, 'Incluye protocolo arranque'),
            ]),
        ]

        for cat_nombre, cat_orden, partidas in categorias_data:
            cat = CategoriaPresupuesto.objects.create(proyecto=proyecto, nombre=cat_nombre, orden=cat_orden)
            for num, desc, cant, unidad, usd, cop, notas in partidas:
                PartidaPresupuestaria.objects.create(
                    categoria=cat, numero=num, descripcion=desc,
                    cantidad=cant, unidad=unidad,
                    costo_unitario_usd=usd, costo_unitario_cop=cop,
                    notas=notas,
                )
            cat_total_usd = cat.total_usd()
            cat_total_cop = cat.total_cop()
            self.stdout.write(f'  OK {cat_nombre}: US$ {cat_total_usd:,.2f} / COP $ {cat_total_cop:,.0f}')

        total_usd = sum(c.total_usd() for c in CategoriaPresupuesto.objects.filter(proyecto=proyecto))
        total_cop = sum(c.total_cop() for c in CategoriaPresupuesto.objects.filter(proyecto=proyecto))
        self.stdout.write(self.style.SUCCESS(f'  TOTAL CAPEX: US$ {total_usd:,.2f} / COP $ {total_cop:,.0f}'))
        self.stdout.write(self.style.SUCCESS(f'  CONTINGENCIA 10%: US$ {total_usd*0.1:,.2f} / COP $ {total_cop*0.1:,.0f}'))
        self.stdout.write(self.style.SUCCESS(f'  TOTAL + CONTINGENCIA: US$ {total_usd*1.1:,.2f} / COP $ {total_cop*1.1:,.0f}'))

        self.stdout.write(self.style.SUCCESS('\nDatos de ingenieria Manaure cargados exitosamente'))
