const assert = require('node:assert/strict');
const createWatershed = require('../watershed.js');

for (const seed of [1, 4, 20, 42, 4294967295]) {
  const world = createWatershed(seed);
  const {height, filled, parent, order, flow} = world.grid;
  assert.equal(new Set(order).size, height.length);
  const visited = new Set();
  for (const i of order) {
    assert.ok(filled[i] >= height[i]);
    assert.ok(flow[i] > 0);
    const downstream = parent[i];
    if (downstream >= 0) {
      assert.ok(visited.has(downstream), 'drainage has no cycles');
      assert.ok(filled[downstream] <= filled[i], 'water can reach its outlet');
      assert.ok(flow[downstream] >= flow[i]);
    }
    visited.add(i);
  }
  const repeat = createWatershed(seed);
  const biomes = new Set();
  for (let x = 24; x < world.width; x += 48) {
    const sample = world.sample(x);
    assert.deepEqual(sample, repeat.sample(x));
    if (sample.wet) assert.ok(sample.elevation < sample.water);
    biomes.add(sample.biome);
  }
  assert.ok(biomes.size >= 5);
  for (const dx of [-96,-48,0,48,96]) {
    const sample = world.sample(world.spawn+dx);
    assert.equal(sample.wet,false);
    assert.ok(Math.abs(sample.elevation-world.sample(world.spawn).elevation)<8);
  }
}
assert.notDeepEqual(createWatershed(1).grid.height,createWatershed(20).grid.height);
console.log('Watershed drainage, seed repeatability, biome variety, and dry spawns passed.');
