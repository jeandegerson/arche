(function (root) {
  'use strict';

  // Distances reflect travel time. Elevations are in the game's physics units.
  const shore = 5760;
  const mainlandLength = 53760;
  const width = shore + mainlandLength;
  const shelf = 610;
  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
  const smooth = x => x*x*(3-2*x);
  const mix = (a,b,t) => a+(b-a)*t;
  const colors = {
    sea:'#5d6863', island:'#777950', coast:'#c4ad77', marsh:'#8c793e',
    woodland:'#637a41', meadow:'#a4a259', conifer:'#415e52', alpine:'#c4d2d0', steppe:'#b18d51',
    salt:'#b7a58a'
  };
  const bands = [
    [0, 594], [.035, 579], [.073, 604], [.11, 600], [.145, 575],
    [.18, 562], [.22, 579], [.27, 550], [.32, 567], [.36, 547], [.42, 522], [.48, 493],
    [.53, 416], [.595, 308], [.64, 151], [.675, 250], [.71, 191],
    [.75, 319], [.80, 493], [.86, 568], [.905, 591], [.935, 571], [1, 508]
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
    function sample(x) {
      const t=clamp((x-shore)/mainlandLength,0,1);
      let surface,biome,water=null;
      if(x<shore){
        const islandX=(x-shore*.48)/(shore*.12);
        const island=Math.abs(islandX)<1?Math.cos(islandX*Math.PI/2)**2:0;
        const seabed=675+noise(x,480,1)*9;
        surface=mix(seabed,505+noise(x,220,2)*7,island);
        surface=mix(surface,594,smooth(clamp((x-shore+440)/440,0,1)));
        if(surface>shelf)water=shelf;
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
        if(t<.045)biome='coast';
        else if(t<.145){
          biome='marsh';
          if(surface>598)water=598;
        }else if(t>.815){
          biome='steppe';
          const lake=Math.abs((t-.905)/.018);
          if(lake<1){
            surface+=22*Math.cos(lake*Math.PI/2)**2;
            if(surface>592){water=592;biome='salt'}
          }
        }else if(surface<314)biome='alpine';
        else if(surface<508)biome='conifer';
        else biome=noise(x,2150,9)>.21?'meadow':'woodland';
      }
      const wet=water!==null;
      const canopy=noise(x,980,6);
      const cover=wet?0:({
        coast:.14,island:.42,marsh:.57,meadow:.54,woodland:.68+canopy*.24,
        conifer:.69+canopy*.22,alpine:.08,steppe:.16,salt:.05
      }[biome]??0);
      return {surface,water,wet,biome,cover,color:colors[biome]};
    }
    return {sample,width,shore,spawn:shore+264};
  }

  if(typeof module!=='undefined')module.exports=createArcheWorld;
  else root.createArcheWorld=createArcheWorld;
})(globalThis);
