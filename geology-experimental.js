// Deterministic experimental geological field; independent of live world.
(function(root){
function generate({width=240,height=100,seed=42,surface=x=>20+8*Math.sin(x/30)}={}){
 const n=width*height,solid=new Uint8Array(n),weak=new Float32Array(n),flow=new Float32Array(n);
 const hash=(x,y)=>{let v=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return v-Math.floor(v)};
 const idx=(x,y)=>y*width+x;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
 const i=idx(x,y);solid[i]=+(y>=surface(x));
 const bed=Math.abs(Math.sin((y+5*Math.sin(x/25))/6));
 const fracture=Math.min(Math.abs(Math.sin((x+y*.65+4*Math.sin(y/9))/13)),Math.abs(Math.sin((x-y*.38)/19)));
 weak[i]=.15+.45*Math.exp(-bed*8)+.65*Math.exp(-fracture*12);
 }
 // Recharge traces compete for permeable routes; accumulated flow enlarges rock.
 for(let k=0;k<width*12;k++){
 let x=1+Math.floor(hash(k,1)*(width-2)),y=Math.ceil(surface(x)),heading=hash(k,2)<.5?-1:1;
 for(let t=0;t<height*2&&y<height-3&&x>1&&x<width-2;t++){
 flow[idx(x,y)]+=1;
 let best=null;
 for(const [dx,dy] of [[-1,0],[1,0],[-1,1],[0,1],[1,1]]){
 const a=x+dx,b=y+dy,i=idx(a,b);
 if(!solid[i])continue;
 const score=weak[i]*2+Math.log1p(flow[i])*.10+dy*.22+dx*heading*.10+hash(k+t*7,a+b*width)*.55;
 if(!best||score>best.score)best={a,b,score};
 }
 if(!best)break;x=best.a;y=best.b;
 }
 }
 const peak=Math.max(...flow);
 for(let y=1;y<height-2;y++)for(let x=1;x<width-1;x++){
 const f=flow[idx(x,y)];if(f<Math.max(9,peak*.045))continue;
 const radius=Math.min(8,1+Math.floor(Math.sqrt(f)*.30));
 for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
 const a=x+dx,b=y+dy;if(a<1||a>=width-1||b<1||b>=height-2)continue;
 if(dx*dx+dy*dy<=radius*radius*(.65+.55*weak[idx(a,b)]))solid[idx(a,b)]=0;
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
 return {width,height,solid,weak,flow,components};
}
root.ArcheGeology={generate};
})(typeof globalThis!=='undefined'?globalThis:this);
