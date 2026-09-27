#!/usr/bin/env python3
"""Real Adelie video -> tracked silhouettes -> compact sprite candidates."""
import argparse, json, math
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parent

def rgba(im): return Image.fromarray(cv2.cvtColor(im,cv2.COLOR_BGRA2RGBA))
def save_grid(images, path, labels=None, cell=(144,160)):
    w,h=cell; out=Image.new('RGBA',(w*len(images),h),(241,245,246,255));d=ImageDraw.Draw(out)
    for i,img in enumerate(images):
        thumb=img.copy();thumb.thumbnail((w-16,h-28),Image.Resampling.NEAREST)
        out.alpha_composite(thumb,(i*w+(w-thumb.width)//2,8))
        if labels:d.text((i*w+8,h-18),labels[i],fill=(38,54,62))
    out.save(path)

def segment(frame, rect):
    x,y,w,h=rect; crop=frame[y:y+h,x:x+w]; mask=np.zeros(crop.shape[:2],np.uint8)
    bg=np.zeros((1,65),np.float64);fg=bg.copy()
    cv2.grabCut(crop,mask,(8,8,w-16,h-16),bg,fg,3,cv2.GC_INIT_WITH_RECT)
    m=np.where((mask==2)|(mask==0),0,255).astype('uint8')
    # Keep the connected foreground component nearest the expected subject center.
    n,lab,stats,cent=cv2.connectedComponentsWithStats(m)
    if n<2: raise RuntimeError('No foreground found; adjust --rect to cover the penguin.')
    candidates=[i for i in range(1,n) if stats[i,4]>60]
    if not candidates: raise RuntimeError('Foreground too small; adjust --rect.')
    pick=max(candidates,key=lambda i:stats[i,4]-3*np.linalg.norm(cent[i]-np.array([w*.5,h*.55])))
    m=np.where(lab==pick,255,0).astype('uint8')
    m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    return crop,m

def features(mask):
    ys,xs=np.nonzero(mask);cx=float(xs.mean());cy=float(ys.mean())
    upper=ys<np.quantile(ys,.35); lower=ys>np.quantile(ys,.78)
    ux=float(xs[upper].mean());uy=float(ys[upper].mean());lx=float(xs[lower].mean());ly=float(ys[lower].mean())
    angle=math.degrees(math.atan2(ux-lx,ly-uy))
    return {'cx':round(cx,2),'cy':round(cy,2),'axis_deg':round(angle,2),
            'head_x':round(ux,2),'head_y':round(uy,2),
            'lower_x':round(lx,2),'lower_y':round(ly,2),
            'wing_extent':round(float(np.quantile(xs[(ys>np.quantile(ys,.25))&(ys<np.quantile(ys,.68))],.95)-cx),2),
            'area':int(len(xs))}

def pose_vector(mask, feat):
    # Centroid-normalized silhouette retains shape but removes camera translation.
    m=cv2.resize(mask,(32,32),interpolation=cv2.INTER_AREA).astype('float32')/255
    return np.r_[m.flatten(),[feat['axis_deg']/30,feat['wing_extent']/50,feat['cy']/150]]

def choose_cycle(vectors, fps):
    a=np.asarray(vectors);best=(float('inf'),0,0)
    # Search for a repeating candidate window; it may represent only a half step.
    for lag in range(max(4,int(.35*fps)),min(len(a)//2,int(1.25*fps))+1):
        distances=np.linalg.norm(a[:-lag]-a[lag:],axis=1)
        k=int(np.argmin(np.convolve(distances,np.ones(min(5,len(distances)))/min(5,len(distances)),mode='valid')))
        score=float(np.mean(distances[k:k+5]))
        if score<best[0]:best=(score,k,lag)
    if best[2]==0:raise RuntimeError('Clip too short for a gait cycle.')
    return best[1],best[2],best[0]

def pixel_sprite(crop,mask,size):
    # Foreground colors are deterministic classifications of the actual frame.
    # RGB is sampled only to classify white belly vs dark plumage, not to paint details.
    gray=cv2.cvtColor(crop,cv2.COLOR_BGR2GRAY)
    yy,xx=np.indices(mask.shape);ys,xs=np.nonzero(mask)
    x0,x1=xs.min(),xs.max();y0,y1=ys.min(),ys.max()
    pad=5; x0=max(0,x0-pad);x1=min(mask.shape[1],x1+pad);y0=max(0,y0-pad);y1=min(mask.shape[0],y1+pad)
    m=mask[y0:y1+1,x0:x1+1];g=gray[y0:y1+1,x0:x1+1]
    cw,ch=size; scale=min((cw-2)/m.shape[1],(ch-2)/m.shape[0]);nw=max(1,round(m.shape[1]*scale));nh=max(1,round(m.shape[0]*scale))
    cov=cv2.resize(m,(nw,nh),interpolation=cv2.INTER_AREA)
    white=cv2.resize(np.where(m>0,np.where(g>145,255,0),0).astype('uint8'),(nw,nh),interpolation=cv2.INTER_AREA)
    alpha=(cov>95);belly=(white>120)&alpha
    arr=np.zeros((ch,cw,4),np.uint8); ox=(cw-nw)//2;oy=(ch-nh)//2
    sub=arr[oy:oy+nh,ox:ox+nw];sub[alpha]=[25,35,43,255];sub[belly]=[235,237,223,255]
    # Tiny eye ring is located from the real silhouette's upper-front contour.
    if nw>=20:
        head_y=oy+max(1,round(nh*.18)); head_x=ox+max(1,round(nw*.29))
        for dx,dy in [(0,0),(1,0),(0,1)]:
            x,y=head_x+dx,head_y+dy
            if 0<=x<cw and 0<=y<ch and arr[y,x,3]:arr[y,x]=[239,241,226,255]
    return Image.fromarray(arr,'RGBA')

def main():
    p=argparse.ArgumentParser();p.add_argument('--input',default=str(ROOT/'data/adelie_source.webm'))
    p.add_argument('--output',default=str(ROOT/'assets'));p.add_argument('--start',type=float,default=2.4)
    p.add_argument('--end',type=float,default=6.0);p.add_argument('--rect',type=int,nargs=4,default=[245,125,155,220],metavar=('X','Y','W','H'))
    p.add_argument('--analysis-width',type=int,default=640);args=p.parse_args()
    out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
    cap=cv2.VideoCapture(args.input)
    if not cap.isOpened():raise SystemExit(f'Cannot open {args.input}')
    native_fps=cap.get(cv2.CAP_PROP_FPS);src_w=int(cap.get(cv2.CAP_PROP_FRAME_WIDTH));src_h=int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    scale=args.analysis_width/src_w;new_h=round(src_h*scale)
    frames=[]; masks=[]; crops=[]; feats=[]; times=[]
    for idx in range(math.floor(args.start*native_fps),math.ceil(args.end*native_fps)):
        cap.set(cv2.CAP_PROP_POS_FRAMES,idx);ok,frame=cap.read()
        if not ok:break
        frame=cv2.resize(frame,(args.analysis_width,new_h),interpolation=cv2.INTER_AREA)
        crop,m=segment(frame,args.rect);f=features(m)
        frames.append(frame);crops.append(crop);masks.append(m);feats.append(f);times.append(idx/native_fps)
    if len(frames)<20:raise SystemExit('Need at least 20 analyzed frames.')
    vectors=[pose_vector(m,f) for m,f in zip(masks,feats)]
    start,period,score=choose_cycle(vectors,native_fps)
    # Choose closest actual frames to each uniform phase, including both extremes.
    manifest={'source':Path(args.input).name,'fps':native_fps,'analysis_size':[args.analysis_width,new_h],
              'crop_rect':args.rect,'clip_seconds':[args.start,args.end],
              'cycle':{'start_seconds':round(times[start],3),'duration_seconds':round(period/native_fps,3),'similarity_error':round(score,4),'status':'candidate; requires manual confirmation of full gait'},
              'frames':[],'sets':{}}
    for i,(f,t) in enumerate(zip(feats,times)):
        manifest['frames'].append({'time':round(t,3),**f})
    sizes={'64':[64,64],'32':[32,32],'24':[24,24]}
    for count in [4,6,8]:
        ids=[start+round(j*period/count) for j in range(count)]
        manifest['sets'][str(count)]={'times':[round(times[i],3) for i in ids],'indices':ids,'sprites':{}}
        for label,size in sizes.items():
            sprites=[]
            folder=out/f'{count}f_{label}';folder.mkdir(exist_ok=True)
            for j,i in enumerate(ids):
                spr=pixel_sprite(crops[i],masks[i],size);spr.save(folder/f'{j:02d}.png');sprites.append(spr)
            sheet=Image.new('RGBA',(size[0]*count,size[1]),(0,0,0,0))
            for j,im in enumerate(sprites):sheet.alpha_composite(im,(j*size[0],0))
            sheet.save(out/f'sheet_{count}f_{label}.png')
            manifest['sets'][str(count)]['sprites'][label]=[f'assets/{count}f_{label}/{j:02d}.png' for j in range(count)]
    ids=manifest['sets']['6']['indices']
    raw=[];sil=[]
    (out/'key_crops').mkdir(exist_ok=True);(out/'key_silhouettes').mkdir(exist_ok=True)
    for i in ids:
        c=crops[i];m=masks[i];bgra=cv2.cvtColor(c,cv2.COLOR_BGR2BGRA);bgra[:,:,3]=m
        raw_im=rgba(bgra);sil_im=Image.fromarray(np.dstack([np.full_like(m,26),np.full_like(m,39),np.full_like(m,46),m]),'RGBA')
        raw.append(raw_im);sil.append(sil_im);raw_im.save(out/'key_crops'/f'{len(raw)-1:02d}.png');sil_im.save(out/'key_silhouettes'/f'{len(sil)-1:02d}.png')
    save_grid(raw,out/'key_crops.png',[f'{times[i]:.2f}s' for i in ids]);save_grid(sil,out/'key_silhouettes.png',[f'pose {j+1}' for j in range(6)])
    cv2.imwrite(str(out/'reference_frame.jpg'),frames[ids[0]])
    (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    (out/'manifest.js').write_text('window.PENGUIN_DATA = '+json.dumps(manifest,ensure_ascii=False)+';')
    print(f'{len(frames)} analyzed frames, candidate repeat {period} frames ({period/native_fps:.2f}s), starts {times[start]:.2f}s; verify full gait manually')

if __name__=='__main__':main()
