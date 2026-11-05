(function(){
const DS=window.__DS;const YEARS=Object.keys(DS).sort();
let LANG='es';try{if(localStorage.getItem('trpa-lang')==='en')LANG='en'}catch(e){}
const COL={'MAR DEL PLATA':'#A8473B','SPORTING':'#F0B323','UNI DE MAR DEL PLATA':'#2E7FD1','SPORTIVA':'#7B52C2','COMERCIAL':'#22B3D4','LOS CARDOS':'#2FA84F','SAN IGNACIO':'#E5484D','ARGENTINO DE BAHIA':'#5A6FD0','BIGUA':'#D9742B','LOS 50':'#5B6475'};
const DARKTX={'COMERCIAL':1,'SPORTING':1};
const T={};YEARS.forEach(y=>DS[y].teams.forEach(t=>{T[t.k]=t}));
const $=(s,r)=> (r||document).querySelector(s);
const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const nf=(v,d)=>{d=d==null?1:d;if(v==null||isNaN(v))return '–';return v.toLocaleString(LANG==='en'?'en-US':'es-AR',{minimumFractionDigits:d,maximumFractionDigits:d})};
const pc=(a,b)=>b?100*a/b:0;
const CR=window.__C;
function crest(k,size){size=size||40;const c=CR[k],t=T[k],bw=size,bh=Math.round(size*1.1);if(!c)return `<span class="cw" style="width:${bw}px;height:${bh}px"><span class="cr mono" style="display:flex;align-items:center;justify-content:center;width:${bw}px;height:${bh}px;border-radius:50%;background:${COL[k]||'#667'};color:#fff;font:700 ${Math.round(size*.3)}px/1 system-ui,sans-serif;letter-spacing:.02em" role="img" aria-label="${t.name}">${t.code}</span></span>`;return `<span class="cw" style="width:${bw}px;height:${bh}px"><img class="cr" src="${c.src}" alt="Escudo de ${t.name}" width="${c.w}" height="${c.h}"></span>`}
// ---------- agregados (uno por temporada) ----------
function buildCtx(D){
 const rowsBy={};D.s.forEach(r=>{(rowsBy[r.equipo]=rowsBy[r.equipo]||[]).push(r)});
 const KEYS=Object.keys(D.s[0]).filter(k=>typeof D.s[0][k]==='number'&&k!=='fecha_numero');
 const byM={};D.s.forEach(r=>{(byM[r.partido_id]=byM[r.partido_id]||{})[r.condicion]=r});
 const rivR=r=>byM[r.partido_id][r.condicion==='LOCAL'?'VISITANTE':'LOCAL'];
 function agg(team){const R=rowsBy[team];const a={pj:R.length,rows:R};
  a.sc_rob=R.reduce((s,r)=>s+rivR(r).scrum_resultado_perdida,0);a.sc_rivtot=R.reduce((s,r)=>s+rivR(r).scrum,0);a.lo_rob=R.reduce((s,r)=>s+rivR(r).line_out_resultado_perdida,0);a.lo_rivtot=R.reduce((s,r)=>s+rivR(r).line_out,0);
  KEYS.forEach(k=>a[k]=R.reduce((s,r)=>s+(r[k]||0),0));
  a.pf=a.puntos_favor;a.pc=a.puntos_contra;a.pos=a.posesion_pct/a.pj;a.rival=100-a.pct_tiempo_en_campo_propio/a.pj;a.bip=a.bip_min/a.pj;return a}
 const A={};D.teams.forEach(t=>A[t.k]=agg(t.k));
 const MATCH={};D.m.forEach(m=>MATCH[m.id]=m);
 return {D,rowsBy,KEYS,byM,A,MATCH,TAB:D.tab.slice().sort((a,b)=>a.posicion-b.posicion)}}
const CTX={};YEARS.forEach(y=>CTX[y]=buildCtx(DS[y]));
let SEAS=YEARS[YEARS.length-1],D,rowsBy,byM,A,TAB,MATCH;
function useSeason(y){SEAS=y;const c=CTX[y];D=c.D;rowsBy=c.rowsBy;byM=c.byM;A=c.A;TAB=c.TAB;MATCH=c.MATCH}
useSeason(SEAS);
const METRICS=[
{g:'Resultado',k:'pf',l:'Puntos a favor',f:a=>a.pf/a.pj,d:1,dir:1},
{g:'Resultado',k:'pc',l:'Puntos en contra',f:a=>a.pc/a.pj,d:1,dir:-1},
{g:'Resultado',k:'tr',l:'Tries',f:a=>a.tries/a.pj,d:1,dir:1},
{g:'Resultado',k:'cv',l:'Conversiones',f:a=>a.conversiones/a.pj,d:1,dir:1},
{g:'Resultado',k:'pk',l:'Penales pateados',f:a=>a.penales_pateados/a.pj,d:1,dir:1},
{g:'Posesión y territorio',k:'pos',l:'Posesión %',f:a=>a.pos,d:1,dir:1,u:'%'},
{g:'Posesión y territorio',k:'rv',l:'Tiempo en campo rival %',f:a=>a.rival,d:1,dir:1,u:'%'},
{g:'Posesión y territorio',k:'to',l:'Turnovers',f:a=>a.turnovers/a.pj,d:1,dir:0},
{g:'Posesión y territorio',k:'bip',l:'Pelota en juego (min)',f:a=>a.bip,d:1,dir:0},
{g:'Ataque',k:'bl',l:'Break lines',f:a=>a.break_line/a.pj,d:1,dir:1},
{g:'Ataque',k:'blt',l:'Break lines que terminan en try %',f:a=>pc(a.break_line_finaliza_try,a.break_line),d:1,dir:1,u:'%',sub:a=>`${a.break_line_finaliza_try} de ${a.break_line}`},
{g:'Ataque',k:'ki',l:'Killer instinct (entradas al 22)',f:a=>a.killer_instinct/a.pj,d:1,dir:1,sub:a=>`${a.killer_instinct} en total`},
{g:'Ataque',k:'kip',l:'Killer instinct que termina en puntos %',f:a=>pc(a.killer_instinct_resultado_try+a.killer_instinct_resultado_score,a.killer_instinct),d:1,dir:1,u:'%',sub:a=>`${a.killer_instinct_resultado_try+a.killer_instinct_resultado_score} de ${a.killer_instinct}`},
{g:'Ataque',k:'rk',l:'Rucks ganados %',f:a=>pc(a.ruck_ganado,a.ruck_ganado+a.ruck_perdido),d:1,dir:1,u:'%'},
{g:'Ataque',k:'kk',l:'Patadas',f:a=>a.kick/a.pj,d:1,dir:0},
{g:'Ataque',k:'ek',l:'Patadas efectivas %',f:a=>pc(a.efect_kick_resultado_si,a.efect_kick),d:1,dir:1,u:'%'},
{g:'Ataque',k:'lz',l:'Lanzamientos',f:a=>a.lanzamiento/a.pj,d:1,dir:0,sub:a=>`${a.lanzamiento} en total`},
{g:'Ataque',k:'lzg',l:'Lanzamientos que ganan la línea de ventaja %',f:a=>pc(a.lanzamiento_resultado_gana,a.lanzamiento),d:1,dir:1,u:'%',sub:a=>`${a.lanzamiento_resultado_gana} de ${a.lanzamiento}`},
{g:'Ataque',k:'lzp',l:'Lanzamientos que pierden la línea de ventaja %',f:a=>pc(a.lanzamiento_resultado_pierde,a.lanzamiento),d:1,dir:-1,u:'%',sub:a=>`${a.lanzamiento_resultado_pierde} de ${a.lanzamiento}`},
{g:'Fases estáticas',k:'sc',l:'Scrum obtenido %',f:a=>pc(a.scrum_resultado_ganada+a.scrum_resultado_gana_sucia,a.scrum),d:1,dir:1,u:'%',sub:a=>`${a.scrum_resultado_ganada+a.scrum_resultado_gana_sucia} de ${a.scrum}`},
{g:'Fases estáticas',k:'lo',l:'Line-out obtenido %',f:a=>pc(a.line_out_resultado_ganada+a.line_out_resultado_gana_sucia,a.line_out),d:1,dir:1,u:'%',sub:a=>`${a.line_out_resultado_ganada+a.line_out_resultado_gana_sucia} de ${a.line_out}`},
{g:'Fases estáticas',k:'rs',l:'Recepción de salida asegurada %',f:a=>pc(a.recepcion_salida_asegurada,a.recepcion_salida_total),d:1,dir:1,u:'%',sub:a=>`${a.recepcion_salida_asegurada} de ${a.recepcion_salida_total}`},
{g:'Fases estáticas',k:'rst',l:'Recepción tras anotar asegurada %',f:a=>pc(a.recepcion_tras_score_asegurada,a.recepcion_tras_score_total),d:1,dir:1,u:'%',sub:a=>`${a.recepcion_tras_score_asegurada} de ${a.recepcion_tras_score_total}`},
{g:'Fases estáticas',k:'scr',l:'Scrum robados al rival',f:a=>a.sc_rob/a.pj,d:2,dir:1,sub:a=>`${a.sc_rob} de ${a.sc_rivtot} del rival · ${nf(pc(a.sc_rob,a.sc_rivtot),0)}%`},
{g:'Fases estáticas',k:'lor',l:'Line-out robados al rival',f:a=>a.lo_rob/a.pj,d:2,dir:1,sub:a=>`${a.lo_rob} de ${a.lo_rivtot} del rival · ${nf(pc(a.lo_rob,a.lo_rivtot),0)}%`},
{g:'Disciplina',k:'pen',l:'Penales concedidos',f:a=>a.penal_concedido/a.pj,d:1,dir:-1},
{g:'Disciplina',k:'am',l:'Tarjetas amarillas',f:a=>a.t_amarilla/a.pj,d:2,dir:-1},
{g:'Disciplina',k:'ro',l:'Tarjetas rojas (total)',f:a=>a.t_roja,d:0,dir:-1}
];
const M_={};METRICS.forEach(m=>M_[m.k]=m);
function mval(team,k){return M_[k].f(A[team])}
function leagueAvg(k){return D.teams.reduce((s,t)=>s+mval(t.k,k),0)/D.teams.length}
function rng(k){const v=D.teams.map(t=>mval(t.k,k));return [Math.min(...v),Math.max(...v)]}
// versiones por temporada (para comparar entre años)
function mvS(y,team,k){return M_[k].f(CTX[y].A[team])}
function leagueAvgS(y,k){const d=CTX[y].D;return d.teams.reduce((s,t)=>s+mvS(y,t.k,k),0)/d.teams.length}
function rngAll(k){const v=[];YEARS.forEach(y=>CTX[y].D.teams.forEach(t=>v.push(mvS(y,t.k,k))));return [Math.min(...v),Math.max(...v)]}
// ---------- tabla ----------
function form(team){return rowsBy[team].slice().sort((a,b)=>a.fecha_numero-b.fecha_numero).slice(-5).map(r=>r.resultado)}
const MES_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate=d=>{const [y,m,dd]=d.split('-');return LANG==='en'?`${+dd} ${MES_EN[+m-1]} ${y}`:`${+dd}/${+m}/${y}`};
const BOTH=YEARS.length>1?CTX[YEARS[YEARS.length-1]].TAB.map(r=>r.equipo).filter(k=>YEARS.every(y=>CTX[y].A[k])):[];
const state={v:'resumen',team:null,fecha:14,match:null,cmode:'season',sel:[],X:YEARS[0]+'|'+(BOTH[0]||CTX[YEARS[0]].TAB[0].equipo),Y:YEARS[YEARS.length-1]+'|'+(BOTH[0]||CTX[YEARS[YEARS.length-1]].TAB[0].equipo),
 evo:['pf','tr','pos','lzg','rst'],evoOpen:false};
function resetSeasonState(){state.team=TAB[0].equipo;state.sel=[SEAS+'|'+TAB[0].equipo,SEAS+'|'+TAB[1].equipo];state.fecha=14;state.match=D.m.filter(m=>m.f===14)[0].id}
resetSeasonState();
// ---------- radar ----------
const RAD=['pf','tr','pos','rv','bl','rk','sc','lo','pen','pc'];
const RADL={pf:'Ataque',tr:'Tries',pos:'Posesión',rv:'Campo rival',bl:'Break lines',rk:'Rucks',sc:'Scrum',lo:'Line-out',pen:'Disciplina',pc:'Defensa'};
function norm(k,v,all){const [lo,hi]=all?rngAll(k):rng(k);let x=hi===lo?.5:(v-lo)/(hi-lo);if(M_[k].dir<0)x=1-x;return .12+.88*x}
function radar(series){const W=380,H=330,cx=190,cy=165,R=108,n=RAD.length;
 const pt=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]};
 let s=`<svg class="ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Radar de perfil de juego">`;
 [.25,.5,.75,1].forEach(f=>{s+=`<polygon points="${RAD.map((_,i)=>pt(i,R*f).join(',')).join(' ')}" fill="none" stroke="var(--line)" stroke-width="1"/>`});
 RAD.forEach((k,i)=>{const [x,y]=pt(i,R);s+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="var(--line)"/>`;const [lx,ly]=pt(i,R+16);const an=lx<cx-6?'end':lx>cx+6?'start':'middle';s+=`<text class="ax" x="${lx}" y="${ly+4}" text-anchor="${an}" style="font-size:12px;font-weight:600">${RADL[k]}</text>`});
 series.forEach(se=>{const p=RAD.map((k,i)=>pt(i,R*se.v[i]).join(',')).join(' ');s+=`<polygon points="${p}" fill="${se.c}" fill-opacity="${se.dash?0:.22}" stroke="${se.c}" stroke-width="2.2" ${se.dash?'stroke-dasharray="5 4"':''}/>`;if(!se.dash)RAD.forEach((k,i)=>{const [x,y]=pt(i,R*se.v[i]);s+=`<circle cx="${x}" cy="${y}" r="3" fill="${se.c}"/>`})});
 return s+'</svg>'}
function radVals(fn,all){return RAD.map(k=>norm(k,fn(k),all))}
// ---------- RESUMEN ----------
function hstats(){const mp=D.m.length,tr=D.teams.reduce((s,t)=>s+A[t.k].tries,0),pts=D.teams.reduce((s,t)=>s+A[t.k].pf,0);
 const yel=D.teams.reduce((s,t)=>s+A[t.k].t_amarilla,0);
 $('#hstats').innerHTML=[[mp,'Partidos'],[14,'Fechas'],[tr,'Tries'],[nf(pts/mp,1),'Puntos por partido'],[nf(tr/mp,1),'Tries por partido'],[yel,'Amarillas']].map(x=>`<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}
function leaders(){
 const defs=[['Más tries',t=>A[t].tries,0,'tr'],['Mejor ataque (puntos a favor)',t=>A[t].pf,0],['Mejor defensa (puntos en contra)',t=>A[t].pc,0,'',true],['Posesión',t=>A[t].pos,1,'%'],['Tiempo en campo rival',t=>A[t].rival,1,'%'],['Line-out obtenido',t=>mval(t,'lo'),1,'%'],['Scrum obtenido',t=>mval(t,'sc'),1,'%'],['Break lines por partido',t=>mval(t,'bl'),1],['Recepción de salida tras anotar',t=>mval(t,'rst'),1,'%'],['Lanzamientos que ganan la línea',t=>mval(t,'lzg'),1,'%'],['Lanzamientos que pierden la línea',t=>mval(t,'lzp'),1,'%'],['Menos penales por partido',t=>mval(t,'pen'),1,'',true]];
 return `<div class="grid g3">`+defs.map(d=>{const arr=D.teams.map(t=>[t.k,d[1](t.k)]).sort((a,b)=>d[4]?a[1]-b[1]:b[1]-a[1]).slice(0,3);const mx=Math.max(...arr.map(x=>x[1]))||1;
  return `<div class="card lead"><h3 class="sub">${d[0]}</h3>`+arr.map((x,i)=>`<div class="row"><span class="r1">${i+1}</span>${crest(x[0],30)}<span>${T[x[0]].short}</span><span class="v">${nf(x[1],d[2])}${d[3]==='%'?'%':''}</span><div class="bar"><i style="width:${d[4]?(arr[0][1]/x[1]*100):x[1]/mx*100}%;background:${COL[x[0]]}"></i></div></div>`).join('')+`</div>`}).join('')+`</div>`}
function matchCard(m,sel){const w=m.pl>m.pv?'l':m.pl<m.pv?'v':'';
 return `<button type="button" class="mc${sel?' sel':''}" data-m="${m.id}"><div class="tt ${w==='l'?'w':'l'}">${crest(m.l,52)}<span>${T[m.l].short}</span></div><div class="sc"><span class="${w==='l'?'w':'l'}">${m.pl}</span> <span class="mut">–</span> <span class="${w==='v'?'w':'l'}">${m.pv}</span><small>${fmtDate(m.d)}${m.inc?' · incompleto':''}</small></div><div class="tt ${w==='v'?'w':'l'}">${crest(m.v,52)}<span>${T[m.v].short}</span></div></button>`}
function fechaChips(){return `<div class="chips fchips" role="group" aria-label="Fecha">`+Array.from({length:14},(_,i)=>i+1).map(f=>`<button class="chip" type="button" data-f="${f}" aria-pressed="${f===state.fecha}">F${f}</button>`).join('')+`</div>`}
function renderResumen(){const el=$('#v-resumen');
 el.innerHTML=`<h2 class="sec">Tabla de posiciones</h2><div class="card tw"><table class="st"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>PF</th><th>PC</th><th>Dif</th><th>Tries</th><th>Bonus</th><th>Pts</th><th>Últimos 5</th></tr></thead><tbody>`+TAB.map(r=>{const k=r.equipo;return `<tr data-t="${k}" class="${r.posicion<=4?'zone':''}"><td class="pos">${r.posicion}</td><td class="tm"><span class="tmc">${crest(k,34)}${T[k].name}</span></td><td>${r.pj}</td><td>${r.pg}</td><td>${r.pe}</td><td>${r.pp}</td><td>${r.pf}</td><td>${r.pc}</td><td>${r.dif>0?'+':''}${r.dif}</td><td>${r.tries}</td><td>${r.bonus_tries+r.bonus_derrota}</td><td class="pts">${r.puntos_oficiales}</td><td><span class="form">${form(k).map(x=>`<i class="${x}">${x==='G'?'G':x==='E'?'E':'P'}</i>`).join('')}</span></td></tr>`}).join('')+`</tbody></table></div><p class="note">Los cuatro primeros marcados en verde. Tocá un equipo para ver su ficha.</p>
 <h2 class="sec sp24">Resultados por fecha</h2>${fechaChips()}<div class="mgrid sp16" id="fmatches"></div>
 <h2 class="sec sp24">Líderes del torneo</h2>${leaders()}${YEARS.length>1?`<h2 class="sec sp24">Evolución entre temporadas</h2><div id="evo"></div>`:''}`;
 renderFecha();if(YEARS.length>1)renderEvo()}
// ---------- EVOLUCIÓN ----------
function evoClubs(){const y1=YEARS[YEARS.length-1],y0=YEARS[0];const all=new Set();YEARS.forEach(y=>CTX[y].D.teams.forEach(t=>all.add(t.k)));
 const pos=(y,k)=>{const r=CTX[y].TAB.find(r=>r.equipo===k);return r?r.posicion:99};
 const kind=k=>YEARS.every(y=>CTX[y].A[k])?0:(CTX[y1].A[k]?1:2);
 return [...all].sort((a,b)=>kind(a)-kind(b)||pos(y1,a)-pos(y1,b)||pos(y0,a)-pos(y0,b)).map(k=>({k,kind:kind(k)}))}
function dFmt(d,m){const x=nf(Math.abs(d),m.d);return (d>0?'+':d<0?'−':'')+x+(m.u==='%'?' pp':'')}
function renderEvo(){const el=$('#evo');if(!el)return;const y0=YEARS[0],y1=YEARS[YEARS.length-1],ms=state.evo.map(k=>M_[k]);
 const groups=[...new Set(METRICS.map(m=>m.g))];
 const picker=`<details class="evopick" ${state.evoOpen?'open':''}><summary>Elegir estadísticas · ${ms.length} seleccionadas</summary>`+groups.map(g=>`<div class="gtitle sm">${g}</div><div class="chips">`+METRICS.filter(m=>m.g===g).map(m=>`<button class="chip" type="button" data-ev="${m.k}" aria-pressed="${state.evo.includes(m.k)}">${m.l}</button>`).join('')+`</div>`).join('')+`</details>`;
 const head=`<tr><th>Club</th>`+ms.map(m=>`<th>${m.l}<small>${y0} → ${y1}</small></th>`).join('')+`</tr>`;
 const body=evoClubs().map(c=>{const k=c.k;const has=y=>!!CTX[y].A[k];
  const tag=c.kind===0?'':`<span class="only">solo ${c.kind===1?y1:y0}</span>`;
  const cells=ms.map(m=>{const v0=has(y0)?mvS(y0,k,m.k):null,v1=has(y1)?mvS(y1,k,m.k):null;const u=m.u||'';
   if(c.kind===0){const d=v1-v0,good=m.dir*d>0,cls=m.dir===0||Math.abs(d)<.05?'':good?'up':'dn';return `<td><span class="ev"><span class="mut">${nf(v0,m.d)}${u}</span> → <b>${nf(v1,m.d)}${u}</b></span><em class="dl ${cls}">${dFmt(d,m)}</em></td>`}
   const v=v0==null?v1:v0;return `<td><span class="ev"><b>${nf(v,m.d)}${u}</b></span><em class="dl">solo ${v0==null?y1:y0}</em></td>`}).join('');
  return `<tr ${c.kind===0?`data-evc="${k}" class="clk"`:''}><td class="tm"><span class="tmc">${crest(k,28)}${T[k].short}${tag}</span></td>${cells}</tr>`}).join('');
 el.innerHTML=`<div class="card">${picker}<div class="tw sp16"><table class="st evt"><thead>${head}</thead><tbody>${body}</tbody></table></div><p class="note sp16">Cada celda muestra el valor de ${y0}, el de ${y1} y la diferencia. Los porcentajes se comparan en puntos porcentuales (pp). Verde: mejoró; rojo: empeoró (en penales, tarjetas y puntos en contra, bajar es mejorar). Son 14 partidos por año y los planteles cambian, así que las diferencias chicas pueden ser casualidad. Tocá un club que jugó los dos años para compararlo.</p></div>`}
function renderFecha(){$('#fmatches').innerHTML=D.m.filter(m=>m.f===state.fecha).map(x=>matchCard(x)).join('');$$('#v-resumen .fchips .chip').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.f===state.fecha)))}
// ---------- EQUIPOS ----------
function hbars(items,unit){const mx=Math.max(...items.map(i=>i[1]))||1;return items.map(i=>`<div class="hb"><span>${i[0]}</span><div class="tr"><i style="width:${i[1]/mx*100}%;background:${i[2]||''}"></i></div><span class="vv">${nf(i[1],0)}${unit||''}</span></div>`).join('')}
function stackBar(w,s,p,lab,nopct){const tot=w+s+p;if(!tot)return '<div class="stack"></div>';const seg=(v,c)=>v?`<i style="width:${v/tot*100}%;background:${c}">${v}</i>`:'';return `<div><div class="hd mut" style="font:600 12px var(--fb);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">${lab}${nopct?'':' · '+nf(pc(w+s,tot),0)+'% obtenido'}</div><div class="stack">${seg(w,'var(--good)')}${seg(s,'#C9A227')}${seg(p,'var(--bad)')}</div></div>`}
function robBar(n,t,lab){return `<div><div class="hd mut" style="font:600 12px var(--fb);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">${lab} · ${nf(pc(n,t),0)}% de los del rival (${n} de ${t})</div><div class="stack">${n?`<i style="width:${n/t*100}%;background:var(--good)">${n}</i>`:''}</div></div>`}
function recBar(a,p,lab){const o=a[p+'_asegurada'],s=a[p+'_rival_recupera_sucia'],n=a[p+'_rival_recupera'];return stackBar(o,0,s+n,lab+' · '+(o+s+n))}
function lzBar(a){const t=a.lanzamiento,g=a.lanzamiento_resultado_gana,e=a.lanzamiento_resultado_empata,p=a.lanzamiento_resultado_pierde;const seg=(v,c,l)=>v?`<i style="width:${v/t*100}%;background:${c}" title="${l}">${v}</i>`:'';return `<div><div class="hd mut" style="font:600 12px var(--fb);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">Lanzamientos · ${t} · ${nf(pc(g,t),0)}% ganan la línea de ventaja</div><div class="stack">${seg(g,'var(--good)','Ganan la línea de ventaja')}${seg(e,'#C9A227','Empatan')}${seg(p,'var(--bad)','Pierden la línea de ventaja')}</div><div class="leg"><span><b style="background:var(--good)"></b>Ganan la línea</span><span><b style="background:#C9A227"></b>Empatan</span><span><b style="background:var(--bad)"></b>Pierden la línea</span></div></div>`}
function killer(a){const t=a.killer_instinct,s=a.killer_instinct_resultado_try+a.killer_instinct_resultado_score;const seg=(v,c,l)=>v?`<i style="width:${v/t*100}%;background:${c}" title="${l}">${v}</i>`:'';return `<div><div class="mut" style="font:600 12px var(--fb);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px">Killer instinct · ${t} entradas al 22 · ${s} con puntos (${nf(pc(s,t),0)}%)</div><div class="stack">${seg(a.killer_instinct_resultado_try,'var(--good)','Try')}${seg(a.killer_instinct_resultado_score,'#C9A227','Puntos de penal o patada')}${seg(a.killer_instinct_resultado_turnover,'#7b8aa3','Turnover')}${seg(a.killer_instinct_resultado_penal_fk_ec,'var(--bad)','Penal o FK en contra')}</div><div class="leg"><span><b style="background:var(--good)"></b>Try</span><span><b style="background:#C9A227"></b>Score</span><span><b style="background:#7b8aa3"></b>Turnover</span><span><b style="background:var(--bad)"></b>Penal / FK en contra</span></div></div>`}
function halves(team){let a=[0,0,0,0];D.m.forEach(m=>{if(m.l!==team&&m.v!==team)return;const side=m.l===team?0:1;m.ev.forEach(e=>{const p={T:5,P:7,C:2,K:3}[e[2]];if(!p)return;const h=e[0]<40?0:1;if(e[1]===side)a[h]+=p;else a[2+h]+=p})});return a}
function renderEquipos(){const el=$('#v-equipos'),k=state.team,a=A[k],tr=TAB.find(r=>r.equipo===k),c=COL[k],tx=DARKTX[k]?'#1b1300':'#fff';
 const f=form(k),hv=halves(k);
 const kp=(l,v,d,u,key)=>{const lg=leagueAvg(key),df=v-lg,better=M_[key].dir*df>0;const cls=M_[key].dir===0||Math.abs(df)<.05?'':better?'up':'dn';return `<div class="kpi"><span>${l}</span><b>${nf(v,d)}${u||''}</b><em class="${cls}">torneo ${nf(lg,d)}${u||''}</em></div>`};
 el.innerHTML=`<h2 class="sec">Ficha de equipo</h2><div class="tsel" id="tsel">`+TAB.map(r=>`<button type="button" data-t="${r.equipo}" aria-pressed="${r.equipo===k}">${crest(r.equipo,46)}<span>${T[r.equipo].short}</span></button>`).join('')+`</div>
 <div class="thero sp16" style="background:linear-gradient(115deg,${c} 0%,${c}dd 40%,#0b1626 130%);color:${tx}">${crest(k,104)}<div><h2>${T[k].name}</h2><div class="rec">${tr.posicion}º en la tabla · ${tr.puntos_oficiales} pts · ${tr.pg} ganados, ${tr.pe} empatados, ${tr.pp} perdidos · ${tr.pf} a favor, ${tr.pc} en contra</div></div></div>
 <div class="kpis sp16">${kp('Puntos a favor',mval(k,'pf'),1,'','pf')}${kp('Puntos en contra',mval(k,'pc'),1,'','pc')}${kp('Tries por partido',mval(k,'tr'),1,'','tr')}${kp('Posesión',a.pos,1,'%','pos')}${kp('Campo rival',a.rival,1,'%','rv')}${kp('Break lines',mval(k,'bl'),1,'','bl')}</div>
 <div class="grid g2 sp16"><div class="card"><h3 class="sub">Perfil de juego contra el promedio del torneo</h3><div class="chartbox">${radar([{v:RAD.map(k=>norm(k,leagueAvg(k))),c:'#8EA2BF',dash:1},{v:radVals(key=>mval(k,key)),c:c}])}</div><div class="lg"><span><i style="background:${c}"></i>${T[k].short}</span><span><i style="background:#8EA2BF"></i>Promedio del torneo</span></div><p class="note">Cada eje va del peor al mejor equipo del torneo. En disciplina y defensa, afuera es mejor.</p></div>
 <div class="card"><h3 class="sub">Puntos por tiempo (según eventos)</h3>${halfBars(hv,c)}<h3 class="sub sp16">Fases estáticas</h3><div class="grid" style="gap:12px">${stackBar(a.scrum_resultado_ganada,a.scrum_resultado_gana_sucia,a.scrum_resultado_perdida,'Scrum propio · '+a.scrum)}${stackBar(a.line_out_resultado_ganada,a.line_out_resultado_gana_sucia,a.line_out_resultado_perdida,'Line-out propio · '+a.line_out)}${lzBar(a)}${recBar(a,'recepcion_salida','Recepción de salida')}${recBar(a,'recepcion_tras_score','Recepción tras anotar')}${robBar(a.sc_rob,a.sc_rivtot,'Scrum robados al rival')}${robBar(a.lo_rob,a.lo_rivtot,'Line-out robados al rival')}${killer(a)}${stackBar(a.salidas_resultado_ganada,a.salidas_resultado_gana_sucia,a.salidas_resultado_perdida,'Salidas · '+a.salidas,1)}</div><div class="leg"><span><b style="background:var(--good)"></b>Ganada</span><span><b style="background:#C9A227"></b>Ganada sucia</span><span><b style="background:var(--bad)"></b>Perdida</span></div></div></div>
 <div class="grid g3 sp16"><div class="card"><h3 class="sub">De dónde vienen los tries</h3>${hbars([['Multifase',a.try_desde_origen_multifase],['Break line',a.try_desde_origen_break_line],['Line y maul',a.try_desde_origen_line_y_maul],['Lanzamiento',a.try_desde_origen_lanzamiento],['Scrum',a.try_desde_origen_scrum],['Recupero',a.try_desde_origen_recupero],['Pick and go',a.try_desde_origen_pick_and_go],['Turnover',a.try_desde_origen_turnover]].sort((x,y)=>y[1]-x[1]).map(x=>[x[0],x[1],c]))}<p class="note">${a.try_desde} tries con origen registrado.</p></div>
 <div class="card"><h3 class="sub">Penales concedidos por motivo</h3>${hbars([['Ruck',a.penal_concedido_motivo_ruck],['Scrum',a.penal_concedido_motivo_scrum],['Offside',a.penal_concedido_motivo_offside],['Maul',a.penal_concedido_motivo_maul],['Inconducta / JS',a.penal_concedido_motivo_inconducta_js],['Otro',a.penal_concedido_motivo_otro]].sort((x,y)=>y[1]-x[1]).map(x=>[x[0],x[1],'var(--gold)']))}<p class="note">${a.penal_concedido} penales: ${a.penal_concedido_status_ataque+a.penal_concedido_tarjeta_ataque} en ataque y ${a.penal_concedido_status_defensa+a.penal_concedido_tarjeta_defensa} en defensa.</p></div>
 <div class="card"><h3 class="sub">Cómo termina el break line</h3>${hbars([['Sigue el juego',a.break_line_finaliza_juego],['Try',a.break_line_finaliza_try],['Turnover',a.break_line_finaliza_turnovers],['Penal / FK a favor',a.break_line_finaliza_p_fk_af],['Penal / FK en contra',a.break_line_finaliza_p_fk_ec]].map(x=>[x[0],x[1],c]))}<h3 class="sub" style="margin-top:22px">Qué sigue tras el break line</h3>${hbars([['Pase',a.break_line_sigue_pase],['Ruck',a.break_line_sigue_ruck],['Try',a.break_line_sigue_try]].map(x=>[x[0],x[1],c]))}<p class="note">${a.break_line} break lines en ${a.pj} partidos. Amarillas ${a.t_amarilla}, rojas ${a.t_roja}.</p></div></div>
 <h2 class="sec sp24">Partidos de ${T[k].short}</h2><div class="card" id="fxl">${a.rows.slice().sort((x,y)=>x.fecha_numero-y.fecha_numero).map(r=>{const m=MATCH[r.partido_id],home=m.l===k,riv=home?m.v:m.l;return `<button class="fx" type="button" data-m="${m.id}"><span class="mut num">F${m.f}</span><span class="rv">${crest(riv,28)}${home?'vs':'@'} ${T[riv].short}</span><span class="num"><b>${home?m.pl:m.pv}</b> – ${home?m.pv:m.pl}</span><span class="pill ${r.resultado}">${r.resultado}</span></button>`}).join('')}</div>`
}
function halfBars(h,c){const mx=Math.max(...h,1);const row=(l,a,b)=>`<div class="hb"><span>${l}</span><div class="tr" style="height:14px"><i style="width:${a/mx*100}%;background:${c}"></i></div><span class="vv">${a}</span></div><div class="hb" style="padding-top:0"><span class="mut" style="font-size:12px">en contra</span><div class="tr" style="height:8px"><i style="width:${b/mx*100}%;background:var(--bad)"></i></div><span class="vv mut" style="font-size:14px">${b}</span></div>`;return row('Primer tiempo',h[0],h[2])+row('Segundo tiempo',h[1],h[3])}
// ---------- COMPARAR ----------
const AVGC='#8EA2BF';
const avgSvg=(w,h)=>`<svg width="${w}" height="${h}" viewBox="0 0 52 60" aria-hidden="true"><circle cx="26" cy="30" r="22" fill="none" stroke="#8EA2BF" stroke-width="3" stroke-dasharray="5 4"/><text x="26" y="36" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="800" font-size="20" fill="#8EA2BF">AVG</text></svg>`;
function sideOf(s){const i=s.indexOf('|');return {y:s.slice(0,i),k:s.slice(i+1)}}
function sv(s,m){const {y,k}=sideOf(s);return k==='AVG'?leagueAvgS(y,m):mvS(y,k,m)}
function lighten(h,f){const n=parseInt(h.slice(1),16),m=x=>Math.round(x+(255-x)*f).toString(16).padStart(2,'0');return '#'+m(n>>16)+m(n>>8&255)+m(n&255)}
function sInfo(s,cross,prev){const {y,k}=sideOf(s),yr=cross?' '+y:'';
 if(k==='AVG')return {name:'Promedio del torneo'+yr,c:AVGC,short:'Torneo'+yr};
 let c=COL[k];if(prev&&prev.some(o=>sideOf(o).k===k))c=lighten(c,.5);
 return {name:T[k].name+yr,c,short:T[k].short+yr}}
