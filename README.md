# 🏉 TRP-A 2026 Analytics

**Interactive rugby stats centre for the TRP A 2026 tournament** — standings, results, and team / match statistics built from frame-by-frame video analysis.

### 👉 [Open the live dashboard](https://santiagobalbarrey.github.io/TRP-A-2026-analytics/)

![Overview](assets/overview.jpg)

## What you can do
- **Overview:** league table, tournament leaders and key numbers.
- **Teams:** a profile per club with radar chart, possession and territory, set pieces, discipline and where tries come from.
- **Compare:** any two teams head to head, stat by stat.
- **Matches:** every round, minute-by-minute scoreboard, possession and territory every 5 minutes, and a full stat sheet per match.

| Team profile | Match centre |
|---|---|
| ![Team](assets/team.jpg) | ![Match](assets/match.jpg) |

## What's measured
56 matches · 8 teams · 14 rounds · ~37,900 tagged events.

Some of the less common stats:
- **Killer instinct:** 22-metre entries and the % that end in points.
- **Scrums and line-outs won and stolen** (the rival's ball taken), with percentages.
- **Break lines:** how they end and what follows (pass, ruck, try).
- **Launch plays:** how many win or lose the advantage line.
- **Ball in play (BIP)** and out-of-play time, possession and territory per 5-minute block.

## Open data
CSV files in [`data/2026/`](data/2026):

| File | Content |
|---|---|
| `eventos.csv` | Every tagged event, with team, half, minute and outcome |
| `partidos.csv` | Result and details per match |
| `stats_equipo_partido.csv` | One row per team and match |
| `tabla_posiciones.csv` | Standings |

## How it's built
Matches are tagged in LongoMatch. A Python pipeline reads the `.lgm` files, assigns each event to its half, rescales times to 80 minutes of real play while keeping ball-in-play time, and computes team stats per match. The site is a single static HTML page with vanilla JavaScript and SVG charts, hosted on GitHub Pages.

*The pipeline code will be added to this repository.*

## Data notes
- Times are normalised to 80 minutes; out-of-play time = 80 min minus BIP.
- Standings use the official points.
- In 3 matches the tagged events don't add up to the official score; the page shows the official result with a note.
- Round 1, Comercial vs Argentino, has an incomplete second-half video.

Club crests belong to their clubs and are used only to identify the teams.

---

## 🇦🇷 En español
Centro de estadísticas del TRP A 2026: tabla de posiciones, resultados y estadísticas por equipo y por partido, a partir del análisis de video. Los datos están en `data/2026/` y la página en vivo está en el link de arriba.
