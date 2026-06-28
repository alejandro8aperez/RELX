from django.test import TestCase
from aqua8.models import Module, SystemStatus

class ModuleModelTest(TestCase):
    def test_create_module(self):
        mod = Module.objects.create(code='A', name='Test Module', status='online')
        self.assertEqual(str(mod), 'Módulo A: Test Module')
        self.assertTrue(mod.is_active)
