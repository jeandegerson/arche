(function (root) {
  'use strict';

  // Distances reflect travel time. Elevations are in the game's physics units.
  const shore = 14400;
  const mainlandLength = 53760;
  const originalWidth = shore + mainlandLength;
  const width = originalWidth + 27000;
  const shelf = 610;
  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
  const smooth = x => x*x*(3-2*x);
  const mix = (a,b,t) => a+(b-a)*t;
  const colors = {
    sea:'#5d6863', island:'#e4c689', coast:'#ddbd7f', marsh:'#8c793e',
    woodland:'#637a41', meadow:'#a4a259', conifer:'#415e52', alpine:'#c4d2d0', steppe:'#b18d51',
    salt:'#b7a58a', arid:'#bda174', dunes:'#dfbc80', sandstone:'#b98660', oasis:'#a6ad73'
  };
  const bands = [
    [0, 594], [.035, 579], [.073, 604], [.11, 600], [.145, 575],
    [.18, 562], [.22, 579], [.27, 550], [.32, 567], [.36, 547], [.42, 522], [.48, 493],
    [.53, 409], [.595, 153], [.625, -116], [.651, -590], [.681, -140],
    [.718, -402], [.75, 146], [.79, 369], [.848, 475], [.864, 559], [.905, 591], [.935, 571], [1, 508]
  ];

  // Regional relief fades between dunes, hummocks, forested ridges and terraces.
  const reliefBands = [
    [0, 12, 340], [.035, 23, 390], [.055, 13, 340], [.13, 20, 410],
    [.17, 35, 760], [.36, 46, 880], [.50, 52, 820], [.61, 49, 690],
    [.73, 57, 850], [.82, 43, 780], [.88, 28, 620], [.905, 9, 560],
    [.927, 23, 640], [.96, 48, 780], [1, 49, 820]
  ];

  function createArcheWorld(seed = 20261125) {
    function random(i, salt) {
      let h = seed ^ Math.imul(i,0x27d4eb2d) ^ Math.imul(salt,0x85ebca77);
      h = Math.imul(h^(h>>>16),0x7feb352d);
      return ((h^(h>>>15))>>>0)/4294967296;
    }
    function noise(x, wavelength, salt) {
      const a=Math.floor(x/wavelength), t=x/wavelength-a;
      return mix(2*random(a,salt)-1,2*random(a+1,salt)-1,smooth(t));
    }
    function localRelief(x,t) {
      let i=0;
      while(i<reliefBands.length-2&&t>reliefBands[i+1][0])i++;
      const [start,a,periodA]=reliefBands[i],[end,b,periodB]=reliefBands[i+1];
      const blend=smooth((t-start)/(end-start));
      function shape(amplitude,period) {
        const warped=x+noise(x,period*2.5,15)*period*.38;
        const mass=noise(warped,period,16);
        const shoulders=noise(warped,period*.43,17);
        const ledges=noise(x,period*.22,18)*(Math.abs(mass)*.23+.06);
        return amplitude*(mass*.8+shoulders*.33+ledges);
      }
      return mix(shape(a,periodA),shape(b,periodB),blend);
    }
    function baseSample(x) {
      if(x>originalWidth){const d=x-originalWidth, u=d/27000, edge=baseSample(originalWidth).surface;const blend=smooth(clamp(d/1800,0,1));const dune=Math.pow(.5+.5*Math.sin(d/310+noise(d,2400,31)*2),1.7);const mountain=smooth(clamp((u-.72)/.22,0,1));let surface=mix(edge,565+noise(d,1900,32)*38-95*dune*smooth(clamp((u-.15)/.15,0,1))-mountain*(160+noise(d,1200,33)*95),blend);let biome=u<.08?'steppe':u<.26?'arid':u<.76?'dunes':'sandstone',water=null;for(const center of [11200,18100]){const a=Math.abs(d-center)/520;if(a<1){const basin=smooth(1-a);surface=mix(surface,625,basin);biome='oasis';if(surface>590)water=590;}}return {surface,biome,water};}
      const t=clamp((x-shore)/mainlandLength,0,1);
      let surface,biome,water=null;
      if(x<shore){
        const islandX=(x-shore*.48)/(shore*.109);
        const island=Math.abs(islandX)<1?Math.cos(islandX*Math.PI/2)**2:0;
        const seabed=675+noise(x,480,1)*9;
        surface=mix(seabed,505+noise(x,220,2)*7+noise(x,170,19)*8,island);
        surface=mix(surface,594,smooth(clamp((x-shore+620)/620,0,1)));
        const shoreHeight=surface-shelf;
        surface-=island*Math.sign(shoreHeight)*27*(1-Math.exp(-Math.abs(shoreHeight)/45));
        if(surface>shelf){
          water=shelf;
          // Keep the beaches shallow and drop into a deeper offshore basin.
          const offshore=smooth(clamp((surface-shelf-14)/49,0,1));
          surface+=offshore*(514+noise(x,1070,20)*64);
        }
        biome=water!==null?'sea':island>0?'island':'coast';
      }else{
        let i=0;
        while(i<bands.length-2&&t>bands[i+1][0])i++;
        const [start,a]=bands[i],[end,b]=bands[i+1];
        const base=mix(a,b,smooth((t-start)/(end-start)));
        const relief=clamp((544-base)/350,0,1);
        const detail=smooth(clamp((x-shore)/350,0,1));
        const terraces=t>.83?7*Math.tanh(noise(x,1450,8)*3):0;
        surface=base+detail*(noise(x,1260,3)*(11+relief*49)
          +noise(x,370,4)*(3+relief*13)+noise(x,130,5)*(1+relief*5)+terraces);
        surface+=detail*localRelief(x,t);
        // The western conifer slope is one long graded climb into the snowline.
        const uphill=smooth(clamp((t-.437)/.031,0,1))*(1-smooth(clamp((t-.595)/.018,0,1)));
        const grade=508-(t-.468)*(355/.127);
        surface=mix(surface,grade,uphill);
        if(t<.045){
          const fade=detail*smooth(clamp((.045-t)/.007,0,1));
          surface-=fade*43*(.5+.5*noise(x,220,24))**1.5;
          biome='coast';
        }
        else if(t<.145){
          biome='marsh';
          if(surface>598)water=598;
        }else if(t>.86){
          biome='steppe';
          const lake=Math.abs((t-.911)/.045);
          if(lake<1){
            surface+=210*Math.cos(lake*Math.PI/2)**2;
            if(surface>592){water=592;biome='salt'}
          }
        }else if(t>=.595&&surface<(t<.625?153:314))biome='alpine';
        else if(surface<508)biome='conifer';
        else biome=noise(x,2150,9)>.21?'meadow':'woodland';
      }
      return {surface,biome,water};
    }

    // Site a basin within each biome. Its rim blends back into the same height field.
    const lakeSites=[
      ['coast',shore+1600,450,77],
      ['marsh',shore+mainlandLength*.105,485,87],
      ['woodland',shore+mainlandLength*.32,475,92],
      ['meadow',shore+mainlandLength*.25,465,83],
      ['conifer',shore+mainlandLength*.788,490,95],
      ['alpine',shore+mainlandLength*.68,515,102],
      ['steppe',shore+mainlandLength*.962,495,86]
    ];
    const lakes=[];
    for(const [biome,target,radius,depth] of lakeSites){
      let best=null;
      for(let x=radius+24;x+radius<originalWidth;x+=48){
        if(biome==='coast'&&x<shore+600)continue;
        if(biome==='conifer'&&x<shore+mainlandLength*.755)continue;
        const center=baseSample(x),left=baseSample(x-radius),right=baseSample(x+radius);
        if(center.biome!==biome||left.biome!==biome||right.biome!==biome)continue;
        if([-radius/2,radius/2].some(offset=>baseSample(x+offset).biome!==biome))continue;
        const score=Math.abs(x-target)*.018+Math.abs(left.surface-right.surface)*3
          +Math.abs((left.surface+right.surface)/2-center.surface)*2;
        if(best&&score>=best.score)continue;
        best={biome,x,radius,depth,level:Math.max(left.surface,right.surface)+3,score};
      }
      if(best)lakes.push(best);
    }
    function legacySample(x){
      let {surface,biome,water}=baseSample(x);
      let frozen=false;
      const lake=lakes.find(basin=>Math.abs(x-basin.x)<basin.radius);
      if(lake){
        const u=Math.abs(x-lake.x)/lake.radius;
        const bed=lake.level+lake.depth-(lake.depth+5)*smooth(clamp(u/.78,0,1));
        surface=mix(bed,surface,smooth(clamp((u-.34)/.66,0,1)));
        biome=lake.biome;
        water=surface>lake.level?lake.level:null;
        if(biome==='alpine'&&water!==null){
          frozen=true;
          surface=water;
          water=null;
        }
      }
      const wet=water!==null;
      // Eastern rain-shadow forest: retain the original relief and lake basins.
      const easternForest=x>=56600&&x<61700;
      const easternGrove=x>=65400&&x<68160;
      if(!wet&&!frozen&&((easternForest&&['woodland','steppe'].includes(biome))||(easternGrove&&biome==='steppe'&&noise(x,1400,61)>.15+(x-65400)/2760*.85)))biome='conifer';
      const canopy=noise(x,980,6);
      const cover=wet||frozen?0:({
        coast:.14,island:.42,marsh:.57,meadow:.54,woodland:.68+canopy*.24,
        conifer:.69+canopy*.22,alpine:.08,steppe:.16,salt:.05,arid:.035,dunes:0,sandstone:.015,oasis:.48
      }[biome]??0);
      return {surface,water,wet,frozen,biome,cover,color:colors[biome]};
    }
    const insertion=59000, extension=5000;
    function expandedSample(x){
      if(x<=insertion)return legacySample(x);
      if(x>=insertion+extension)return legacySample(x-extension);
      const d=x-insertion,u=d/extension,edge=legacySample(insertion).surface;
      const envelope=Math.sin(Math.PI*u)**2;
      const surface=edge+envelope*(-35+noise(d,1100,81)*48+noise(d,290,82)*13);
      return {surface,water:null,wet:false,frozen:false,biome:'conifer',cover:.69+noise(x,980,6)*.22,color:colors.conifer};
    }
    // A long eastern descent comparable to the western conifer slope.
    function easternDelta(x){
      if(x<=55000||x>=66500)return 0;
      const u=clamp((x-56000)/10000,0,1);
      const grade=153+u*410+noise(x,1250,91)*12+noise(x,420,92)*4;
      const weight=smooth(clamp((x-55000)/1000,0,1))*smooth(clamp((66500-x)/1000,0,1));
      const lake=lakes.find(l=>l.biome==='conifer'&&Math.abs(x-l.x)<l.radius+180);
      const reference=lake?lake.x:x;
      const baseline=lake?expandedSample(reference+lake.radius+30).surface:expandedSample(x).surface;
      const target=lake?153+clamp((reference-56000)/10000,0,1)*410:grade;
      const ordinary=grade-expandedSample(x).surface;
      const blend=lake?smooth(clamp((lake.radius+180-Math.abs(x-lake.x))/180,0,1)):0;
      return weight*mix(ordinary,target-baseline,blend);
    }
    function regionalSample(x){
      const q=expandedSample(x),delta=easternDelta(x);
      if(!delta)return q;
      const surface=q.surface+delta,water=q.water===null?null:q.water+delta;
      const biome=!q.wet&&!q.frozen&&x>=56000&&x<65500?'conifer':q.biome;
      return {...q,surface,water,biome,color:colors[biome],cover:biome==='conifer'&&!q.wet&&!q.frozen?.69+noise(x,980,6)*.22:q.cover};
    }
    // Seeded landforms: irregularly spaced, compact, smoothly joined to regional relief.
    const landformProfiles={island:[.65,.55],coast:[.65,.45],marsh:[.25,.25],woodland:[1,.85],meadow:[.75,.5],conifer:[1.2,1],alpine:[1.4,1.2],steppe:[.9,.8],arid:[1,.9],dunes:[.85,.3],sandstone:[1.5,1.3],oasis:[.3,.2],salt:[.15,.1],sea:[0,0]};
    const localSpacing=310;
    const smoothstep=(a,b,v)=>smooth(clamp((v-a)/(b-a),0,1));
    function localForm(x){
      const index=Math.floor(x/localSpacing);
      let offset=0;
      for(let i=index-2;i<=index+2;i++){
        const center=(i+.18+.64*random(i,101))*localSpacing;
        const radius=45+random(i,102)*170;
        const u=(x-center)/radius;
        if(Math.abs(u)>=1)continue;
        const q=regionalSample(center),p=landformProfiles[q.biome]||[0,0];
        if(q.wet||q.frozen)continue;
        const activity=smoothstep(-.4,.65,noise(center,1700,103));
        if(random(i,104)>.25+.65*activity)continue;
        const strength=(14+random(i,105)*48)*p[0]*(.4+.6*activity);
        const type=random(i,106),envelope=(1-u*u)**2;
        let shape;
        if(type<.25)shape=-envelope; // rounded hill
        else if(type<.48)shape=envelope*(.7+.3*Math.cos(u*4)); // hollow
        else if(type<.68)shape=envelope*Math.tanh(u*5)*p[1]; // bank
        else if(type<.84)shape=envelope*smoothstep(.05,.7,1-Math.abs(u))*p[1]; // gully
        else shape=-envelope*(.65+.35*Math.tanh((u+.2)*6))*p[1]; // asymmetric outcrop
        offset+=strength*shape;
      }
      const activity=smoothstep(-.45,.65,noise(x,1350,107));
      const p=landformProfiles[regionalSample(x).biome]||[0,0];
      offset+=p[0]*activity*(noise(x,95,108)*5+noise(x,38,109)*1.8);
      return clamp(offset,-85,85);
    }
    // Protect all water margins and the starting area. Interpolate a cached mask
    // so landforms fade before shorelines instead of creating vertical banks.
    const maskStep=24,mask=[];
    for(let x=0;x<=width+extension+maskStep;x+=maskStep){
      const q=regionalSample(x);
      mask.push(q.wet||q.frozen||Math.abs(x-(shore+264))<150?0:1);
    }
    const wetDistance=mask.map((v,i)=>{if(!v)return 0;for(let d=1;d<=9;d++)if(mask[i-d]===0||mask[i+d]===0)return smooth((d-1)/9);return 1});
    function landSample(x){
      const q=regionalSample(x);
      if(q.wet||q.frozen)return q;
      const t=clamp(x/maskStep,0,wetDistance.length-1),i=Math.floor(t);
      const weight=mix(wetDistance[i],wetDistance[Math.min(i+1,wetDistance.length-1)],t-i);
      let surface=q.surface+localForm(x)*weight;
      // Level benches and clearings, with broad shoulders and no water overlap.
      const cell=Math.floor(x/650);
      for(let k=cell-1;k<=cell+1;k++){
        const center=(k+.25+.5*random(k,121))*650;
        const h=regionalSample(center);
        const chance={island:.55,coast:.65,marsh:.85,woodland:.65,meadow:.85,conifer:.55,alpine:.22,steppe:.8,arid:.65,dunes:.22,sandstone:.3,oasis:.35,salt:.6}[h.biome]||0;
        if(h.wet||h.frozen||random(k,122)>chance)continue;
        const half=55+random(k,123)*100,shoulder=65+random(k,124)*65;
        const distance=Math.abs(x-center);
        if(distance>=half+shoulder)continue;
        const left=regionalSample(center-half-shoulder),right=regionalSample(center+half+shoulder);
        if(left.wet||right.wet||left.frozen||right.frozen||left.biome!==h.biome||right.biome!==h.biome)continue;
        const blend=(1-smoothstep(half,half+shoulder,distance))*weight;
        surface=mix(surface,h.surface,blend);
      }
      return {...q,surface};
    }
    const rivers=[];
    for(const [target,biome,radius,depth] of [[26000,'woodland',145,38],[34000,'meadow',190,52],[41000,'conifer',110,32],[61000,'conifer',165,45],[69000,'steppe',205,50]]){
      let best=null;
      for(let x=target-2200;x<=target+2200;x+=48){
        const a=landSample(x-radius-100),c=landSample(x),z=landSample(x+radius+100);
        if([a,c,z].some(q=>q.wet||q.frozen||q.biome!==biome)||rivers.some(p=>Math.abs(p.x-x)<1000))continue;
        let valid=true;for(let d=-radius-100;d<=radius+100;d+=12){const q=landSample(x+d);if(q.wet||q.frozen||q.biome!==biome){valid=false;break}}if(!valid)continue;
        const score=Math.abs(x-target)*.025+Math.abs(a.surface-z.surface)*2+Math.abs(c.surface-(a.surface+z.surface)/2);
        if(!best||score<best.score)best={x,radius,depth,level:Math.max(a.surface,z.surface,c.surface)+3,score,biome};
      }
      if(best)rivers.push(best);
    }
    function sample(x){
      const q=landSample(x),p=rivers.find(p=>Math.abs(x-p.x)<p.radius+100);
      if(!p||q.wet||q.frozen)return q;
      const u=Math.abs(x-p.x)/p.radius;
      const bed=p.level+p.depth*(1-u*u);
      const blend=1-smoothstep(.82,1+100/p.radius,u);
      const surface=mix(q.surface,bed,blend);
      const wet=u<1&&surface>p.level;
      return {...q,surface,wet,water:wet?p.level:null,waterKind:wet?'river':undefined,cover:wet?0:q.cover};
    }
    return {sample,rivers,width:width+extension,originalWidth:originalWidth+extension,coastalWidth:originalWidth,shore,lakes:lakes.map(l=>({...l,x:l.x>insertion?l.x+extension:l.x})),spawn:shore+264};
  }

  if(typeof module!=='undefined')module.exports=createArcheWorld;
  else root.createArcheWorld=createArcheWorld;
})(globalThis);
