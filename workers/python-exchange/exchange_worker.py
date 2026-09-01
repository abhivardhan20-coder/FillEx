"""Local research adapter for the cloned NSE and BSE Python libraries.

The caller is responsible for authentication, caching, queuing, and respecting
NSE's documented maximum of three requests per second.
"""

from pathlib import Path
from typing import Any

from bse import BSE
from nse import NSE


DOWNLOAD_DIR = Path(__file__).parent / "downloads"
DOWNLOAD_DIR.mkdir(exist_ok=True)


def nse_quote(symbol: str) -> dict[str, Any]:
    with NSE(download_folder=DOWNLOAD_DIR, server=True) as client:
        return client.equityQuote(symbol.strip().upper())


def bse_quote(symbol_or_code: str) -> dict[str, Any]:
    with BSE(download_folder=DOWNLOAD_DIR) as client:
        value = symbol_or_code.strip()
        scrip_code = value if value.isdigit() else client.getScripCode(value)
        if not scrip_code:
            raise ValueError("BSE scrip code not found")
        return client.quote(scrip_code)
