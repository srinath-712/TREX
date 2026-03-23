from collections import defaultdict, deque
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Deque
from memecoin_radar.models.schemas import CleanPost, HistoryEntry

class TimeWindowStore:
    """
    In-memory store for per-coin post windows and history snapshots.
    No external database. Singleton — import store from this module.
    """
    def __init__(self):
        self._post_store: Dict[str, Deque] = defaultdict(deque)
        self._history_store: Dict[str, List[HistoryEntry]] = defaultdict(list)
        self._watchlist: set = set()
        self._last_known_phase: Dict[str, str] = {}

    def check_and_update_phase(self, coin: str, new_phase: str):
        old_phase = self._last_known_phase.get(coin)
        if old_phase and old_phase != new_phase:
            self._last_known_phase[coin] = new_phase
            return (new_phase, old_phase)
        self._last_known_phase[coin] = new_phase
        return None

    def add_to_watchlist(self, coin: str) -> None:
        self._watchlist.add(coin.upper())

    def remove_from_watchlist(self, coin: str) -> None:
        self._watchlist.discard(coin.upper())

    def get_watchlist(self) -> List[str]:
        return list(self._watchlist)

    def add_posts(self, coin: str, posts: List[CleanPost]) -> None:
        for post in posts:
            self._post_store[coin].append(post)

    def get_window(self, coin: str, window_minutes: int) -> List[CleanPost]:
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=window_minutes)
        return [p for p in self._post_store[coin]
                if p.timestamp >= cutoff]

    def record_snapshot(self, coin: str, entry: HistoryEntry) -> None:
        self._history_store[coin].append(entry)

    def get_history(self, coin: str, limit: int = 100) -> List[HistoryEntry]:
        return list(self._history_store[coin])[-limit:]

    def get_tracked_coins(self) -> List[str]:
        return list(self._post_store.keys())

# Module-level singleton — import this instance everywhere
store = TimeWindowStore()
