// Deterministic experimental geological field; independent of live world.
(function(root){
function generate({width=240,height=100,seed=42,surface=x=>20+8*Math.sin(x/30),regime='limestone',maturity=2,environment=()=>({recharge:1,vertical:1,solubility:1})}={}){
 const profiles={limestone:{bed:.45,fracture:.65,down:.48,erosion:1},sandstone:{bed:.85,fracture:.25,down:.18,erosion:.75},fractured:{bed:.18,fracture:.95,down:.72,erosion:.85}};const p=profiles[regime]||profiles.limestone;
 const n=width*height,resistance=new Float32Array(n),solid=new Uint8Array(n),weak=new Float32Array(n),flow=new Float32Array(n);
 const hash=(x,y)=>{let v=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return v-Math.floor(v)};
 const idx=(x,y)=>y*width+x;const env=Array.from({length:width},(_,x)=>environment(x));
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
 const i=idx(x,y);solid[i]=+(y>=surface(x));
 const bed=Math.abs(Math.sin((y+5*Math.sin(x/25))/6));
 const fracture=Math.min(Math.abs(Math.sin((x+y*.65+4*Math.sin(y/9))/13)),Math.abs(Math.sin((x-y*.38)/19)));
 const mass=.5+.25*Math.sin(x/19+Math.sin(y/17))+.25*Math.cos(y/23-x/31);
 resistance[i]=Math.max(0,Math.min(1,mass));
 weak[i]=.15+p.bed*Math.exp(-bed*8)+p.fracture*Math.exp(-fracture*12);
 }
 // Recharge traces compete for permeable routes; accumulated flow enlarges rock.
 for(let k=0;k<width*12;k++){
 let x=1+Math.floor(hash(k,1)*(width-2)),y=Math.max(0,Math.ceil(surface(x))),heading=hash(k,2)<.5?-1:1;
 if(y>=height-3||env[x].recharge<=0)continue;
 for(let t=0;t<height*2&&y<height-3&&x>1&&x<width-2;t++){
 flow[idx(x,y)]+=env[x].recharge;
 let best=null;
 for(const [dx,dy] of [[-1,0],[1,0],[-1,1],[0,1],[1,1]]){
 const a=x+dx,b=y+dy,i=idx(a,b);
 if(!solid[i])continue;
 const score=weak[i]*2+Math.log1p(flow[i])*.10+dy*p.down*env[x].vertical+dx*heading*.10+hash(k+t*7,a+b*width)*.55;
 if(!best||score>best.score)best={a,b,score};
 }
 if(!best)break;x=best.a;y=best.b;
 }
 }
 let peak=0;for(const v of flow)peak=Math.max(peak,v);
 for(let y=1;y<height-2;y++)for(let x=1;x<width-1;x++){
 const f=flow[idx(x,y)];if(f<Math.max(9,peak*.045))continue;
 const chamber=.55+.9*hash(Math.floor(x/24),Math.floor(y/18));
 const radius=Math.min(15,1+Math.floor(Math.sqrt(f)*.30*p.erosion*env[x].solubility*chamber*(.75+.25*maturity)));
 for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
 const a=x+dx,b=y+dy;if(a<1||a>=width-1||b<1||b>=height-2)continue;
 const j=idx(a,b),strength=resistance[j],pressure=Math.min(1,Math.log1p(f)/Math.log1p(peak));
 if(dx*dx+dy*dy<=radius*radius*(.65+.55*weak[j])*(1-.55*strength)&& (strength<.78||pressure*weak[j]>.48))solid[j]=0;
 }
 }
 // Secondary circulation: widen existing conduits where nearby permeable rock receives flow.
 for(let pass=1;pass<maturity;pass++){
 const remove=[];
 for(let y=2;y<height-3;y++)for(let x=2;x<width-2;x++){
 const i=idx(x,y);if(!solid[i]||y<surface(x)+2)continue;
 let wet=0,open=0;
 for(const j of [i-1,i+1,i-width,i+width])if(!solid[j]){open++;wet+=flow[j]}
 if(open&&resistance[i]<.72&&weak[i]>.42&&wet>peak*.018&&hash(x+pass*width,y)<Math.min(.85,weak[i]*.65))remove.push(i);
 }
 for(const i of remove){solid[i]=0;flow[i]=Math.max(flow[i],peak*.025)}
 }
 // Unsupported thin roof fragments fall into the first available space below.
 const debris=new Uint8Array(n);
 for(let pass=0;pass<3;pass++){
 const falling=[];
 for(let y=2;y<height-3;y++)for(let x=2;x<width-2;x++){
 const i=idx(x,y);
 if(!solid[i]||solid[i+width]||y<surface(x)+3)continue;
 if(solid[i-1]&&solid[i+1]||solid[i-width]&&solid[i-2*width])continue;
 if(hash(x+pass*width,y)>.55*(1-resistance[i]))continue;
 falling.push(i);
 }
 for(const i of falling){
 if(!solid[i]||solid[i+width])continue;
 let j=i+width;while(j+width<n&&!solid[j+width])j+=width;
 solid[i]=0;solid[j]=1;debris[j]=1;debris[i]=0;
 }
 }
 const seen=new Uint8Array(n),components=[];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
 const i=idx(x,y);if(seen[i]||solid[i]||y<surface(x))continue;
 const queue=[i];seen[i]=1;let openings=new Set(),minX=x,maxX=x,minY=y,maxY=y;
 for(let j=0;j<queue.length;j++){
 const a=queue[j]%width,b=Math.floor(queue[j]/width);minX=Math.min(minX,a);maxX=Math.max(maxX,a);minY=Math.min(minY,b);maxY=Math.max(maxY,b);
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
 const c=a+dx,d=b+dy;if(c<0||c>=width||d<0||d>=height)continue;
 if(d<surface(c)){openings.add(c);continue}
 const z=idx(c,d);if(!seen[z]&&!solid[z]){seen[z]=1;queue.push(z)}
 }
 }
 if(queue.length>=8)components.push({area:queue.length,minX,maxX,minY,maxY,openingColumns:[...openings].sort((a,b)=>a-b)});
 }
 const water=new Uint8Array(n),queue=[];
 // Flood only connected voids below a local hydraulic head; rock remains impermeable.
 for(let x=0;x<width;x++){const head=surface(x)+22+12*(1-Math.min(1,env[x].recharge));for(let y=Math.max(0,Math.ceil(head));y<height;y++){const i=idx(x,y);if(!solid[i]&&flow[i]>peak*.12&&env[x].recharge>.4){water[i]=1;queue.push(i);break}}}
 for(let k=0;k<queue.length;k++){const i=queue[k],x=i%width,y=Math.floor(i/width);for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]){const a=x+dx,b=y+dy;if(a<0||a>=width||b<0||b>=height||b<surface(a)+22+12*(1-Math.min(1,env[a].recharge)))continue;const j=idx(a,b);if(!solid[j]&&!water[j]){water[j]=1;queue.push(j)}}}
 return {width,height,solid,weak,flow,debris,resistance,water,components,regime};
}
// Extract all solid/void interfaces from the same field using marching squares.
function contours(field){
 const {width:w,height:h,solid}=field,segments=[];
 for(let y=0;y<h-1;y++)for(let x=0;x<w-1;x++){
 const i=y*w+x,v=[solid[i],solid[i+1],solid[i+w+1],solid[i+w]],p=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]];
 const alt=v[0]===v[2]&&v[1]===v[3]&&v[0]!==v[1]&&v[0]===1;
 for(const tri of alt?[[0,1,3],[1,2,3]]:[[0,1,2],[0,2,3]]){
 const hits=[];for(let j=0;j<3;j++){const a=tri[j],b=tri[(j+1)%3];if(v[a]!==v[b])hits.push([(p[a][0]+p[b][0])/2,(p[a][1]+p[b][1])/2]);}
 if(hits.length===2)segments.push(hits);
 }
 }
 return segments;
}
// Assemble boundary segments into continuous paths without inventing new geometry.
function boundaryPaths(field){
 const edges=contours(field),adj=new Map(),used=new Set(),paths=[];
 const key=p=>p.join(',');
 edges.forEach((e,i)=>e.forEach(p=>{const k=key(p);if(!adj.has(k))adj.set(k,[]);adj.get(k).push(i)}));
 function trace(i,start){const points=[start];let p=start;
 while(i!==undefined&&!used.has(i)){used.add(i);const e=edges[i];p=key(e[0])===key(p)?e[1]:e[0];points.push(p);i=adj.get(key(p)).find(j=>!used.has(j));}
 return {points,closed:key(points[0])===key(points.at(-1))};}
 for(const [k,ids] of adj)if(ids.length===1&&!used.has(ids[0]))paths.push(trace(ids[0],k.split(',').map(Number)));
 edges.forEach((e,i)=>{if(!used.has(i))paths.push(trace(i,e[0]))});
 return paths;
}
function physicalField(field){
 const paths=boundaryPaths(field);
 // Piecewise-linear occupancy on triangles matching marching-squares interfaces.
 const sample=(x,y)=>{if(y<0)return 0;if(x<0||x>=field.width||y>=field.height)return 1;return field.solid[y*field.width+x]};
 const isSolid=(x,y)=>{
 const a=Math.floor(x),b=Math.floor(y),u=x-a,v=y-b;
 const A=sample(a,b),B=sample(a+1,b),C=sample(a+1,b+1),D=sample(a,b+1);
 // Ambiguous squares keep diagonally touching solid cells disconnected.
 const alternate=A===C&&B===D&&A!==B?A===1:false;
 let value;
 if(alternate)value=u+v<=1?A+(B-A)*u+(D-A)*v:C+(D-C)*(1-u)+(B-C)*(1-v);
 else value=u>=v?A+(B-A)*u+(C-B)*v:A+(C-D)*u+(D-A)*v;
 return value>=.5;
 };
 const column=x=>{const a=Math.round(x),out=[];if(a<0||a>=field.width)return out;let start=null;
 for(let y=0;y<=field.height;y++){if(y<field.height&&!isSolid(a,y)){if(start===null)start=y-.5;}else if(start!==null){out.push({top:start,bottom:y-.5});start=null;}}return out;};
 return {paths,isSolid,column};
}
function waterSimulation(field){
 const {width:w,height:h,solid}=field,n=w*h,amount=Float32Array.from(field.water),current=new Float32Array(n);
 function step(){
 current.fill(0);
 for(let y=h-2;y>=0;y--)for(let x=0;x<w;x++){const i=y*w+x,j=i+w;if(solid[i]||solid[j])continue;const q=Math.min(amount[i],1-amount[j],.35);if(q>0){amount[i]-=q;amount[j]+=q}}
 for(let y=0;y<h;y++)for(let x=0;x<w-1;x++){const i=y*w+x,j=i+1;if(solid[i]||solid[j])continue;const q=(amount[i]-amount[j])*.18;amount[i]-=q;amount[j]+=q;current[i]+=q;current[j]+=q}
 }
 return {amount,current,step};
}
root.ArcheGeology={generate,contours,boundaryPaths,physicalField,waterSimulation};
})(typeof globalThis!=='undefined'?globalThis:this);
