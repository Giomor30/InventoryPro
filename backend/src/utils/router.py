class Route:
    def __init__(self, method, pattern, handler):
        self.method = method.upper()
        self.pattern = pattern
        self.handler = handler


def match_path(pattern, path):
    pattern_parts = [p for p in pattern.strip("/").split("/") if p]
    path_parts = [p for p in path.strip("/").split("/") if p]

    if len(pattern_parts) != len(path_parts):
        return None

    params = {}
    for pattern_part, path_part in zip(pattern_parts, path_parts):
        if pattern_part.startswith(":"):
            params[pattern_part[1:]] = path_part
        elif pattern_part != path_part:
            return None

    return params


def find_route(method, path, routes):
    path_only = path.split("?", 1)[0]
    for route in routes:
        if route.method != method.upper():
            continue
        params = match_path(route.pattern, path_only)
        if params is not None:
            return route, params
    return None, None
