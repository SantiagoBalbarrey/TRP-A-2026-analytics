"""Alternativa a los pasos 3-4 (build_events + rescale) para temporadas cuyos .lgm no se vuelven a procesar.
Lee data/<temporada>/eventos.csv y partidos.csv (ya con la mitad asignada y el reescalado a 40+40 min)
y arma los mismos archivos intermedios (ev.pkl, M.pkl, escala.pkl) que el resto del pipeline espera."""
import os
import pandas as pd
import config
D=config.OUT
e=pd.read_csv(D+'/eventos.csv',low_memory=False).sort_values('evento_id'); p=pd.read_csv(D+'/partidos.csv')
GROUPS=['resultado','origen','sigue','finaliza','motivo','status','tarjeta']
def tags(r): return [(g.upper(),str(r[g])) for g in GROUPS if pd.notna(r[g])]
e['_tags']=e.apply(tags,axis=1)
e['tags']=e._tags.apply(lambda t:'; '.join(f'{g}={v}' for g,v in t))
e['categoria']=e.categoria.replace({'GOAL KICK':'EFECT.KICK'})      # igual que en 2026: GOAL KICK = EFECT.KICK
for c in ('lado','equipo'): e[c]=e[c].fillna('')
ev=e.rename(columns={'partido_id':'partido','fecha_torneo':'fecha','fecha_numero':'fecha_n','dur_video_s':'dur_s'})
ev['tramo']=ev.tramo.fillna('')
ev=ev.drop(columns=[c for c in GROUPS+['evento_id','minuto_partido','reloj_partido','fecha_calendario']])
M=pd.DataFrame(dict(pid=p.partido_id,fecha=p.fecha_torneo,fecha_n=p.fecha_numero,cal=p.fecha_calendario,local=p.local,visitante=p.visitante,
    pl=p.pts_local,pv=p.pts_visitante,t1=(p.inicio_1t_video_s*1000).round(),t2=(p.inicio_2t_video_s*1000).round(),
    incompleto=[config.is_incomplete(a,b) for a,b in zip(p.partido_id,p.fecha_numero)]))
esc=pd.DataFrame(dict(partido=p.partido_id,g1=p.factor_fuera_de_juego_1t,g2=p.factor_fuera_de_juego_2t))
ev.to_pickle(config.WORK+'/ev.pkl'); M.to_pickle(config.WORK+'/M.pkl'); esc.to_pickle(config.WORK+'/escala.pkl')
print(len(ev),'eventos,',len(M),'partidos'); print(ev.categoria.value_counts().to_dict())
