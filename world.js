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
    function sample(x){
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
    return {sample,width,originalWidth,shore,lakes,spawn:shore+264};
  }

  if(typeof module!=='undefined')module.exports=createArcheWorld;
  else root.createArcheWorld=createArcheWorld;
})(globalThis);
