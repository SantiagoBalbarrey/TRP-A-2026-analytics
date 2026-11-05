"""Rutas y configuración de la temporada. Todo lo específico de un torneo vive en config/<temporada>.json."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEASON = os.environ.get("TRPA_SEASON", "2026")
CFG = json.load(open(os.path.join(ROOT, "config", f"{SEASON}.json"), encoding="utf-8"))

LGM_DIR = os.environ.get("TRPA_LGM_DIR", os.path.join(ROOT, "input", "lgm"))
WORK = os.path.join(ROOT, "work", SEASON)          # archivos intermedios (no se suben a GitHub)
OUT = os.path.join(ROOT, "data", SEASON)           # CSV finales
DOCS = os.path.join(ROOT, "docs")                  # página publicada (una sola, con todas las temporadas)
TIMES_XLSX = os.path.join(ROOT, CFG["times_workbook"]) if CFG.get("times_workbook") else None
os.makedirs(WORK, exist_ok=True)
os.makedirs(OUT, exist_ok=True)

NAME_FIXES = CFG["name_fixes"]
SCORE_OVERRIDES = {(o["fecha"], o["codigo"]): (o["local"], o["visitante"]) for o in CFG["score_overrides"]}
OFFICIAL_POINTS = CFG["official_points"]


def is_incomplete(pid, fecha_n):
    return any(fecha_n == r["fecha_n"] and r["contiene"] in pid for r in CFG["incomplete_matches"])
