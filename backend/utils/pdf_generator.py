"""
Generador de PDFs para Memorias de Cálculo y Documentos Técnicos
"""
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from io import BytesIO
from datetime import datetime
import markdown

class MemoriaPDFGenerator:
    def __init__(self, memoria):
        self.memoria = memoria
        self.buffer = BytesIO()
        self.doc = SimpleDocTemplate(self.buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
        self.styles = self._create_styles()
        self.story = []

    def _create_styles(self):
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='MemoriaTitle', parent=styles['Heading1'], fontSize=20,
            textColor=colors.HexColor('#0891b2'), spaceAfter=30, alignment=TA_CENTER, fontName='Helvetica-Bold'))
        styles.add(ParagraphStyle(name='MemoriaSubtitle', parent=styles['Heading2'], fontSize=14,
            textColor=colors.HexColor('#475569'), spaceAfter=20, alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='SectionHeader', parent=styles['Heading2'], fontSize=14,
            textColor=colors.HexColor('#0891b2'), spaceBefore=20, spaceAfter=12, borderColor=colors.HexColor('#0891b2'),
            borderWidth=1, borderPadding=5, backColor=colors.HexColor('#ecfeff')))
        styles.add(ParagraphStyle(name='BodyText', parent=styles['BodyText'], fontSize=10, leading=14,
            alignment=TA_JUSTIFY, spaceAfter=8))
        styles.add(ParagraphStyle(name='Formula', parent=styles['Code'], fontSize=11, textColor=colors.HexColor('#1e40af'),
            backColor=colors.HexColor('#eff6ff'), borderColor=colors.HexColor('#bfdbfe'), borderWidth=1, borderPadding=8,
            spaceBefore=10, spaceAfter=10, alignment=TA_CENTER, fontName='Courier'))
        styles.add(ParagraphStyle(name='ResultBox', parent=styles['Normal'], fontSize=11, textColor=colors.HexColor('#166534'),
            backColor=colors.HexColor('#f0fdf4'), borderColor=colors.HexColor('#86efac'), borderWidth=1, borderPadding=10,
            spaceBefore=10, spaceAfter=10, alignment=TA_CENTER, fontName='Helvetica-Bold'))
        styles.add(ParagraphStyle(name='Footer', parent=styles['Normal'], fontSize=8, textColor=colors.gray, alignment=TA_CENTER))
        return styles

    def _add_header(self):
        self.story.append(Paragraph("MEMORIA DE CÁLCULO", self.styles['MemoriaTitle']))
        self.story.append(Paragraph(self.memoria.titulo, self.styles['MemoriaSubtitle']))
        self.story.append(Spacer(1, 0.2*inch))
        data = [
            ['Código:', self.memoria.codigo],
            ['Proyecto:', f"{self.memoria.capitulo.proyecto.codigo} - {self.memoria.capitulo.proyecto.nombre}"],
            ['Capítulo:', self.memoria.capitulo.capitulo_maestro.nombre],
            ['Normativa:', self.memoria.normativa or 'No especificada'],
            ['Software:', self.memoria.software or 'No especificado'],
            ['Unidades:', self.memoria.unidades],
            ['Versión:', str(self.memoria.version)],
            ['Fecha:', datetime.now().strftime('%d/%m/%Y')],
        ]
        if self.memoria.elaborado_por:
            data.append(['Elaborado por:', self.memoria.elaborado_por.get_full_name() or self.memoria.elaborado_por.username])
        if self.memoria.revisado_por:
            data.append(['Revisado por:', self.memoria.revisado_por.get_full_name() or self.memoria.revisado_por.username])
        if self.memoria.aprobado_por:
            data.append(['Aprobado por:', self.memoria.aprobado_por.get_full_name() or self.memoria.aprobado_por.username])
        table = Table(data, colWidths=[2*inch, 4*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#475569')),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'), ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'), ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9), ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10), ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        self.story.append(table)
        self.story.append(Spacer(1, 0.3*inch))

    def _process_markdown(self, text):
        if not text: return ""
        return markdown.markdown(text, extensions=['tables', 'fenced_code'])

    def _add_section(self, seccion):
        self.story.append(Paragraph(f"{seccion.orden}. {seccion.titulo}", self.styles['SectionHeader']))
        if seccion.contenido:
            self.story.append(Paragraph(self._process_markdown(seccion.contenido), self.styles['BodyText']))
        if seccion.formulas:
            for formula in seccion.formulas:
                self.story.append(Paragraph(f"<b>Fórmula:</b><br/>{formula}", self.styles['Formula']))
        if seccion.resultados:
            for resultado in seccion.resultados:
                self.story.append(Paragraph(f"<b>Resultado:</b><br/>{resultado}", self.styles['ResultBox']))
        self.story.append(Spacer(1, 0.15*inch))

    def _add_footer(self):
        self.story.append(Spacer(1, 0.5*inch))
        self.story.append(Paragraph(f"— Documento generado por AQUA-8 el {datetime.now().strftime('%d/%m/%Y %H:%M')} —", self.styles['Footer']))
        self.story.append(Paragraph("© 8AMPERIOS SAS • Medellín, Colombia", self.styles['Footer']))

    def generate(self):
        self._add_header()
        for seccion in self.memoria.secciones.all().order_by('orden'):
            self._add_section(seccion)
        self._add_footer()
        self.doc.build(self.story)
        pdf = self.buffer.getvalue()
        self.buffer.close()
        return pdf


class DocumentoPDFGenerator:
    def __init__(self, titulo, contenido, metadata=None):
        self.titulo = titulo
        self.contenido = contenido
        self.metadata = metadata or {}
        self.buffer = BytesIO()
        self.doc = SimpleDocTemplate(self.buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=72)
        self.styles = getSampleStyleSheet()
        self.story = []

    def generate(self):
        title_style = ParagraphStyle('DocTitle', parent=self.styles['Heading1'], fontSize=18,
            textColor=colors.HexColor('#0891b2'), alignment=TA_CENTER, spaceAfter=20)
        self.story.append(Paragraph(self.titulo, title_style))
        if self.metadata:
            meta_data = [[k, str(v)] for k, v in self.metadata.items()]
            table = Table(meta_data, colWidths=[2*inch, 4*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f8fafc')),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
                ('FONTSIZE', (0, 0), (-1, -1), 9), ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 5),
            ]))
            self.story.append(table)
            self.story.append(Spacer(1, 0.2*inch))
        if self.contenido:
            html = markdown.markdown(self.contenido)
            body_style = ParagraphStyle('DocBody', parent=self.styles['BodyText'], fontSize=10, leading=14, alignment=TA_JUSTIFY)
            self.story.append(Paragraph(html, body_style))
        self.doc.build(self.story)
        pdf = self.buffer.getvalue()
        self.buffer.close()
        return pdf
