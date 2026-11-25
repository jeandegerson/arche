const assert = require('node:assert/strict');
const createArcheWorld = require('../world');

for (const seed of [1, 17, 20261125]) {
  const world = createArcheWorld(seed);
  const repeated = createArcheWorld(seed);
  const oceanRuns = [];
  const inlandBiomes = new Set();

  let previous;
  for (let x = 0; x <= world.width; x += 10) {
    const terrain = world.sample(x);
    assert.deepEqual(terrain, repeated.sample(x));
    assert.ok(Number.isFinite(terrain.surface));
    if (terrain.wet) assert.ok(terrain.water < terrain.surface);
    if (x < world.shore) {
      const land = !terrain.wet;
      if (oceanRuns.at(-1) !== land) oceanRuns.push(land);
      if (!land) assert.equal(terrain.water, 610);
    } else {
      inlandBiomes.add(terrain.biome);
      if (terrain.wet) assert.ok(terrain.surface-terrain.water < 42);
      if (previous) assert.ok(Math.abs(terrain.surface-previous.surface) < 10);
    }
    previous = terrain;
  }
  assert.deepEqual(oceanRuns, [false,true,false,true]);
  assert.deepEqual([...inlandBiomes].sort(),
    ['alpine','coast','conifer','marsh','salt','steppe','woodland']);
  assert.equal(world.sample(world.spawn).wet,false);
  assert.equal(world.sample(world.spawn).biome,'coast');
}
assert.notEqual(createArcheWorld(1).sample(185000).surface,createArcheWorld(17).sample(185000).surface);
console.log('Verified reproducible side-on terrain, one island and continuous mainland across three seeds.');