function sideCrest(s,size){const {k}=sideOf(s);return k==='AVG'?avgSvg(size*.62,size*.72):crest(k,size)}
function subOf(m,s){const {y,k}=sideOf(s);return m.sub&&k!=='AVG'?`<span class="pcs">${m.sub(CTX[y].A[k])}</span>`:''}
function renderComparar(){const el=$('#v-comparar'),cross=state.cmode==='cross';
 const modes=`<div class="chips cmodes" role="group" aria-label="Tipo de comparación"><button class="chip" type="button" data-cm="season" aria-pressed="${!cross}">En una temporada</button>${YEARS.length>1?`<button class="chip" type="button" data-cm="cross" aria-pressed="${cross}">Entre temporadas</button>`:''}</div>`;
 let ctl,view;
 if(!cross){
  const chip=k=>{const on=state.sel.includes(SEAS+'|'+k);return `<button type="button" data-tc="${k}" aria-pressed="${on}">${k==='AVG'?avgSvg(18,21):crest(k,26)}<span>${k==='AVG'?'Promedio del torneo':T[k].short}</span></button>`};
  ctl=`<div class="tchips" id="tchips" role="group" aria-label="Equipos a comparar">${TAB.map(r=>chip(r.equipo)).join('')}${chip('AVG')}</div><p class="note">Elegí de 2 a 4 equipos del torneo ${SEAS}. Con 2 ves el cara a cara; con 3 o 4, una columna por equipo.</p>`;
  view=state.sel.length===2?pairView(state.sel[0],state.sel[1],false):multiView(state.sel)}
 else{
  const opts=cur=>YEARS.slice().reverse().map(y=>`<optgroup label="${y}">`+CTX[y].TAB.map(r=>`<option value="${y}|${r.equipo}" ${cur===y+'|'+r.equipo?'selected':''}>${T[r.equipo].name} ${y}</option>`).join('')+`<option value="${y}|AVG" ${cur===y+'|AVG'?'selected':''}>Promedio del torneo ${y}</option></optgroup>`).join('');
  ctl=`<div class="cmpctl"><label>Equipo y temporada A<select class="sel" id="sx">${opts(state.X)}</select></label><label>Equipo y temporada B<select class="sel" id="sy">${opts(state.Y)}</select></label></div>`;
  view=pairView(state.X,state.Y,true)}
 el.innerHTML=`<h2 class="sec">Comparar equipos</h2>${modes}${ctl}${view}`}
