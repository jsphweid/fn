import time
from typing import Callable


class SimpleTimer:
    def __init__(self):
        self._start_time = None

    def start(self):
        self._start_time = time.perf_counter()

    def mark(self, fn: Callable[[float], None]) -> float:
        mark_point = time.perf_counter() - self._start_time
        fn(mark_point)
        return mark_point
