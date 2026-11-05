"""Paso 7. Arma data.json a partir de los CSV y genera la página (docs/index.html) uniendo plantillas, datos y escudos."""
import json,os
import numpy as np,pandas as pd
import config
def build_season(season):
    cfg=json.load(open(os.path.join(config.ROOT,'config',f'{season}.json'),encoding='utf-8'))
    C=os.path.join(config.ROOT,'data',season)+'/'
    ev=pd.read_csv(C+'eventos.csv',low_memory=False); pa=pd.read_csv(C+'partidos.csv'); st=pd.read_csv(C+'stats_equipo_partido.csv'); tb=pd.read_csv(C+'tabla_posiciones.csv')
    TM=cfg['teams']
    teams=[dict(k=k,name=v['name'],short=v['short'],code=v['code']) for k,v in TM.items()]
    # stats rows
    drop=['fecha_torneo','fecha_cal','seg_en_campo_propio','posesion_seg','pts_base','goal_kick']
    s=st.drop(columns=[c for c in drop if c in st.columns]).copy()
    s=s.where(pd.notnull(s),None)
    srows=json.loads(s.to_json(orient='records'))
    # matches
    PTS={'TRY':5,'TRY PENAL':7,'CONVERSION':2,'PENALTY KICK':3}
    CODE={'TRY':'T','TRY PENAL':'P','CONVERSION':'C','PENALTY KICK':'K','T.AMARILLA':'Y','T.ROJA':'R'}
    M=[]
    for _,p in pa.iterrows():
        e=ev[(ev.partido_id==p.partido_id)&ev.min_real_inicio.notna()]
        tl=[]
        for _,r in e[e.categoria.isin(CODE)].sort_values('min_real_inicio').iterrows():
            tl.append([round(r.min_real_inicio,1),0 if r.lado=='LOCAL' else 1,CODE[r.categoria]])
        def blk(cat,lado):
            a=np.zeros(16)
            x=e[(e.categoria==cat)&((e.lado==lado) if lado else True)]
            for _,r in x.iterrows():
                s0,f0=r.min_real_inicio,r.min_real_fin
                if pd.isna(f0) or f0<=s0: continue
                for b in range(16):
                    lo,hi=b*5,(b+1)*5
                    o=max(0,min(hi,f0)-max(lo,s0))
                    a[b]+=o*60
            return [round(v,1) for v in a]
        M.append(dict(id=p.partido_id,f=int(p.fecha_numero),d=p.fecha_calendario,l=p.local,v=p.visitante,pl=int(p.pts_local),pv=int(p.pts_visitante),
            tl=int(p.tries_local),tv=int(p.tries_visitante),inc=p.incompleto=='SI',ev=tl,
            pos=[blk('POSESION','LOCAL'),blk('POSESION','VISITANTE')],ter=[blk('TERRITORIO','VISITANTE'),blk('TERRITORIO','LOCAL')],bip=blk('BIP',None)))
        # marcador por eventos
        sc=[0,0]
        for m,sd,c in tl:
            sc[sd]+={'T':5,'P':7,'C':2,'K':3}.get(c,0)
        M[-1]['evsc']=sc
    tab=json.loads(tb.to_json(orient='records'))
    data=dict(season=season,teams=teams,s=srows,m=M,tab=tab)
    print(season,len(srows),'filas de stats,',len(M),'partidos; marcador por eventos distinto al oficial en:',[m['id'] for m in M if m['evsc']!=[m['pl'],m['pv']]])


    return data
SEASONS=sorted(f[:-5] for f in os.listdir(os.path.join(config.ROOT,'config')) if f.endswith('.json') and os.path.isdir(os.path.join(config.ROOT,'data',f[:-5])))
DS={y:build_season(y) for y in SEASONS}
DEFAULT=SEASONS[-1]

# ---- página
T=os.path.join(config.ROOT,'site','templates')
head=open(T+'/tpl_head.html',encoding='utf-8').read().replace('@@SEASON@@',DEFAULT); body=open(T+'/tpl_body.html',encoding='utf-8').read().replace('@@SEASON@@',DEFAULT); js=open(T+'/tpl_js.js',encoding='utf-8').read()
js=js.replace('//@@I18N@@',open(T+'/tpl_i18n.js',encoding='utf-8').read())   # textos en inglés (botón ES/EN)
crests=open(os.path.join(config.ROOT,'site','crests.json'),encoding='utf-8').read().strip()
d=json.dumps(DS,separators=(',',':'),ensure_ascii=False).replace('</','<\\/')
page=('<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      +head+'</head><body>'+body+'\n<script>window.__DS='+d+';window.__C='+crests+';</script>\n<script>\n'+js+'\n</script></body></html>')
os.makedirs(config.DOCS,exist_ok=True)
open(os.path.join(config.DOCS,'index.html'),'w',encoding='utf-8').write(page)
print(os.path.join(config.DOCS,'index.html'),len(page)//1024,'KB')
