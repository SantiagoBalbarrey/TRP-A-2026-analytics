"""Paso 3. Normaliza los eventos, asigna cada uno a su mitad (PRE/1T/2T) con los tiempos del Excel corregido y arma la tabla de partidos."""
import os,re
import pandas as pd
from openpyxl import load_workbook
import config
from parse_lgm import load
def pt(t):
    t=str(t).strip().replace(',','.'); p=t.split(':')
    if len(p)==3: return round((int(p[0])*3600+int(p[1])*60+float(p[2]))*1000)
    return round((int(p[0])*60+float(p[1]))*1000)
ws=load_workbook(config.TIMES_XLSX)['Revisar tiempos']
X={}
for r in ws.iter_rows(min_row=2,values_only=True):
    if not r[0]: continue
    t1=pt(r[14]) if r[14] else pt(r[7]); t2=pt(r[15]) if r[15] else pt(r[9]); X[r[17]]=(t1,t2,r[16])
M=load()
CATMAP={'CONVERS.':'CONVERSION','EFECT. KICK':'EFECT.KICK','KILLER INSITNT':'KILLER INSTINCT','KILLER INSTINT':'KILLER INSTINCT','TRY  DESDE':'TRY DESDE',
        'CAMPO':'TERRITORIO','CANCHA':'TERRITORIO','GOAL KICK':'EFECT.KICK','AMARILLA':'T.AMARILLA','ROJA':'T.ROJA','L Y L':'L Y L','- 3 RUCK':'RUCK GANADO','3 A 5 RUCK':'RUCK GANADO','+ 5 RUCK':'RUCK GANADO','+ 5 MOTIV. RUCK':'RUCK GANADO'}
def norm(n):
    n=re.sub(r'\s*\d+\s*$','',n).strip(); side=''
    if re.search(r'\b(LOCAL|LOC)\b',n): side='LOCAL'
    if re.search(r'\b(VISITANTE|VISIT)\b',n): side='VISITANTE'
    c=re.sub(r'\b(LOCAL|LOC|VISITANTE|VISIT)\b\.?','',n); c=re.sub(r'\s+',' ',c).strip().upper()
    return CATMAP.get(c,c),side
VMAP={'GANA SUCIO':'GANA SUCIA','GANADO':'GANADA','PERDIDO':'PERDIDA','PIERDE':'PERDIDA','OFF SIDE':'OFFSIDE','INCODNUCTA/JS':'INCONDUCTA/JS','SCRUM (8)':'SCRUM','RUCKS':'RUCK','TRY ':'TRY'}
def normtag(cat,g,v):
    g=g.strip().upper(); v=v.strip().upper()
    g={'ORIGIEN':'ORIGEN','INICIO':'ORIGEN'}.get(g,g)
    if cat=='TRY DESDE': g='ORIGEN'
    if cat in('SCRUM','LINE OUT','SALIDAS'):
        v=VMAP.get(v,v)
        if cat=='SCRUM' and v=='GANA': v='GANADA'
    elif cat=='LANZAMIENTO': pass
    else: v=VMAP.get(v,v)
    return g,v
MM=[];rows=[]
for m in M:
    t1,t2,obs=X[m['file']]
    pid=f"{m['cal'].replace('-','')[2:]}_F{m['fn']}_{m['l']}_{m['v']}"
    mm=dict(archivo=m['file'],fecha=f"FECHA {m['fn']}",fecha_n=m['fn'],local=m['l'],visitante=m['v'],pl=m['pl'],pv=m['pv'],t1=t1,t2=t2,cal=m['cal'],pid=pid,incompleto=config.is_incomplete(pid,m['fn']),tablero='NUEVA' if m['dash'].startswith('2027') else 'REDUCIDA',obs=obs or '')
    MM.append(mm)
    for e in m['evs']:
        if e['tipo']=='Substitution': continue
        name=e['name']; cat,side=norm(e['tipo'] if e['tipo'] else name); s,en=e['start'],e['stop']
        if s<t1-100: half,rs='PRE',None
        elif s<t2-100: half,rs='1T',s-t1
        else: half,rs='2T',40*60000+(s-t2)
        tags=[normtag(cat,g,v) for g,v in e['tags']]
        rows.append(dict(partido=pid,fecha=mm['fecha'],fecha_n=m['fn'],local=m['l'],visitante=m['v'],categoria=cat,lado=side,
          equipo={'LOCAL':m['l'],'VISITANTE':m['v'],'':''}[side],evento=name,video_inicio_s=round(s/1000,2),video_fin_s=round(en/1000,2),
          mitad=half,min_real_inicio=(round(rs/60000,3) if rs is not None else None),min_real_fin=(round((rs+en-s)/60000,3) if rs is not None else None),
          dur_s=round((en-s)/1000,2),tramo='',tags='; '.join(f'{g}={v}' for g,v in tags),_tags=tags))
ev=pd.DataFrame(rows); ev.to_pickle(os.path.join(config.WORK,'ev.pkl')); pd.DataFrame(MM).to_pickle(os.path.join(config.WORK,'M.pkl'))
print(len(ev)); print(ev.categoria.value_counts().to_dict()); print(ev.mitad.value_counts().to_dict())
print(ev[ev.lado==''].categoria.unique())