function pairView(a,b,cross){const ta=sInfo(a,cross,[]),tb=sInfo(b,cross,[a]),A_=sideOf(a),B_=sideOf(b);
 const groups=[...new Set(METRICS.map(m=>m.g))];
 const rowsHtml=g=>METRICS.filter(m=>m.g===g).map(m=>{const va=sv(a,m.k),vb=sv(b,m.k),mx=Math.max(va,vb)||1;const wa=va/mx*100,wb=vb/mx*100;let wl=false,wr=false;if(m.dir!==0&&Math.abs(va-vb)>1e-9){const aw=(va-vb)*m.dir>0;wl=aw;wr=!aw}else if(m.dir===0){wl=wr=true}
  return `<div class="mr"><div class="lab">${m.l}</div><div class="vl ${wl?'win':''}">${nf(va,m.d)}${m.u||''}${subOf(m,a)}</div><div class="bars"><div class="a"><i class="${wl||m.dir===0?'':'dim'}" style="width:${wa}%;background:${ta.c}"></i></div><div class="b"><i class="${wr||m.dir===0?'':'dim'}" style="width:${wb}%;background:${tb.c}"></i></div></div><div class="vr ${wr?'win':''}">${nf(vb,m.d)}${m.u||''}${subOf(m,b)}</div></div>`}).join('');
 let h2h='';if(!cross&&A_.k!=='AVG'&&B_.k!=='AVG'&&a!==b){const ms=D.m.filter(m=>(m.l===A_.k&&m.v===B_.k)||(m.l===B_.k&&m.v===A_.k));h2h=`<h2 class="sec sp24">Cara a cara en ${SEAS}</h2><div class="mgrid">`+ms.map(x=>matchCard(x)).join('')+`</div>`+(ms.length?'':'<p class="note">No se enfrentaron en esta fase.</p>')}
 const nota=cross?'Cada eje va del peor al mejor valor entre los dos torneos juntos. En disciplina y defensa, afuera es mejor.':'Cada eje va del peor al mejor equipo del torneo. En disciplina y defensa, afuera es mejor.';
 return `<div class="vs"><div class="side">${sideCrest(a,84)}<b style="color:${ta.c}">${ta.name}</b></div><div class="mid">VS</div><div class="side">${sideCrest(b,84)}<b style="color:${tb.c}">${tb.name}</b></div></div>
 <div class="grid g2 sp16"><div class="card"><h3 class="sub">Perfil de juego</h3><div class="chartbox">${radar([{v:radVals(k=>sv(b,k),cross),c:tb.c},{v:radVals(k=>sv(a,k),cross),c:ta.c}])}</div><div class="lg"><span><i style="background:${ta.c}"></i>${ta.short}</span><span><i style="background:${tb.c}"></i>${tb.short}</span></div><p class="note">${nota}</p></div>
 <div class="card"><h3 class="sub">Resumen</h3>${summary(a,b,ta,tb)}</div></div>
 <div class="card sp16">${groups.map(g=>`<div class="sp16" style="margin-top:6px"><div class="gtitle">${g}</div>${rowsHtml(g)}</div>`).join('')}<p class="note sp16">Valores por partido, salvo los porcentajes y las rojas. Debajo de cada porcentaje va la cantidad sobre el total. La barra más oscura marca al que lo hace mejor; en las estadísticas sin ventaja clara se muestran las dos.</p></div>${h2h}`}
