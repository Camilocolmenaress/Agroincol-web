import json,sys,statistics as st
f=sys.argv[1]; d=json.load(open(f)); 
if isinstance(d,dict): d=d.get('s',d)
rows=d
def off(rows):
  out=[];acc=0
  for i in range(1,len(rows)):
    a=rows[i-1]['items'];b=rows[i]['items']
    dx=[b[k]['tx']-a[k]['tx'] for k in range(len(a)) if abs(b[k]['tx']-a[k]['tx'])<400]
    v=st.median(dx) if dx else 0; acc+=v; out.append((rows[i]['t'],round(acc,1),round(v,2)))
  return out
o=off(rows)
moving=[x for x in o if abs(x[2])>0.05]
print(f.split('/')[-1],'frames',len(rows),'dur',rows[-1]['t'],'total dx',o[-1][1] if o else 0)
if moving: print(' first move t',moving[0][0],'last move t',moving[-1][0],'peak v px/frame',max(abs(x[2]) for x in o))
step=max(1,len(o)//25)
print(' ',[(x[0],x[1]) for x in o[::step]])
# other props
for k in ['marquee','shape','shapeImg','badge','badgeArt','prompt']:
  vals=[(r['t'],r[k]) for r in rows if r.get(k)]
  if not vals: continue
  ks=['tx','ty','s','rot','op']
  rng={kk:(min(v[kk] for _,v in vals),max(v[kk] for _,v in vals)) for kk in ks}
  print(' ',k,{kk:rng[kk] for kk in ks if rng[kk][0]!=rng[kk][1]})
# item scale/rot at center at end
last=rows[-1]['items']
print(' end items',[(it['cx'],it['cy'],it['s'],it['rot'],it['op']) for it in sorted(last,key=lambda z:z['cx']) if -200<it['cx']<1640])
