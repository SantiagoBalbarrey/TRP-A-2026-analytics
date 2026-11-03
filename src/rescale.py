"""Paso 4. Lleva cada tiempo a 40 minutos conservando intacta la pelota en juego (BIP): solo se comprime el fuera de juego."""
import os
import pandas as pd,numpy as np
import config
S=config.WORK
ev=pd.read_pickle(S+'/ev.pkl'); M=pd.read_pickle(S+'/M.pkl')
ev['min_sin_escalar_ini']=ev.min_real_inicio; ev['min_sin_escalar_fin']=ev.min_real_fin
ev['min_real_inicio']=np.nan; ev['min_real_fin']=np.nan; ev['factor_fuera_de_juego']=np.nan; ev['dur_real_s']=np.nan
def merge(iv):
    out=[]
    for a,b in sorted(iv):
        if out and a<=out[-1][1]+0.01: out[-1][1]=max(out[-1][1],b)
        else: out.append([a,b])
    return out
def build_warp(bip_iv,L,target,scale=True):
    segs=[(max(0,a),min(L,b)) for a,b in merge(bip_iv) if b>0 and a<L]
    B=sum(b-a for a,b in segs); g=(target-B)/(L-B) if scale and L>B else 1.0
    x=[0.0];y=[0.0];cur=0.0
    for a,b in segs:
        if a>cur: x.append(a);y.append(y[-1]+g*(a-cur))
        x.append(b);y.append(y[-1]+(b-a)); cur=b
    if L>cur: x.append(L);y.append(y[-1]+g*(L-cur))
    return (lambda t: np.interp(t,x,y)),g
info=[]
for _,m in M.iterrows():
    idx=ev.index[ev.partido==m.pid]; e=ev.loc[idx]; s=e.video_inicio_s.values; en=e.video_fin_s.values; cat=e.categoria.values
    inc=bool(m.incompleto)   # partido con video incompleto: el 2T no se reescala
    t1,t2=m.t1/1000,m.t2/1000
    h1=(s>=t1-0.1)&(s<t2-0.1); h2=s>=t2-0.1
    axS1,axE1=s-t1,en-t1; axS2,axE2=s-t2,en-t2
    L1=en[h1].max()-t1; L2=en[h2].max()-t2
    gs=[]
    for h,aS,aE,L,off,scale in ((h1,axS1,axE1,L1,0,True),(h2,axS2,axE2,L2,40*60,not inc)):
        bip=[(a,b) for a,b,c,k in zip(aS,aE,cat,h) if k and c=='BIP']
        w,g=build_warp(bip,L,40*60,scale); gs.append(g)
        k=np.where(h)[0]; ws=w(np.clip(aS[k],0,L)); we=w(np.clip(aE[k],0,L))
        ev.loc[idx[k],'min_real_inicio']=np.round((off+ws)/60,3); ev.loc[idx[k],'min_real_fin']=np.round((off+we)/60,3)
        ev.loc[idx[k],'dur_real_s']=np.round(we-ws,2); ev.loc[idx[k],'factor_fuera_de_juego']=round(g,3)
    info.append(dict(partido=m.pid,g1=round(gs[0],3),g2=round(gs[1],3)))
pd.DataFrame(info).to_pickle(S+'/escala.pkl')
ev.to_pickle(S+'/ev.pkl')
print(pd.DataFrame(info).describe().round(2).to_string())
print(ev.min_real_fin.max(), ev.min_real_inicio.isna().sum(), ev.dur_real_s.isna().sum())
x=ev[ev.categoria=='BIP'].dropna(subset=['dur_real_s']); print('BIP dur preservada:',(x.dur_real_s.sum()/x.dur_s.sum()).round(3))
y=ev[ev.categoria=='OUT'].dropna(subset=['dur_real_s']); print('OUT escalado:',(y.dur_real_s.sum()/y.dur_s.sum()).round(3))