function summary(a,b,ta,tb){let wa=0,wb=0;METRICS.forEach(m=>{if(m.dir===0)return;const d=(sv(a,m.k)-sv(b,m.k))*m.dir;if(Math.abs(d)<1e-9)return;d>0?wa++:wb++});const tot=wa+wb;
 return `<div class="kpis"><div class="kpi"><span>${ta.short} mejor en</span><b style="color:${ta.c}">${wa}</b><em>de ${tot} estadísticas</em></div><div class="kpi"><span>${tb.short} mejor en</span><b style="color:${tb.c}">${wb}</b><em>de ${tot} estadísticas</em></div></div><div class="stack sp16" style="height:14px"><i style="width:${tot?wa/tot*100:50}%;background:${ta.c}"></i><i style="width:${tot?wb/tot*100:50}%;background:${tb.c}"></i></div><p class="note">Se cuentan las estadísticas donde se puede decir qué valor es mejor. Pelota en juego, patadas, lanzamientos y turnovers no puntúan.</p>`}
function multiView(sel){const n=sel.length,inf=sel.map(s=>sInfo(s,false,[]));
 const groups=[...new Set(METRICS.map(m=>m.g))];
 const bestOf=m=>{if(m.dir===0)return null;const v=sel.map(s=>sv(s,m.k)),t=m.dir>0?Math.max(...v):Math.min(...v);return v.map(x=>Math.abs(x-t)<1e-9)};
 const wins=sel.map(()=>0);let tot=0;METRICS.forEach(m=>{const b=bestOf(m);if(!b)return;tot++;if(b.filter(Boolean).length===1)wins[b.indexOf(true)]++});
 const rowsHtml=g=>METRICS.filter(m=>m.g===g).map(m=>{const v=sel.map(s=>sv(s,m.k)),mx=Math.max(...v)||1,b=bestOf(m);
  return `<div class="mm"><div class="lab">${m.l}</div><div class="cells" style="--n:${n}">`+sel.map((s,i)=>`<div class="cell ${!b||b[i]?'win':''}"><b>${nf(v[i],m.d)}${m.u||''}</b>${subOf(m,s)}<div class="bar"><i style="width:${v[i]/mx*100}%;background:${inf[i].c}"></i></div></div>`).join('')+`</div></div>`}).join('');
 return `<div class="mvh" style="--n:${n}">${sel.map((s,i)=>`<div class="side">${sideCrest(s,n>3?64:76)}<b style="color:${inf[i].c}">${inf[i].short}</b></div>`).join('')}</div>
 <div class="grid g2 sp16"><div class="card"><h3 class="sub">Perfil de juego</h3><div class="chartbox">${radar(sel.map((s,i)=>({v:radVals(k=>sv(s,k)),c:inf[i].c})))}</div><div class="lg">${inf.map(t=>`<span><i style="background:${t.c}"></i>${t.short}</span>`).join('')}</div><p class="note">Cada eje va del peor al mejor equipo del torneo. En disciplina y defensa, afuera es mejor.</p></div>
 <div class="card"><h3 class="sub">Resumen</h3><div class="kpis">${inf.map((t,i)=>`<div class="kpi"><span>${t.short} es el mejor en</span><b style="color:${t.c}">${wins[i]}</b><em>de ${tot} estadísticas</em></div>`).join('')}</div><p class="note sp16">Se cuenta cuando un solo equipo tiene el mejor valor. Las estadísticas donde no se puede decir qué es mejor (pelota en juego, patadas, lanzamientos, turnovers) no puntúan.</p></div></div>
 <div class="card sp16">${groups.map(g=>`<div class="sp16" style="margin-top:6px"><div class="gtitle">${g}</div>${rowsHtml(g)}</div>`).join('')}<p class="note sp16">Valores por partido, salvo los porcentajes y las rojas. Debajo de cada porcentaje va la cantidad sobre el total. En cada fila, lo más claro marca al que lo hace mejor.</p></div>`}
