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
    let branches=0;
    for(const cave of caves){
     const points=cave.fieldPoints;
     if(cave.id.includes('-branch-')){
      branches++;
      for(const end of [points[0],points.at(-1)]){
       if(end.bottom-end.top>.01)throw Error('Abrupt branch end in '+cave.id);
      }
     }else{
      for(let i=1;i<points.length;i++){
       const rise=Math.abs(points[i].bottom-points[i-1].bottom);
       if(rise>cave.fieldScale*.85+.001)throw Error('Abrupt floor grade in '+cave.id);
      }
     }
    }
    if(!branches)throw Error('Expected secondary cave passages');
    const tick=()=>Engine.update(e,1000/60);
    function joystick(dx,dy){
     const rect=pad.getBoundingClientRect();
     movePad({clientX:rect.left+rect.width/2+38*dx,clientY:rect.top+rect.height/2+38*dy});
    }
    function position(x,dir,cave){
     const floor=cave?caveFloor(x,cave):solidGaitSurface(x);
     if(!human)createHuman(x,floor-37);
     Body.setPosition(human,{x,y:floor-37});
     if(cave)human.plugin.route=cave.id;
     else delete human.plugin.route;
     delete human.plugin.groundTravel;
     delete human.plugin.coordinatedGait;
     facing=dir;
     stopWalking();
    }
    function checkCrouch(where){
     joystick(0,1);
     for(let i=0;i<15;i++)tick();
     if(crouchPose<.8)throw Error('Joystick failed to crouch '+where);
     joystick(0,0);
     for(let i=0;i<15;i++)tick();
     if(crouchPose>.1)throw Error('Joystick failed to stand '+where);
    }
    for(const dir of [-1,1]){
     const cave=caves.find(c=>dir>0?!c.closedLeft:!c.closedRight);
     const edge=dir>0?cave.left:cave.right;
     position(edge-dir*30,dir);
     checkCrouch('at the cave mouth');
     if(human.plugin.route)throw Error('Straight-down crouch entered a cave');
     joystick(dir,.8);
     for(let i=0;i<100&&!human.plugin.route;i++)tick();
     if(human.plugin.route!==cave.id)throw Error('Diagonal descent failed to enter '+cave.id);
     const x=edge+dir*260;
     const room=physicalGeometry.walkingRegion(x,cave.id);
     if(!Number.isFinite(room.top)||room.bottom-room.top<74)throw Error('Invalid underground crouch fixture');
     position(x,dir,cave);
     checkCrouch('inside '+cave.id);
    }
    for(const [id,crossing] of [['seam-19720',20372],['seam-50800',51656],['seam-86920',87140]]){
     const cave=caves.find(c=>c.id===id);
     for(const dir of [-1,1]){
      position(crossing-dir*65,dir,cave);
      joystick(dir,0);
      for(let i=0;i<200&&dir*(human.position.x-crossing)<65;i++){
       tick();
       const {x,y}=human.position;
       if(human.plugin.route!==id||y+37>caveFloor(x,cave)+2)throw Error('Lost main footing at '+id);
      }
      if(dir*(human.position.x-crossing)<65)throw Error('Blocked crossing at '+id);
     }
    }
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
