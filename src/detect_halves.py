"""Paso 2 (opcional, de apoyo). Propone el inicio del 1T y del 2T de cada partido a partir de los eventos.

Los tiempos que usa el pipeline salen de config/tiempos_<temporada>.xlsx (hoja 'Revisar tiempos'),
donde las columnas 'CORREGIDO' se completan a mano cuando la detección automática no es confiable.
Este script imprime la propuesta y la confianza de cada partido para ayudar en esa revisión.
"""
import numpy as np, pandas as pd
import parse_lgm


def mmss(s):
    return f"{int(s // 60)}:{s % 60:05.2f}"


def main():
    res = []
    for m in parse_lgm.load():
        ev = m["evs"]
        sp = np.array([e["stop"] for e in ev]) / 1000
        end = sp.max()
        core = [e for e in ev if e["tipo"] in ("BIP", "OUT")]
        cs = np.array([e["start"] for e in core]) / 1000
        ce = np.array([e["stop"] for e in core]) / 1000
        sal = [(e["start"] / 1000, e["name"]) for e in ev if e["tipo"].upper().startswith("SALIDAS")]
        t1, _ = sal[0]
        gaps = [(cs[i + 1] - ce[:i + 1].max(), ce[:i + 1].max(), cs[i + 1]) for i in range(len(cs) - 1)]
        mid = [g for g in gaps if 0.30 * end <= g[2] <= 0.70 * end]
        big = max(mid, key=lambda g: g[0]) if mid else (0, 0, 0)
        if big[0] >= 180:
            cand = [s for s in sal if s[0] >= big[2] - 1]
            t2 = (cand[0] if cand else (big[2], ""))[0]
            metodo, conf = "Hueco largo", ("ALTA" if big[0] >= 300 else "MEDIA")
        else:
            est = t1 + (end - t1) / 2
            t2 = sorted(sal, key=lambda s: abs(s[0] - est))[0][0]
            metodo, conf = "Estimado (sin hueco)", "BAJA"
        alerta = ""
        if not 38 * 60 <= t2 - t1 <= 60 * 60: alerta += f"1T dura {(t2 - t1) / 60:.0f} min; "
        if not 35 * 60 <= end - t2 <= 60 * 60: alerta += f"2T dura {(end - t2) / 60:.0f} min; "
        if t1 > 60: alerta += "1T empieza tarde; "
        res.append({"F": m["fn"], "partido": m["l"] + " - " + m["v"], "1T": mmss(t1), "2T": mmss(t2),
                    "metodo": metodo, "confianza": conf, "alerta": alerta.strip("; ")})
    df = pd.DataFrame(res)
    pd.set_option("display.width", 250)
    print(df.to_string())


if __name__ == "__main__":
    main()
