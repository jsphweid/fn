import logging

from timer import SimpleTimer


def log_timer(func):
    def wrapper(*args, **kwargs):
        function_name = func.__name__
        timer = SimpleTimer()
        timer.start()
        result = func(*args, **kwargs)
        timer.mark(lambda t: logging.info(f"Function {function_name} took {t} seconds..."))
        return result

    return wrapper
