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
      let previousGrade=0,straightRun=0;
      for(let i=1;i<points.length;i++){
       const rise=Math.abs(points[i].bottom-points[i-1].bottom);
       if(rise>cave.fieldScale*.85+.001)throw Error('Abrupt floor grade in '+cave.id);
       const grade=(points[i].bottom-points[i-1].bottom)/cave.fieldScale;
       straightRun=Math.abs(grade)>.6&&Math.abs(grade-previousGrade)<.001?straightRun+cave.fieldScale:0;
       if(straightRun>200)throw Error('Long uniform floor grade in '+cave.id);
       previousGrade=grade;
      }
     }
    }
    if(!caves.some(c=>c.closedLeft&&!c.closedRight))throw Error('Expected a right-only entrance');
    if(!caves.some(c=>!c.closedLeft&&c.closedRight))throw Error('Expected a left-only entrance');
    if(!caves.some(c=>!c.closedLeft&&!c.closedRight))throw Error('Expected a through cave');
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
     for(let i=0;i<180&&(!human.plugin.route||dir*(human.position.x-edge)<125);i++)tick();
     if(human.plugin.route!==cave.id||dir*(human.position.x-edge)<125)
      throw Error('Held diagonal stopped at entrance '+cave.id);
    }
    const standingCave=caves.find(c=>{
     const room=physicalGeometry.walkingRegion((c.left+c.right)/2,c.id);
     return Number.isFinite(room.top)&&room.bottom-room.top>=74;
    });
    if(!standingCave)throw Error('Expected a standing-height passage');
    position((standingCave.left+standingCave.right)/2,1,standingCave);
    checkCrouch('inside '+standingCave.id);
    for(const cave of caves)for(const dir of [-1,1]){
     if(dir>0?cave.closedLeft:cave.closedRight)continue;
     const edge=dir>0?cave.left:cave.right;
     position(edge,-dir);
     joystick(dir,1);
     for(let i=0;i<200&&(!human.plugin.route||dir*(human.position.x-edge)<125);i++)tick();
     if(human.plugin.route!==cave.id||dir*(human.position.x-edge)<125)
      throw Error('Held diagonal stopped at '+cave.id+' '+dir+' offset '+(human.position.x-edge));
     if(facing!==dir)throw Error('Faced away from entrance '+cave.id);
    }
    for(const branch of caves.filter(c=>c.id.includes('-branch-'))){
     const id=branch.id.split('-branch-')[0];
     const cave=caves.find(c=>c.id===id);
     const crossing=(branch.left+branch.right)/2;
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
    const chamber=caves.find(c=>c.chamber);
    if(!chamber)throw Error('Expected the conifer pilot chamber');
    const clearance=x=>caveFloor(x,chamber)-caveCeiling(x,chamber);
    if(clearance(chamber.left+460)<clearance(chamber.left+215)+60)
     throw Error('The pilot throat should open into a taller chamber');
    for(const dir of [-1,1]){
     const start=chamber.left+(dir>0?220:820);
     const end=chamber.left+(dir>0?820:220);
     position(start,dir,chamber);
     joystick(dir,0);
     for(let i=0;i<720&&dir*(end-human.position.x)>0;i++)tick();
     if(human.plugin.route!==chamber.id||dir*(end-human.position.x)>0)
      throw Error('Pilot chamber is blocked');
    }
    for(const dir of [-1,1]){
     const start=chamber.left+(dir>0?175:325);
     const end=chamber.left+(dir>0?325:175);
     position(start,-dir,chamber);
     joystick(dir,1);
     for(let i=0;i<12;i++)tick();
     if(Math.abs(human.position.x-start)>1||crouchPose<.5)
      throw Error('Brief diagonal should crouch before stepping');
     let tookStep=false,groundedFrames=0,lowStepFrames=0;
     for(let i=0;i<480&&dir*(end-human.position.x)>0;i++){
      tick();
      if(human.plugin.coordinatedGait?.feet.some(foot=>foot.t<1))tookStep=true;
      if(human.plugin.groundTravel.crouchWalk&&crouchPose>.8){
       lowStepFrames++;
       const feet=[anatomy[4],anatomy[6]].map(shin=>{
        const dx=Math.sin(shin.angle)*6,dy=Math.cos(shin.angle)*6;
        const ankle={x:shin.position.x-dx,y:shin.position.y+dy};
        const knee={x:shin.position.x+dx,y:shin.position.y-dy};
        return {soleGap:caveFloor(ankle.x,chamber)-ankle.y,
         kneeGap:caveFloor(knee.x,chamber)-knee.y};
       });
       if(feet.every(foot=>foot.kneeGap>5)&&feet.some(foot=>foot.soleGap>=-2&&foot.soleGap<=6))
        groundedFrames++;
      }
      if(human.plugin.route!==chamber.id||human.position.y-(37-14*crouchPose)<caveCeiling(human.position.x,chamber)-.5)
       throw Error('Crouch-walk left the passage clearance');
     }
     if(dir*(end-human.position.x)>0||!tookStep||facing!==dir||crouchPose<.8)
      throw Error('Held diagonal failed to crouch-walk through the pilot throat');
     if(lowStepFrames<20||groundedFrames/lowStepFrames<.85)
      throw Error('Crouch gait lost foot support '+JSON.stringify({groundedFrames,lowStepFrames,dir}));
     joystick(0,1);
     for(let i=0;i<30;i++)tick();
     const stopped=human.position.x;
     for(let i=0;i<15;i++)tick();
     if(Math.abs(human.position.x-stopped)>.2||crouchPose<.8)
      throw Error('Straight down should crouch in place');
    }
    // Render every generated passage, including secondary passages.
    const ctx=r.context;
    const left=r.bounds.min.x,right=r.bounds.max.x;
    const finishes=new Set();
    for(const cave of caves){
     const finish=caveBiomeFinishes[cave.biome];
     if(!finish)throw Error('Missing cave finish for '+cave.biome);
     finishes.add(finish);
     ctx.save();
     r.bounds.min.x=cave.left;
     r.bounds.max.x=Math.min(cave.right,cave.left+820);
     try{paintCave(cave);}finally{
      r.bounds.min.x=left;r.bounds.max.x=right;
      ctx.restore();
     }
    }
    if(finishes.size!==new Set(caves.map(c=>c.biome)).size)
     throw Error('Expected a distinct finish for each cave biome');
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