// ---------- PARTIDOS ----------
function sideRow(id,side){return D.s.find(r=>r.partido_id===id&&r.condicion===side)}
function stepPath(pts,x,y){let d='';let px=x(0),py=y(0);d+=`M${px},${py}`;pts.forEach(p=>{d+=`L${x(p[0])},${py}L${x(p[0])},${y(p[1])}`;py=y(p[1])});return d}
function scoreChart(m,cl,cv){const W=720,H=250,L=34,R=14,Tp=14,B=46;const maxM=Math.max(80,...m.ev.map(e=>e[0]));
 const run=[[],[]];const sc=[0,0];m.ev.forEach(e=>{const p={T:5,P:7,C:2,K:3}[e[2]];if(!p)return;sc[e[1]]+=p;run[e[1]].push([e[0],sc[e[1]],e[2]])});
 const ymax=Math.max(10,Math.ceil(Math.max(sc[0],sc[1])/10)*10);const x=v=>L+(W-L-R)*v/maxM,y=v=>H-B-(H-B-Tp)*v/ymax;
 let s=`<svg class="ch wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del marcador">`;
 for(let v=0;v<=ymax;v+=ymax>40?20:10){s+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text class="ax" x="${L-6}" y="${y(v)+4}" text-anchor="end">${v}</text>`}
 for(let v=0;v<=80;v+=10){s+=`<text class="ax" x="${x(v)}" y="${H-B+16}" text-anchor="middle">${v}'</text>`}
 s+=`<line x1="${x(40)}" x2="${x(40)}" y1="${Tp}" y2="${H-B}" stroke="var(--mut)" stroke-dasharray="4 4"/><text class="ax" x="${x(40)+4}" y="${Tp+10}">Entretiempo</text>`;
 [[run[0],cl],[run[1],cv]].forEach(([r,c])=>{s+=`<path d="${stepPath(r,x,y)}L${x(maxM)},${y(r.length?r[r.length-1][1]:0)}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`;r.forEach(p=>{if(p[2]==='T'||p[2]==='P')s+=`<circle cx="${x(p[0])}" cy="${y(p[1])}" r="5.5" fill="${c}" stroke="var(--surf)" stroke-width="2"><title>Try ${Math.floor(p[0])}'</title></circle>`;else if(p[2]==='K')s+=`<rect x="${x(p[0])-4}" y="${y(p[1])-4}" width="8" height="8" transform="rotate(45 ${x(p[0])} ${y(p[1])})" fill="${c}" stroke="var(--surf)" stroke-width="1.5"><title>Penal ${Math.floor(p[0])}'</title></rect>`})});
 // tarjetas
 const cy0=H-B+26;[0,1].forEach(side=>{m.ev.filter(e=>e[1]===side&&(e[2]==='Y'||e[2]==='R')).forEach(e=>{s+=`<rect x="${x(e[0])-4}" y="${cy0+side*11-5}" width="8" height="10" rx="1.5" fill="${e[2]==='Y'?'#F2C94C':'#E5484D'}"><title>${e[2]==='Y'?'Amarilla':'Roja'} ${Math.floor(e[0])}'</title></rect>`})});
 s+=`<text class="ax" x="${L-6}" y="${cy0+3}" text-anchor="end" fill="${cl}">${T[m.l].code}</text><text class="ax" x="${L-6}" y="${cy0+14}" text-anchor="end">${T[m.v].code}</text></svg>`;return s}
function divChart(share,cl,cv,lab){const W=720,H=170,L=34,R=14,mid=84,hh=66;const bw=(W-L-R)/16;
 let s=`<svg class="ch wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="${lab}"><line x1="${L}" x2="${W-R}" y1="${mid}" y2="${mid}" stroke="var(--mut)"/>`;
 [25,-25].forEach(v=>{s+=`<line x1="${L}" x2="${W-R}" y1="${mid-v/50*hh}" y2="${mid-v/50*hh}" stroke="var(--line)" stroke-dasharray="3 5"/>`});
 s+=`<text class="ax" x="${L-6}" y="${mid-hh+4}" text-anchor="end">75%</text><text class="ax" x="${L-6}" y="${mid+4}" text-anchor="end">50%</text><text class="ax" x="${L-6}" y="${mid+hh+4}" text-anchor="end">75%</text>`;
 share.forEach((v,i)=>{const x0=L+i*bw+3,w=bw-6;if(v==null){s+=`<rect x="${x0}" y="${mid-1}" width="${w}" height="2" fill="var(--line)"/>`}else{const d=v-50,hgt=Math.abs(d)/50*hh;s+=`<rect x="${x0}" y="${d>=0?mid-hgt:mid}" width="${w}" height="${Math.max(hgt,1.5)}" rx="2" fill="${d>=0?cl:cv}"><title>${i*5}'–${i*5+5}': ${nf(v,0)}% ${d>=0?'local':'visitante'}</title></rect>`}
  if(i%2===0)s+=`<text class="ax" x="${x0+w/2}" y="${H-4}" text-anchor="middle">${i*5}'</text>`});
 return s+`</svg>`}
function shareArr(a,b){return a.map((v,i)=>{const t=v+b[i];return t>15?100*v/t:null})}
function statRows(m,L,V,cl,cv){
 const sc=r=>r.scrum_resultado_ganada+r.scrum_resultado_gana_sucia,lo=r=>r.line_out_resultado_ganada+r.line_out_resultado_gana_sucia,kp=r=>r.killer_instinct_resultado_try+r.killer_instinct_resultado_score;
 const of=(a,t)=>t?`${a} de ${t} · ${nf(100*a/t,0)}%`:'sin datos';
 const rows=[
 ['Posesión %',L.posesion_pct,V.posesion_pct,1,1,'%'],['Tiempo en campo rival %',100-L.pct_tiempo_en_campo_propio,100-V.pct_tiempo_en_campo_propio,1,1,'%'],
 ['Tries',L.tries,V.tries,0,1],['Conversiones',L.conversiones,V.conversiones,0,1],['Penales pateados',L.penales_pateados,V.penales_pateados,0,1],
 ['Break lines',L.break_line,V.break_line,0,1],
 ['Break lines que terminan en try',L.break_line_finaliza_try,V.break_line_finaliza_try,0,1,'',of(L.break_line_finaliza_try,L.break_line),of(V.break_line_finaliza_try,V.break_line)],
 ['Lanzamientos',L.lanzamiento,V.lanzamiento,0,0],
 ['Lanzamientos que ganan la línea de ventaja',L.lanzamiento_resultado_gana,V.lanzamiento_resultado_gana,0,1,'',of(L.lanzamiento_resultado_gana,L.lanzamiento),of(V.lanzamiento_resultado_gana,V.lanzamiento)],
 ['Lanzamientos que pierden la línea de ventaja',L.lanzamiento_resultado_pierde,V.lanzamiento_resultado_pierde,0,-1,'',of(L.lanzamiento_resultado_pierde,L.lanzamiento),of(V.lanzamiento_resultado_pierde,V.lanzamiento)],
 ['Killer instinct (entradas al 22)',L.killer_instinct,V.killer_instinct,0,1],
 ['Killer instinct que termina en puntos',kp(L),kp(V),0,1,'',of(kp(L),L.killer_instinct),of(kp(V),V.killer_instinct)],
 ['Recepción de salida asegurada',L.recepcion_salida_asegurada,V.recepcion_salida_asegurada,0,1,'',of(L.recepcion_salida_asegurada,L.recepcion_salida_total),of(V.recepcion_salida_asegurada,V.recepcion_salida_total)],
 ['Recepción tras anotar asegurada',L.recepcion_tras_score_asegurada,V.recepcion_tras_score_asegurada,0,1,'',of(L.recepcion_tras_score_asegurada,L.recepcion_tras_score_total),of(V.recepcion_tras_score_asegurada,V.recepcion_tras_score_total)],
 ['Scrum robados al rival',V.scrum_resultado_perdida,L.scrum_resultado_perdida,0,1,'',of(V.scrum_resultado_perdida,V.scrum),of(L.scrum_resultado_perdida,L.scrum)],
 ['Line-out robados al rival',V.line_out_resultado_perdida,L.line_out_resultado_perdida,0,1,'',of(V.line_out_resultado_perdida,V.line_out),of(L.line_out_resultado_perdida,L.line_out)],
 ['Rucks ganados',L.ruck_ganado,V.ruck_ganado,0,1],['Rucks perdidos',L.ruck_perdido,V.ruck_perdido,0,-1],
 ['Patadas',L.kick,V.kick,0,0],['Patadas efectivas',L.efect_kick_resultado_si,V.efect_kick_resultado_si,0,1],['Turnovers',L.turnovers,V.turnovers,0,0],
 ['Scrum ganados',sc(L),sc(V),0,1,'',of(sc(L),L.scrum),of(sc(V),V.scrum)],['Line-out ganados',lo(L),lo(V),0,1,'',of(lo(L),L.line_out),of(lo(V),V.line_out)],
 ['Penales concedidos',L.penal_concedido,V.penal_concedido,0,-1],['Amarillas',L.t_amarilla,V.t_amarilla,0,-1],['Rojas',L.t_roja,V.t_roja,0,-1]];
 return rows.map(r=>{const a=r[1]||0,b=r[2]||0,mx=Math.max(a,b)||1;let wl=false,wr=false;if(r[4]!==0&&a!==b){const aw=(a-b)*r[4]>0;wl=aw;wr=!aw}else if(r[4]===0){wl=wr=true}
 const sa=r[6]?`<span class="pcs">${r[6]}</span>`:'',sb=r[7]?`<span class="pcs">${r[7]}</span>`:'';
 return `<div class="mr"><div class="lab">${r[0]}</div><div class="vl ${wl?'win':''}">${nf(a,r[3])}${r[5]||''}${sa}</div><div class="bars"><div class="a"><i class="${wl?'':'dim'}" style="width:${a/mx*100}%;background:${cl}"></i></div><div class="b"><i class="${wr?'':'dim'}" style="width:${b/mx*100}%;background:${cv}"></i></div></div><div class="vr ${wr?'win':''}">${nf(b,r[3])}${r[5]||''}${sb}</div></div>`}).join('')}
function renderPartidos(){const el=$('#v-partidos'),list=D.m.filter(m=>m.f===state.fecha);if(!list.some(m=>m.id===state.match))state.match=list[0].id;
 const m=MATCH[state.match],L=sideRow(m.id,'LOCAL'),V=sideRow(m.id,'VISITANTE'),cl=COL[m.l],cv=COL[m.v];
 const bipPct=m.bip.map(v=>Math.min(100,v/3));
 const mism=(m.evsc[0]!==m.pl||m.evsc[1]!==m.pv)?`<p class="note">El detalle de eventos suma ${m.evsc[0]}-${m.evsc[1]}. El resultado oficial es ${m.pl}-${m.pv}.</p>`:'';
 const wl=m.pl>m.pv;
 el.innerHTML=`<h2 class="sec">Partidos</h2>${fechaChips()}<div class="mgrid sp16" id="pmatches">${list.map(x=>matchCard(x,x.id===m.id)).join('')}</div>
 <div class="board sp24"><div class="tm">${crest(m.l,104)}<span>${T[m.l].name}</span><small>Local</small></div><div class="scr"><span style="opacity:${wl?1:.7}">${m.pl}</span><span class="d">–</span><span style="opacity:${!wl&&m.pl!==m.pv?1:.7}">${m.pv}</span></div><div class="tm">${crest(m.v,104)}<span>${T[m.v].name}</span><small>Visitante</small></div><div class="info">Fecha ${m.f} · ${fmtDate(m.d)} · Tries ${m.tl}–${m.tv}${m.inc?' · Video incompleto: el segundo tiempo no se filmó entero':''}</div></div>
 <div class="grid g2 sp16"><div class="card" style="grid-column:1 / -1"><h3 class="sub">Marcador minuto a minuto</h3><div class="chartbox">${scoreChart(m,cl,cv)}</div><div class="lg"><span><i style="background:${cl}"></i>${T[m.l].short}</span><span><i style="background:${cv}"></i>${T[m.v].short}</span><span>● try</span><span>◆ penal</span><span><i style="background:#F2C94C;border-radius:2px"></i>amarilla</span><span><i style="background:#E5484D;border-radius:2px"></i>roja</span></div>${mism}</div>
 <div class="card"><h3 class="sub">Estadísticas del partido</h3><div class="lg" style="margin:-4px 0 8px;justify-content:space-between"><span style="color:${cl};font-weight:700">${T[m.l].short}</span><span style="color:${cv};font-weight:700">${T[m.v].short}</span></div>${statRows(m,L,V,cl,cv)}</div>
 <div class="grid" style="gap:16px;align-content:start"><div class="card"><h3 class="sub">Quién tuvo la pelota, cada 5 minutos</h3><div class="chartbox">${divChart(shareArr(m.pos[0],m.pos[1]),cl,cv,'Posesión por bloque')}</div><p class="note">Barra hacia arriba: más posesión de ${T[m.l].short}. Hacia abajo: de ${T[m.v].short}.</p></div>
 <div class="card"><h3 class="sub">Quién jugó en campo rival, cada 5 minutos</h3><div class="chartbox">${divChart(shareArr(m.ter[0],m.ter[1]),cl,cv,'Territorio por bloque')}</div><p class="note">Arriba: ${T[m.l].short} dominó el territorio. Abajo: ${T[m.v].short}.</p></div>
 <div class="card"><h3 class="sub">Ritmo: pelota en juego</h3><div class="chartbox">${bipChart(bipPct)}</div><p class="note">BIP total ${nf(L.bip_min,1)} min de 80, fuera de juego ${nf(L.out_min,1)} min.</p></div></div></div>`}
function bipChart(v){const W=720,H=130,L=34,R=14,base=100,hh=84;const bw=(W-L-R)/16;let s=`<svg class="ch wide" viewBox="0 0 ${W} ${H}" role="img" aria-label="Pelota en juego por bloque">`;
 [0,50,100].forEach(g=>{s+=`<line x1="${L}" x2="${W-R}" y1="${base-g/100*hh}" y2="${base-g/100*hh}" stroke="var(--line)"/><text class="ax" x="${L-6}" y="${base-g/100*hh+4}" text-anchor="end">${g}%</text>`});
 v.forEach((p,i)=>{const x0=L+i*bw+3,w=bw-6,h=p/100*hh;s+=`<rect x="${x0}" y="${base-h}" width="${w}" height="${h}" rx="2" fill="var(--acc)"><title>${i*5}'–${i*5+5}': ${nf(p,0)}% de pelota en juego</title></rect>`;if(i%2===0)s+=`<text class="ax" x="${x0+w/2}" y="${H-3}" text-anchor="middle">${i*5}'</text>`});return s+'</svg>'}
// ---------- control ----------
function setSeason(y){if(!CTX[y])return;useSeason(y);resetSeasonState();
 const hy=$('#hyear');if(hy)hy.textContent=y;const hk=$('#hkick');if(hk)hk.textContent='Torneo Regional Pampeano · Zona A · Temporada '+y;document.title='TRP A '+y;
 $$('#seas button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.s===y)));hstats();show(state.v)}
function show(v){state.v=v;['resumen','equipos','comparar','partidos'].forEach(n=>{$('#v-'+n).hidden=n!==v});$$('#navw .t').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===v)));
 ({resumen:renderResumen,equipos:renderEquipos,comparar:renderComparar,partidos:renderPartidos})[v]();try{const hh='#'+SEAS+'/'+v;if(location.hash!==hh)history.replaceState(null,'',hh)}catch(e){}}
