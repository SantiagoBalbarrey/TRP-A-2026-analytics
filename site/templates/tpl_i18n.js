// ---------- idioma (es / en) ----------
// La página se escribe en español. En inglés se traduce el texto ya dibujado (nodos de texto y atributos).
const EN_EXACT={
'Resumen':'Overview','Equipos':'Teams','Comparar':'Compare','Partidos':'Matches','Tema':'Theme','Secciones':'Sections','Fecha':'Round',
'Estadísticas de los partidos filmados':'Stats from the filmed matches',
'Fechas':'Rounds','Puntos por partido':'Points per match','Tries por partido':'Tries per match','Amarillas':'Yellow cards','Rojas':'Red cards',
'Líderes del torneo':'Tournament leaders','Resultados por fecha':'Results by round','Tabla de posiciones':'Standings','Comparar equipos':'Compare teams',
'Ficha de equipo':'Team profile','Perfil de juego':'Playing profile','Perfil de juego contra el promedio del torneo':'Playing profile vs the tournament average','Promedio del torneo':'Tournament average',
'Puntos por tiempo (según eventos)':'Points by half (from events)','Fases estáticas':'Set pieces','Marcador minuto a minuto':'Score, minute by minute','Estadísticas del partido':'Match statistics',
'Ritmo: pelota en juego':'Pace: ball in play','De dónde vienen los tries':'Where tries come from','Penales concedidos por motivo':'Penalties conceded by reason',
'Cómo termina el break line':'How the break line ends','Qué sigue tras el break line':'What follows the break line',
'Equipo':'Team','Equipo A':'Team A','Equipo B':'Team B','PJ':'P','G':'W','E':'D','P':'L','PC':'PA','Dif':'Diff','Bonus':'Bonus','Pts':'Pts',
'Local':'Home','Visitante':'Away','Primer tiempo':'First half','Segundo tiempo':'Second half','Entretiempo':'Half-time',
'Ganada':'Won','Ganada sucia':'Won (messy)','Perdida':'Lost','Ganan la línea':'Win the line','Empatan':'Even','Pierden la línea':'Lose the line',
'Ganan la línea de ventaja':'Win the advantage line','Pierden la línea de ventaja':'Lose the advantage line',
'Sigue el juego':'Play continues','Penal / FK a favor':'Penalty / FK for','Penal / FK en contra':'Penalty / FK against','Pase':'Pass',
'Otro':'Other','Inconducta / JS':'Misconduct / foul play','Multifase':'Multi-phase','Line y maul':'Line-out and maul','Recupero':'Recovery','Lanzamiento':'Launch play',
'Penal o FK en contra':'Penalty or FK against','Puntos de penal o patada':'Penalty or kick points','amarilla':'yellow','roja':'red','◆ penal':'◆ penalty',
'en contra':'against','Resultado':'Result','Posesión y territorio':'Possession and territory','Ataque':'Attack','Disciplina':'Discipline','Defensa':'Defence',
'Puntos a favor':'Points for','Puntos en contra':'Points against','Conversiones':'Conversions','Penales pateados':'Penalty kicks',
'Posesión':'Possession','Posesión %':'Possession %','Tiempo en campo rival':'Time in opposition half','Tiempo en campo rival %':'Time in opposition half %','Campo rival':'Opposition half',
'Pelota en juego (min)':'Ball in play (min)','Turnovers':'Turnovers',
'Killer instinct que termina en puntos':'Killer instinct ending in points','Killer instinct que termina en puntos %':'Killer instinct ending in points %',
'Break lines que terminan en try':'Break lines ending in a try','Break lines que terminan en try %':'Break lines ending in a try %','Recepción de salida asegurada %':'Kick-off reception secured %','Recepción tras anotar asegurada %':'Reception after scoring secured %','Recepción de salida tras anotar':'Kick-off reception after scoring','Recepción de salida asegurada':'Kick-off reception secured','Recepción tras anotar asegurada':'Reception after scoring secured','Rucks ganados':'Rucks won','Rucks ganados %':'Rucks won %','Rucks perdidos':'Rucks lost','Patadas':'Kicks','Patadas efectivas':'Effective kicks','Patadas efectivas %':'Effective kicks %',
'Lanzamientos':'Launch plays','Lanzamientos que ganan la línea':'Launch plays that win the line','Lanzamientos que pierden la línea':'Launch plays that lose the line',
'Lanzamientos que ganan la línea de ventaja':'Launch plays that win the advantage line','Lanzamientos que pierden la línea de ventaja':'Launch plays that lose the advantage line',
'Lanzamientos que ganan la línea de ventaja %':'Launch plays winning the advantage line %','Lanzamientos que pierden la línea de ventaja %':'Launch plays losing the advantage line %',
'Scrum ganados':'Scrums won','Line-out ganados':'Line-outs won','Scrum obtenido':'Scrum won','Line-out obtenido':'Line-out won','Scrum obtenido %':'Scrum won %','Line-out obtenido %':'Line-out won %',
'Scrum robados al rival':"Scrums stolen from the rival",'Line-out robados al rival':"Line-outs stolen from the rival",
'Penales concedidos':'Penalties conceded','Tarjetas amarillas':'Yellow cards','Tarjetas rojas (total)':'Red cards (total)',
'Más tries':'Most tries','Mejor ataque (puntos a favor)':'Best attack (points for)','Mejor defensa (puntos en contra)':'Best defence (points against)',
'Break lines por partido':'Break lines per match','Menos penales por partido':'Fewest penalties per match',
'Estadísticas':'Statistics','Evolución del marcador':'Score progression','Pelota en juego por bloque':'Ball in play per block','Posesión por bloque':'Possession per block','Radar de perfil de juego':'Playing profile radar','Territorio por bloque':'Territory per block','Cada eje va del peor al mejor equipo del torneo. En disciplina y defensa, afuera es mejor.':'Each axis runs from the worst to the best team in the tournament. For discipline and defence, further out is better.',
'Los cuatro primeros marcados en verde. Tocá un equipo para ver su ficha.':'Top four marked in green. Tap a team to see its profile.',
'Puntos de tabla según la clasificación oficial.':'Table points follow the official standings.',
'Se cuentan las estadísticas donde se puede decir qué valor es mejor. Pelota en juego, patadas, lanzamientos y turnovers no puntúan.':'Only stats where a better value is clear are counted. Ball in play, kicks, launch plays and turnovers do not score.',
'Valores por partido, salvo los porcentajes y las rojas. Debajo de cada porcentaje va la cantidad sobre el total. La barra más oscura marca al que lo hace mejor; en las estadísticas sin ventaja clara se muestran las dos.':'Values are per match, except percentages and red cards. Below each percentage is the count over the total. The darker bar marks the better team; stats with no clear advantage show both.',
'En una temporada':'Within one season','Entre temporadas':'Across seasons','Evolución entre temporadas':'Evolution across seasons','Tipo de comparación':'Comparison type','Equipos a comparar':'Teams to compare','Temporada':'Season','Club':'Club',
'Equipo y temporada A':'Team and season A','Equipo y temporada B':'Team and season B','Cada eje va del peor al mejor valor entre los dos torneos juntos. En disciplina y defensa, afuera es mejor.':'Each axis runs from the worst to the best value across both tournaments together. For discipline and defence, further out is better.',
'Se cuenta cuando un solo equipo tiene el mejor valor. Las estadísticas donde no se puede decir qué es mejor (pelota en juego, patadas, lanzamientos, turnovers) no puntúan.':'A statistic counts when a single team has the best value. Statistics where better cannot be defined (ball in play, kicks, restarts, turnovers) do not count.',
'Valores por partido, salvo los porcentajes y las rojas. Debajo de cada porcentaje va la cantidad sobre el total. En cada fila, lo más claro marca al que lo hace mejor.':'Values are per match, except percentages and red cards. Below each percentage is the count over the total. In each row, the brighter value marks the best one.',
};
const ORD=n=>{n=+n;const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])};
const EN_RULES=[
[/^Elegir estadísticas · (\d+) seleccionadas$/,(m,n)=>`Choose statistics · ${n} selected`],
[/^Elegí de 2 a 4 equipos del torneo (\d+)\. Con 2 ves el cara a cara; con 3 o 4, una columna por equipo\.$/,(m,y)=>`Pick 2 to 4 teams from the ${y} tournament. With 2 you get the head-to-head; with 3 or 4, one column per team.`],
[/^Promedio del torneo (\d{4})$/,(m,y)=>`Tournament average ${y}`],[/^Torneo (\d{4})$/,(m,y)=>`Tournament ${y}`],[/^solo (\d{4})$/,(m,y)=>`only ${y}`],
[/^(.+) es el mejor en$/,(m,t)=>`${t} is best in`],
[/^Cada celda muestra el valor de (\d{4}), el de (\d{4}) y la diferencia\. [\s\S]*$/,(m,a,b)=>`Each cell shows the ${a} value, the ${b} value and the difference. Percentages are compared in percentage points (pp). Green: improved; red: got worse (for penalties, cards and points against, lower is better). There are 14 matches per year and squads change, so small differences may be chance. Tap a club that played both years to compare it.`],
[/^Estadísticas de los (\d+) partidos filmados: .*$/,(m,n)=>`Stats from all ${n} filmed matches: standings, teams, comparisons and every match minute by minute.`],
[/^Torneo Regional Pampeano · Zona A · Temporada (\d+)$/,(m,y)=>`Pampeano Regional Tournament · Zone A · ${y} season`],
[/^Datos tomados del video de cada partido\. Los tiempos se llevan a (\d+) minutos de juego real, conservando la pelota en juego \(BIP\)\. El fuera de juego se calcula como (\d+) minutos menos el BIP\.$/,(m,a,b)=>`Data taken from the video of each match. Times are scaled to ${a} minutes of real play, keeping ball-in-play (BIP) time unchanged. Out-of-play time is calculated as ${b} minutes minus BIP.`],
[/^Cara a cara en (\d+)$/,(m,y)=>`Head to head in ${y}`],
[/^(\d+) de (\d+) del rival · (.+)$/,(m,a,b,c)=>`${a} of the rival's ${b} · ${c}`],
[/^(\d+) de (\d+) · (.+)$/,(m,a,b,c)=>`${a} of ${b} · ${c}`],
[/^(\d+) de (\d+)$/,(m,a,b)=>`${a} of ${b}`],
[/^de (\d+) estadísticas$/,(m,n)=>`of ${n} stats`],
[/^(.+) mejor en$/,(m,t)=>`${t} better in`],
[/^(\d+)'–(\d+)': (.+)% visitante$/,(m,a,b,p)=>`${a}'–${b}': ${p}% away`],
[/^(\d+)'–(\d+)': (.+)% local$/,(m,a,b,p)=>`${a}'–${b}': ${p}% home`],
[/^(\d+)'–(\d+)': (.+)% de pelota en juego$/,(m,a,b,p)=>`${a}'–${b}': ${p}% ball in play`],
[/^(\d+) break lines en (\d+) partidos\. Amarillas (\d+), rojas (\d+)\.$/,(m,a,b,c,d)=>`${a} break lines in ${b} matches. Yellow cards ${c}, red cards ${d}.`],
[/^(.+) en total$/,(m,a)=>`${a} in total`],
[/^(\d+) penales: (\d+) en ataque y (\d+) en defensa\.$/,(m,a,b,c)=>`${a} penalties: ${b} in attack and ${c} in defence.`],
[/^(\d+)º en la tabla · (\d+) pts · (\d+) ganados, (\d+) empatados, (\d+) perdidos · (\d+) a favor, (\d+) en contra$/,(m,p,pt,w,d,l,f,c)=>`${ORD(p)} in the table · ${pt} pts · ${w} won, ${d} drawn, ${l} lost · ${f} for, ${c} against`],
[/^(\d+) tries con origen registrado\.$/,(m,n)=>`${n} tries with a recorded origin.`],
[/^(.+) · incompleto$/,(m,d)=>`${d} · incomplete`],
[/^Escudo de (.+)$/,(m,t)=>`${t} crest`],
[/^Arriba: (.+) dominó el territorio\. Abajo: (.+)\.$/,(m,a,b)=>`Up: ${a} had the territory. Down: ${b}.`],
[/^Barra hacia arriba: más posesión de (.+)\. Hacia abajo: de (.+)\.$/,(m,a,b)=>`Bars up: more possession for ${a}. Bars down: for ${b}.`],
[/^Amarilla (\d+)'$/,(m,n)=>`Yellow card ${n}'`],[/^Roja (\d+)'$/,(m,n)=>`Red card ${n}'`],[/^Penal (\d+)'$/,(m,n)=>`Penalty ${n}'`],
[/^BIP total (.+) min de (.+), fuera de juego (.+) min\.$/,(m,a,b,c)=>`Total BIP ${a} min of ${b}, out of play ${c} min.`],
[/^Fecha (\d+) · (.+) · Tries (\d+)–(\d+) · Video incompleto: el segundo tiempo no se filmó entero$/,(m,f,d,a,b)=>`Round ${f} · ${d} · Tries ${a}–${b} · Incomplete video: the second half was not fully filmed`],
[/^Fecha (\d+) · (.+) · Tries (\d+)–(\d+)$/,(m,f,d,a,b)=>`Round ${f} · ${d} · Tries ${a}–${b}`],
[/^El detalle de eventos suma (\d+)-(\d+)\. El resultado oficial es (\d+)-(\d+)\.$/,(m,a,b,c,d)=>`The event detail adds up to ${a}-${b}. The official result is ${c}-${d}.`],
[/^Killer instinct \(entradas al (\d+)\)$/,(m,n)=>`Killer instinct (entries into the ${n})`],
[/^Killer instinct · (\d+) entradas al (\d+) · (\d+) con puntos \((.+)%\)$/,(m,a,b,c,d)=>`Killer instinct · ${a} entries into the ${b} · ${c} with points (${d}%)`],
[/^Lanzamientos · (\d+) · (.+)% ganan la línea de ventaja$/,(m,a,b)=>`Launch plays · ${a} · ${b}% win the advantage line`],
[/^Recepción de salida · (\d+) · (.+)% obtenido$/,(m,a,b)=>`Kick-off reception · ${a} · ${b}% secured`],
[/^Recepción tras anotar · (\d+) · (.+)% obtenido$/,(m,a,b)=>`Reception after scoring · ${a} · ${b}% secured`],
[/^Line-out propio · (\d+) · (.+)% obtenido$/,(m,a,b)=>`Own line-out · ${a} · ${b}% won`],
[/^Scrum propio · (\d+) · (.+)% obtenido$/,(m,a,b)=>`Own scrum · ${a} · ${b}% won`],
[/^Salidas · (\d+)$/,(m,a)=>`Restarts · ${a}`],
[/^Scrum robados al rival · (.+)% de los del rival \((\d+) de (\d+)\)$/,(m,p,a,b)=>`Scrums stolen from the rival · ${p}% of the rival's (${a} of ${b})`],
[/^Line-out robados al rival · (.+)% de los del rival \((\d+) de (\d+)\)$/,(m,p,a,b)=>`Line-outs stolen from the rival · ${p}% of the rival's (${a} of ${b})`],
[/^Quién jugó en campo rival, cada (\d+) minutos$/,(m,n)=>`Who played in the opposition half, every ${n} minutes`],
[/^Quién tuvo la pelota, cada (\d+) minutos$/,(m,n)=>`Who had the ball, every ${n} minutes`],
[/^Partidos de (.+)$/,(m,t)=>`${t} matches`],
[/^Últimos (\d+)$/,(m,n)=>`Last ${n}`],
[/^torneo (.+)$/,(m,v)=>`tournament ${v}`],
[/^F(\d+)$/,(m,n)=>`R${n}`]
];
function trEn(s){if(Object.prototype.hasOwnProperty.call(EN_EXACT,s))return EN_EXACT[s];for(const [re,f] of EN_RULES){const m=s.match(re);if(m)return f(...m)}return s}
const TR_ATTR=['alt','aria-label','title'];
function trText(n){const p=n.parentNode;if(!p||p.nodeName==='SCRIPT'||p.nodeName==='STYLE'||(p.closest&&p.closest('[data-notr]')))return;
 if(n.__es===undefined)n.__es=n.nodeValue;const o=n.__es;
 if(LANG==='en'){const m=o.match(/^(\s*)([\s\S]*?)(\s*)$/);n.nodeValue=m[2]?m[1]+trEn(m[2])+m[3]:o}else n.nodeValue=o}
function trTree(root){if(!root)return;if(root.nodeType===3){trText(root);return}if(root.nodeType!==1||root.closest&&root.closest('[data-notr]'))return;
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;const list=[];while(n=w.nextNode())list.push(n);list.forEach(trText);
 const els=[root,...root.querySelectorAll('[alt],[aria-label],[title]')];
 els.forEach(e=>TR_ATTR.forEach(a=>{if(!e.hasAttribute||!e.hasAttribute(a)&&e['__es_'+a]===undefined)return;if(e['__es_'+a]===undefined)e['__es_'+a]=e.getAttribute(a);const o=e['__es_'+a];e.setAttribute(a,LANG==='en'?trEn(o.trim()):o)}))}
new MutationObserver(ms=>{if(LANG!=='en')return;ms.forEach(m=>m.addedNodes.forEach(trTree))}).observe(document.body,{childList:true,subtree:true});
function setLang(l){LANG=l;try{localStorage.setItem('trpa-lang',l)}catch(e){}document.documentElement.lang=l;
 const b=$('#lang');if(b){b.textContent=l==='en'?'ES':'EN';b.setAttribute('aria-label',l==='en'?'Cambiar a español':'Switch to English')}
 hstats();show(state.v);trTree(document.body)}
