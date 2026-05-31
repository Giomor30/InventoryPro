class AppError(Exception):
    def __init__(self, message, code="APP_ERROR", status=400, details=None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status = status
        self.details = details or []
