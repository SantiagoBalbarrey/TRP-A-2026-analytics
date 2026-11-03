"""Paso 6. Exporta los 4 CSV finales a data/<temporada>/."""
import pandas as pd,re,unicodedata,os
import config
S=config.WORK
O=config.OUT
ev=pd.read_pickle(S+'/ev.pkl'); pm=pd.read_pickle(S+'/pm.pkl'); st=pd.read_pickle(S+'/st.pkl'); M=pd.read_pickle(S+'/M.pkl'); esc=pd.read_pickle(S+'/escala.pkl')
def snake(c):
    c=unicodedata.normalize('NFKD',str(c)).encode('ascii','ignore').decode().lower()
    c=re.sub(r'[^a-z0-9]+','_',c).strip('_'); return c
# 1. eventos
groups=['RESULTADO','ORIGEN','SIGUE','FINALIZA','MOTIVO','STATUS','TARJETA']
for g in groups: ev[g.lower()]=ev['_tags'].apply(lambda t: next((v for gg,v in t if gg==g),None))
ev['fecha_calendario']=ev.partido.str[:6].map(lambda c:f"20{c[:2]}-{c[2:4]}-{c[4:]}")
e=ev.rename(columns={'partido':'partido_id','fecha':'fecha_torneo','fecha_n':'fecha_numero','video_inicio_s':'video_inicio_s','dur_s':'dur_video_s'})
e['minuto_partido']=e.min_real_inicio.apply(lambda v:int(v) if pd.notna(v) else None).astype('Int64')
e['reloj_partido']=e.min_real_inicio.apply(lambda v:(f"{int(v)}:{min(59,int(round((v-int(v))*60))):02d}") if pd.notna(v) else None)
e['evento_id']=range(1,len(e)+1)
cols=['evento_id','partido_id','fecha_torneo','fecha_numero','fecha_calendario','local','visitante','categoria','lado','equipo','evento','mitad','minuto_partido','reloj_partido','min_real_inicio','min_real_fin','dur_real_s','dur_video_s','video_inicio_s','video_fin_s','factor_fuera_de_juego','tramo']+[g.lower() for g in groups]
e[cols].to_csv(O+'/eventos.csv',index=False,encoding='utf-8'); print('eventos',len(e))
# 2. partidos
tr=pm.pivot_table(index='partido',columns='condicion',values='tries',aggfunc='sum')
p=M.copy(); p['fecha_calendario']=p.cal; p=p.rename(columns={'pid':'partido_id','fecha':'fecha_torneo','pl':'pts_local','pv':'pts_visitante'})
p['tries_local']=p.partido_id.map(tr['LOCAL']); p['tries_visitante']=p.partido_id.map(tr['VISITANTE'])
p['inicio_1t_video_s']=(p.t1/1000).round(2); p['inicio_2t_video_s']=(p.t2/1000).round(2)
p=p.merge(esc.rename(columns={'partido':'partido_id','g1':'factor_fuera_de_juego_1t','g2':'factor_fuera_de_juego_2t'}),on='partido_id')
p['incompleto']=p.incompleto.apply(lambda s: 'SI' if s else 'NO')
p[['partido_id','fecha_torneo','fecha_n','fecha_calendario','local','visitante','pts_local','pts_visitante','tries_local','tries_visitante','incompleto','inicio_1t_video_s','inicio_2t_video_s','factor_fuera_de_juego_1t','factor_fuera_de_juego_2t']].rename(columns={'fecha_n':'fecha_numero'}).sort_values(['fecha_numero','fecha_calendario']).to_csv(O+'/partidos.csv',index=False); print('partidos',len(p))
# 3. stats equipo-partido
tagcols=[c for c in pm.columns if '|' in c]
s=pm.rename(columns={c:c.replace('|','_') for c in tagcols}).drop(columns=['incompleto'])
s.columns=[snake(c) for c in s.columns]
s=s.rename(columns={'partido':'partido_id','fecha':'fecha_torneo','fecha_n':'fecha_numero','pf':'puntos_favor','pc':'puntos_contra','territorio_seg':'seg_en_campo_propio','territorio_pct':'pct_tiempo_en_campo_propio'})
assert s.columns.is_unique; s.to_csv(O+'/stats_equipo_partido.csv',index=False); print('stats',s.shape)
# 4. tabla posiciones
off=config.OFFICIAL_POINTS
t=st.rename(columns={'Pos':'posicion','equipo':'equipo','Pts':'puntos_calculados','PJ':'pj','G':'pg','E':'pe','P':'pp','PF':'pf','PC':'pc','DIF':'dif'})
t['puntos_oficiales']=t.equipo.map(off)
t[['posicion','equipo','pj','pg','pe','pp','pf','pc','dif','tries','bonus_tries','bonus_derrota','puntos_calculados','puntos_oficiales']].to_csv(O+'/tabla_posiciones.csv',index=False)
for f in os.listdir(O): print(f, os.path.getsize(O+'/'+f)//1024,'KB')
