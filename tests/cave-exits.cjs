const {chromium}=require('playwright');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:820,height:1180},isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/matter.min.js',route=>route.fulfill({path:require.resolve('matter-js/build/matter.min.js'),contentType:'application/javascript'}));
  await page.route('http://127.0.0.1:8080/**',route=>{
   const asset=new URL(route.request().url()).pathname;
   if(!['/','/world.js','/geology-experimental.js'].includes(asset))return route.abort();
   return route.fulfill({
    path:path.join(__dirname,'..',asset==='/'?'index.html':asset),
    contentType:asset==='/'?'text/html':'application/javascript'
   });
  });
  for(const speed of [1,15]){
   await page.goto('http://127.0.0.1:8080/?speed='+speed);
   await page.waitForFunction(()=>typeof physicalGeometry!=='undefined'&&typeof runner!=='undefined');
   const results=await page.evaluate(()=>{
    Runner.stop(runner);Render.stop(r);
    let count=0;
    for(const cave of caves)for(const dir of [-1,1]){
     if(dir<0?cave.closedLeft:cave.closedRight)continue;
     const edge=dir<0?cave.left:cave.right,x=edge-dir*120;
     if(!human)createHuman(x,caveFloor(x,cave)-37);
     Body.setPosition(human,{x,y:caveFloor(x,cave)-37});
     human.plugin.route=cave.id;
     delete human.plugin.groundTravel;delete human.plugin.coordinatedGait;
     walk=rawPadX=facing=dir;padY=0;
     let onSurface=false;
     for(let i=0;i<260&&dir*(human.position.x-edge)<24;i++){
      Engine.update(e,1000/60);
      if(onSurface&&human.plugin.route)throw Error('Re-entered cave '+cave.id);
      if(!human.plugin.route)onSurface=true;
     }
     if(dir*(human.position.x-edge)<24||human.plugin.route)throw Error('Stuck at '+cave.id+' direction '+dir+' offset '+(human.position.x-edge));
     count++;
    }
    return {count,speed:travelMultiplier};
   });
   assert.equal(results.speed,speed);
   assert.ok(results.count>0);
   console.log(`Walked out of ${results.count} cave mouths at ${speed}× travel speed.`);
  }
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