//@@I18N@@
document.addEventListener('click',e=>{const t=e.target;
 if(t.closest('#lang')){setLang(LANG==='en'?'es':'en');return}
 let sb=t.closest('#seas button');if(sb){if(sb.dataset.s!==SEAS)setSeason(sb.dataset.s);return}
 sb=t.closest('[data-cm]');if(sb){state.cmode=sb.dataset.cm;renderComparar();return}
 sb=t.closest('#tchips button');if(sb){const s=SEAS+'|'+sb.dataset.tc,i=state.sel.indexOf(s);if(i>=0){if(state.sel.length>2)state.sel.splice(i,1)}else{if(state.sel.length>=4)state.sel.shift();state.sel.push(s)}renderComparar();return}
 sb=t.closest('[data-ev]');if(sb){const k=sb.dataset.ev,i=state.evo.indexOf(k);if(i>=0){if(state.evo.length>1)state.evo.splice(i,1)}else state.evo.push(k);state.evo.sort((a,b)=>METRICS.findIndex(m=>m.k===a)-METRICS.findIndex(m=>m.k===b));renderEvo();return}
 sb=t.closest('tr[data-evc]');if(sb){const k=sb.dataset.evc;state.cmode='cross';state.X=YEARS[0]+'|'+k;state.Y=YEARS[YEARS.length-1]+'|'+k;show('comparar');window.scrollTo({top:0});return}
 let b=t.closest('#navw .t');if(b){show(b.dataset.v);window.scrollTo({top:0});return}
 b=t.closest('[data-m]');if(b){const m=MATCH[b.dataset.m];state.fecha=m.f;state.match=m.id;show('partidos');$('#v-partidos .board').scrollIntoView({block:'start'});return}
 b=t.closest('.fchips .chip');if(b){state.fecha=+b.dataset.f;if(state.v==='partidos'){state.match=D.m.filter(m=>m.f===state.fecha)[0].id;renderPartidos()}else renderFecha();return}
 b=t.closest('#tsel button');if(b){state.team=b.dataset.t;renderEquipos();return}
 b=t.closest('tr[data-t]');if(b){state.team=b.dataset.t;show('equipos');window.scrollTo({top:0});return}
 if(t.closest('#theme')){const dk=document.documentElement.getAttribute('data-theme')==='dark'||(!document.documentElement.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',dk?'light':'dark')}});
document.addEventListener('change',e=>{if(e.target.id==='sx'){state.X=e.target.value;renderComparar()}if(e.target.id==='sy'){state.Y=e.target.value;renderComparar()}});
document.addEventListener('toggle',e=>{if(e.target.classList&&e.target.classList.contains('evopick'))state.evoOpen=e.target.open},true);
const VIEWS=['resumen','equipos','comparar','partidos'];
function parseHash(){let h='';try{h=location.hash.replace('#','')}catch(e){}const p=h.split('/');let y=null,v=null;p.forEach(x=>{if(CTX[x])y=x;else if(VIEWS.includes(x))v=x});return {y,v}}
$('#seas').innerHTML=YEARS.map(y=>`<button type="button" data-s="${y}" aria-pressed="${y===SEAS}">${y}</button>`).join('');
{const ph=parseHash();if(ph.y&&ph.y!==SEAS){useSeason(ph.y);resetSeasonState();const hy=$('#hyear');if(hy)hy.textContent=ph.y;const hk=$('#hkick');if(hk)hk.textContent='Torneo Regional Pampeano · Zona A · Temporada '+ph.y;document.title='TRP A '+ph.y;$$('#seas button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.s===ph.y)))}
 hstats();show(ph.v||'resumen')}
if(LANG==='en')setLang('en');else{const b=$('#lang');if(b){b.textContent='EN';b.setAttribute('aria-label','Switch to English')}}
window.addEventListener('hashchange',()=>{const ph=parseHash();if(ph.y&&ph.y!==SEAS){setSeason(ph.y)}if(ph.v&&ph.v!==state.v)show(ph.v)});
})();
