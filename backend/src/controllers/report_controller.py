from services.report_service import ReportService


class ReportController:
    def __init__(self):
        self.report_service = ReportService()

    def inventory_summary(self, params=None, body=None, handler=None):
        data = self.report_service.inventory_summary()

        return {
            "success": True,
            "message": "Reporte de inventario obtenido correctamente",
            "data": data,
        } 