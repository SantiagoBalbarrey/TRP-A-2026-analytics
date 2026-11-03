"""Corre el pipeline completo: .lgm -> eventos -> reescalado -> estadísticas -> CSV -> página.

Uso:   python src/run_all.py
Antes: poner los .lgm en input/lgm/ (o definir TRPA_LGM_DIR) y revisar config/2026.json.
"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
STEPS = ["build_events.py", "rescale.py", "stats.py", "export_csv.py", "build_site.py"]

for step in STEPS:
    print(f"\n=== {step} ===")
    r = subprocess.run([sys.executable, os.path.join(HERE, step)], cwd=HERE)
    if r.returncode:
        sys.exit(f"Falló {step}")
print("\nListo: data/<temporada>/*.csv y docs/index.html actualizados.")
