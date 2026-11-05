"""Paso 5. Estadísticas por equipo y partido, y tabla de posiciones según reglamento (4/2/0, bonus por 3+ tries de diferencia y por derrota de 7 o menos)."""
import collections
import pandas as pd
import config
S=config.WORK
ev=pd.read_pickle(S+'/ev.pkl'); M=pd.DataFrame(pd.read_pickle(S+'/M.pkl'))
# score check from events
bad=[]
for _,m in M.iterrows():
    out=[]
    for side,sc in (('LOCAL',m.pl),('VISITANTE',m.pv)):
        x=ev[(ev.partido==m.pid)&(ev.lado==side)].categoria.value_counts()
        out.append((sc,5*x.get('TRY',0)+7*x.get('TRY PENAL',0)+2*x.get('CONVERSION',0)+3*x.get('PENALTY KICK',0)))
    if any(a!=b for a,b in out): bad.append((m.pid,out))
print('score mismatches vs events:',bad)
# per match-team wide stats
ev['n']=1
base=ev[ev.lado!=''].copy()
cnt=base.pivot_table(index=['partido','lado'],columns='categoria',values='n',aggfunc='sum',fill_value=0)
dur=base.pivot_table(index=['partido','lado'],columns='categoria',values='dur_real_s',aggfunc='sum',fill_value=0)
# tag counts
trows=[]
for p_,l_,c_,tags_ in zip(base.partido,base.lado,base.categoria,base['_tags']):
    for g,v in tags_:
        trows.append((p_,l_,f"{c_}|{g}|{v}"))
tg=pd.DataFrame(trows,columns=['partido','lado','k']); tg['n']=1
tgp=tg.pivot_table(index=['partido','lado'],columns='k',values='n',aggfunc='sum',fill_value=0)
nolado=ev[ev.lado==''].pivot_table(index='partido',columns='categoria',values='dur_real_s',aggfunc='sum',fill_value=0)
nolado_n=ev[ev.lado==''].pivot_table(index='partido',columns='categoria',values='n',aggfunc='sum',fill_value=0)
rows=[]
for _,m in M.iterrows():
    for lado,eq,riv,pf,pc in (('LOCAL',m.local,m.visitante,m.pl,m.pv),('VISITANTE',m.visitante,m.local,m.pv,m.pl)):
        k=(m.pid,lado); ok=(m.pid,'VISITANTE' if lado=='LOCAL' else 'LOCAL')
        g=lambda df,c,key=k: float(df.loc[key][c]) if key in df.index and c in df.columns else 0.0
        r=dict(partido=m.pid,fecha=m.fecha,fecha_n=m.fecha_n,fecha_cal=m.cal,equipo=eq,rival=riv,condicion=lado,PF=pf,PC=pc,
               tries=int(g(cnt,'TRY')+g(cnt,'TRY PENAL')),tries_penal=int(g(cnt,'TRY PENAL')),conversiones=int(g(cnt,'CONVERSION')),penales_pateados=int(g(cnt,'PENALTY KICK')),
               posesion_seg=round(g(dur,'POSESION'),1),posesion_pct=None,territorio_seg=round(g(dur,'TERRITORIO'),1),territorio_pct=None,
               incompleto=m.incompleto)
        po,pr=g(dur,'POSESION'),g(dur,'POSESION',ok); r['posesion_pct']=round(100*po/(po+pr),1) if po+pr else None
        to,tr=g(dur,'TERRITORIO'),g(dur,'TERRITORIO',ok); r['territorio_pct']=round(100*to/(to+tr),1) if to+tr else None
        bip=float(nolado.loc[m.pid].get('BIP',0)) if m.pid in nolado.index else 0; out=float(nolado.loc[m.pid].get('OUT',0)) if m.pid in nolado.index else 0
        out=max(0,(80*60 if not m.incompleto else float(ev[(ev.partido==m.pid)].min_real_fin.max())*60)-bip)
        r.update(bip_min=round(bip/60,2),out_min=round(out/60,2),bip_pct_tiempo_total=round(100*bip/(bip+out),1) if bip+out else None,
                 bip_cantidad=int(nolado_n.loc[m.pid].get('BIP',0)) if m.pid in nolado_n.index else 0)
        for c in ['KICK','TURNOVERS','T.AMARILLA','T.ROJA','RUCK GANADO','RUCK PERDIDO','SCRUM','LINE OUT','SALIDAS','PENAL CONCEDIDO','BREAK LINE','KILLER INSTINCT','EFECT.KICK','GOAL KICK','TRY DESDE','LANZAMIENTO']:
            r[c]=int(g(cnt,c))
        tot=r['RUCK GANADO']+r['RUCK PERDIDO']; r['ruck_ganado_pct']=round(100*r['RUCK GANADO']/tot,1) if tot else None
        for col in tgp.columns:
            r[col]=int(g(tgp,col))
        rows.append(r)
