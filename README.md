# TRP-A 2026 Analytics

Estadísticas del Torneo Regional del Programa A (TRPA) de rugby, por equipo y por partido, a partir del análisis de video (LongoMatch).

**Página en vivo:** https://santiagobalbarrey.github.io/TRP-A-2026-analytics/

## Qué incluye
- Tabla de posiciones, resultados por fecha y estadísticas por equipo y por partido (temporada 2026).
- Comparador entre equipos.
- Datos abiertos en CSV (`data/2026/`):
  - `eventos.csv`: cada evento registrado en los partidos.
  - `partidos.csv`: resultado y datos de cada partido.
  - `stats_equipo_partido.csv`: una fila por equipo y partido.
  - `tabla_posiciones.csv`: tabla de posiciones.

## Cómo se calcula
- Los tiempos se llevan a 80 minutos de juego real, conservando la pelota en juego (BIP). El fuera de juego (OUT) es 80 minutos menos el BIP.
- Scrum / line-out robado: scrum / line-out del rival marcado como perdido.
- Killer instinct: entradas al 22 y qué porcentaje termina en puntos.
- Puntos de tabla: los de la clasificación oficial.

## Estructura
```
docs/    página publicada con GitHub Pages
data/    CSV por temporada
```

## Notas
Los escudos pertenecen a sus clubes y se usan solo para identificar a los equipos.
