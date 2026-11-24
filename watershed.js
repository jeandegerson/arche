// Regional generation happens before the playable section is sampled.
(function (root) {
  'use strict';
  const columns = 195, rows = 97, cellSize = 96, seaLevel = 36;
  const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
  const smooth = t => t * t * (3 - 2 * t);
  const mix = (a, b, t) => a + (b - a) * t;
  const offsets = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];

  function createWatershed(seed) {
    function random(x, y, salt) {
      let h = seed ^ Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(salt, 0x85ebca77);
      h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
      h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    }
    function noise(x, y, salt) {
      const a = Math.floor(x), b = Math.floor(y);
      const u = smooth(x - a), v = smooth(y - b);
      return mix(mix(random(a,b,salt),random(a+1,b,salt),u),
        mix(random(a,b+1,salt),random(a+1,b+1,salt),u),v);
    }

    const size = columns * rows;
    const height = new Uint16Array(size), filled = new Uint16Array(size);
    const parent = new Int32Array(size).fill(-1), order = [];
    const flow = new Float32Array(size), rain = new Float32Array(size);
    const hardness = new Float32Array(size);
    for (let y = 0; y < rows; y++) {
      let air = .98;
      for (let x = 0; x < columns; x++) {
        const i = y * columns + x;
        const coast = smooth(clamp((x - 2 + (noise(x/22,y/22,1)-.5)*15)/34,0,1));
        const warpedX = x + (noise(x/39,y/35,2)-.5)*40;
        const warpedY = y + (noise(x/41,y/30,3)-.5)*25;
        const mass = noise(warpedX/38,warpedY/34,4);
        const folds = 1 - Math.abs(2*noise(warpedX/18,warpedY/23,5)-1);
        hardness[i] = noise(x/23,y/23,6);
        const relief = 62*mass + 236*mass**2*folds**2 + 39*noise(x/11,y/12,7) + 10*noise(x/4,y/4,8);
        height[i] = Math.round(17 + coast * relief);
        const uphill = x ? Math.max(0, height[i]-height[i-1]) : 0;
        rain[i] = clamp(.20 + air*.52 + uphill*.024, .2, 1);
        air = x < 12 ? .98 : clamp(air+.008-uphill*.009, .14, .98);
        flow[i] = rain[i];
      }
    }

    // Priority flood from the sea and open region edges. Each cell drains
    // to an earlier cell, including on flats and across filled depressions.
    const queues = Array.from({length: Math.max(...height)+1}, () => []);
    const visited = new Uint8Array(size);
    function enqueue(i, level, downstream) {
      visited[i] = 1;
      filled[i] = level;
      parent[i] = downstream;
      queues[level].push(i);
    }
    for (let i = 0; i < size; i++) {
      const x = i % columns, y = Math.floor(i/columns);
      if (x===0||x===columns-1||y===0||y===rows-1||height[i]<=seaLevel) {
        enqueue(i,height[i],-1);
      }
    }
    for (let level = 0; level < queues.length; level++) {
      const queue = queues[level];
      while (queue.length) {
        const i = queue.pop();
        order.push(i);
        const x = i % columns, y = Math.floor(i/columns);
        for (const [dx,dy] of offsets) {
          const nx = x+dx, ny = y+dy, next = ny*columns+nx;
          if (nx<0||ny<0||nx>=columns||ny>=rows||visited[next]) continue;
          enqueue(next,Math.max(level,height[next]),i);
        }
      }
    }
    for (let k = order.length-1; k >= 0; k--) {
      const i = order[k], downstream = parent[i];
      if (downstream>=0) flow[downstream] += flow[i];
    }

    function sample(worldX) {
      const x = clamp(worldX/cellSize,0,columns-1.001);
      const y = (rows-1)/2 + (noise(x/38,0,12)-.5)*29;
      const left = Math.floor(x), top = Math.floor(y), i = top*columns+left;
      const read = field => mix(mix(field[i],field[i+1],x-left),
        mix(field[i+columns],field[i+columns+1],x-left),y-top);
      const nearest = Math.round(y)*columns+Math.round(x);
      const elevation = read(height);
      const runoff = flow[nearest];
      const lake = filled[nearest]-height[nearest]>=4;
      const river = !lake && height[nearest]>seaLevel && parent[nearest]>=0 && runoff>=72;
      const ocean = elevation<seaLevel;
      const water = ocean ? seaLevel : lake ? filled[nearest] : river ? elevation+2 : null;
      const bed = river ? elevation-clamp(7+Math.log2(runoff/72)*7,7,24)
        : ocean ? elevation-(seaLevel-elevation)*.52 : elevation;
      const grade = Math.max(Math.abs(height[nearest-1]-height[nearest+1]),
        Math.abs(height[nearest-columns]-height[nearest+columns]))/2 || 0;
      const cold = clamp((elevation-43)/129,0,1);
      const moisture = clamp(read(rain)*.76 + Math.min(.26,Math.log2(1+runoff)*.031),0,1);
      const soil = clamp(1-grade*.063-read(hardness)*.28,.04,1);
      const wet = water!==null && bed<water-2;
      const cover = wet ? 0 : clamp(moisture*.83+soil*.36-cold*.44,.04,.94);
      const biome = wet ? ocean?'sea':lake?'lake':'river' : cold>.78?'alpine'
        : moisture>.66&&grade<3&&runoff>12?'wetland'
        : cold>.37&&moisture>.44&&soil>.36?'conifer' : cover>.56?'woodland' : cover>.39?'meadow':'heath';
      return {elevation:bed,water,wet,cover,biome,cold,moisture,hardness:read(hardness)};
    }

    let spawn = 180;
    for (let x = 168; x<cellSize*columns-120; x+=48) {
      if ([-96,-48,0,48,96].every(dx => {
        const s = sample(x+dx);
        return !s.wet && Math.abs(s.elevation-sample(x).elevation)<8;
      })) { spawn=x; break; }
    }
    function horizon(worldX, layer) {
      const x = clamp(worldX/cellSize,0,columns-1.001);
      const left = Math.floor(x);
      const row = (rows-1)/2 - 28 + layer*8;
      const i = row*columns+left;
      return mix(height[i],height[i+1],x-left);
    }
    return {sample,spawn,horizon,width:columns*cellSize,grid:{columns,rows,height,filled,parent,order,flow}};
  }

  if (typeof module !== 'undefined') module.exports = createWatershed;
  else root.createWatershed = createWatershed;
})(globalThis);