pm=pd.DataFrame(rows)

# ---- Recepción de la salida (kick-off / reinicio) ----
# Los eventos SALIDAS están cargados al equipo que PATEA. Quien recibe es el rival, y su resultado es el inverso:
#   patea y la PIERDE        -> el rival recibe y la ASEGURA
#   patea y GANA SUCIA       -> el rival no la asegura: el rival la recupera sucia
#   patea y la GANA          -> el rival no la asegura: el rival la recupera
# "Tras anotar": la salida que sigue a un score (try o penal) del rival del que patea; recibe quien anotó.
SCORES=('TRY','TRY PENAL','PENALTY KICK')
REC={'PERDIDA':'asegurada','GANA SUCIA':'rival_recupera_sucia','GANADA':'rival_recupera'}
def _resultado(tags):
    return next((v for g,v in tags if g=='RESULTADO'),None)
rec={}
for pid,g in ev[ev.categoria.isin(('SALIDAS',)+SCORES)&ev.mitad.isin(['1T','2T'])].groupby('partido'):
    last=None; half=None
    for _,r in g.sort_values(['min_real_inicio','video_inicio_s']).iterrows():
        if r.mitad!=half: half=r.mitad; last=None
        if r.categoria in SCORES: last=r.lado; continue
        kind=REC.get(_resultado(r._tags))
        if kind:
            receptor='VISITANTE' if r.lado=='LOCAL' else 'LOCAL'
            rec.setdefault((pid,receptor),collections.Counter())
            rec[(pid,receptor)][('recepcion_salida',kind)]+=1
            if last is not None and last!=r.lado:      # la salida sigue a un score del equipo que ahora recibe
                rec[(pid,receptor)][('recepcion_tras_score',kind)]+=1
        last=None
for pref in ('recepcion_salida','recepcion_tras_score'):
    for kind in REC.values():
        pm[f'{pref}_{kind}']=[rec.get((p,c),collections.Counter())[(pref,kind)] for p,c in zip(pm.partido,pm.condicion)]
    pm[f'{pref}_total']=pm[[f'{pref}_{k}' for k in REC.values()]].sum(axis=1)
# standings, reglamento URMDP Art.145
def pts(r):
    o=pm[(pm.partido==r.partido)&(pm.equipo!=r.equipo)].iloc[0]; d=r.PF-r.PC
    res='G' if d>0 else ('E' if d==0 else 'P'); base={'G':4,'E':2,'P':0}[res]
    bt=1 if (res=='G' and r.tries-o.tries>=3) else 0; bd=1 if (res=='P' and -d<=7) else 0
    return pd.Series(dict(resultado=res,pts_base=base,bonus_tries=bt,bonus_derrota=bd,pts_tabla=base+bt+bd))
pm=pd.concat([pm,pm.apply(pts,axis=1)],axis=1)
st=pm.groupby('equipo').agg(PJ=('partido','count'),G=('resultado',lambda s:(s=='G').sum()),E=('resultado',lambda s:(s=='E').sum()),P=('resultado',lambda s:(s=='P').sum()),
   PF=('PF','sum'),PC=('PC','sum'),tries=('tries','sum'),bonus_tries=('bonus_tries','sum'),bonus_derrota=('bonus_derrota','sum'),Pts=('pts_tabla','sum'))
st['DIF']=st.PF-st.PC; st['_ord']=st.index.map(lambda k: config.OFFICIAL_POINTS.get(k, 0)) if config.OFFICIAL_POINTS else st.Pts   # orden según la tabla oficial (desempate: más tries, Art. 147)
st=st.sort_values(['_ord','tries'],ascending=False).drop(columns='_ord').reset_index(); st.insert(0,'Pos',range(1,9))
print(st.to_string())
pm.to_pickle(S+'/pm.pkl'); st.to_pickle(S+'/st.pkl')
print(pm.shape)
