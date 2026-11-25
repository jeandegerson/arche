const assert = require('node:assert/strict');
const createArcheWorld = require('../world');

for (const seed of [1, 17, 20261125]) {
  const world = createArcheWorld(seed);
  assert.equal(world.width,68160);
  assert.equal(world.shore,14400);
  const repeated = createArcheWorld(seed);
  const oceanRuns = [];
  const inlandBiomes = new Set();

  let previous, deepestSea=0;
  for (let x = 0; x <= world.width; x += 10) {
    const terrain = world.sample(x);
    assert.deepEqual(terrain, repeated.sample(x));
    assert.ok(Number.isFinite(terrain.surface));
    if (terrain.wet) assert.ok(terrain.water < terrain.surface);
    if (x < world.shore) {
      const land = terrain.biome!=='sea';
      if (oceanRuns.at(-1) !== land) oceanRuns.push(land);
      if (!land) {
        assert.equal(terrain.water, 610);
        deepestSea=Math.max(deepestSea,terrain.surface-terrain.water);
      }
    } else {
      inlandBiomes.add(terrain.biome);
      if (terrain.wet) assert.ok(terrain.surface-terrain.water < (terrain.biome==="salt"?270:110));
      if (previous) assert.ok(Math.abs(terrain.surface-previous.surface) < 10);
    }
    previous = terrain;
  }
  assert.ok(deepestSea>530);
  const mainland=world.width-world.shore;
  let last=Infinity;
  for(let i=470;i<=590;i++){
    const ground=world.sample(world.shore+mainland*i/1000);
    assert.equal(ground.biome,'conifer');
    assert.ok(ground.surface<last);
    last=ground.surface;
  }
  assert.ok(world.sample(world.shore+mainland*.651).surface<-500);
  assert.deepEqual(world.lakes.map(lake=>lake.biome).sort(),
    ['alpine','coast','conifer','marsh','meadow','steppe','woodland']);
  for(const lake of world.lakes){
    const center=world.sample(lake.x);
    assert.equal(center.biome,lake.biome);
    if(lake.biome==='alpine'){
      assert.ok(center.frozen && !center.wet);
      assert.equal(center.surface,lake.level);
      continue;
    }
    assert.equal(center.water,lake.level);
    assert.ok(center.surface-center.water>=62);
    for(const side of [-1,1])assert.ok(world.sample(lake.x+side*lake.radius).surface<lake.level);
  }
  assert.deepEqual(oceanRuns, [false,true,false,true]);
  assert.deepEqual([...inlandBiomes].sort(),
    ['alpine','coast','conifer','marsh','meadow','salt','steppe','woodland']);
  assert.equal(world.sample(world.spawn).wet,false);
  assert.equal(world.sample(world.spawn).biome,'coast');
}
assert.notEqual(createArcheWorld(1).sample(36000).surface,createArcheWorld(17).sample(185000).surface);
console.log('Verified reproducible side-on terrain, one island and continuous mainland across three seeds.');
