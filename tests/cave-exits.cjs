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
  await page.goto('http://127.0.0.1:8080/');
  await page.evaluate(async()=>{
   Runner.stop(runner);Render.stop(r);
   const check=(value,message)=>{if(!value)throw Error(message);};
   let saved={revision:0,state:{}};
   woodClient={from:()=>({
    select:()=>({eq:()=>({single:async()=>({data:saved})})}),
    update:row=>({eq:()=>({eq:(_,revision)=>({select:async()=>{
     if(revision!==saved.revision)return {data:[]};
     saved=JSON.parse(JSON.stringify(row));return {data:[{revision:saved.revision}]};
    }})})})
   })};
   woodReady=true;
   // A shoreline fixture using the real terrain and a controlled water level.
   const edge=Array.from({length:Math.floor(worldWidth/10)-10},(_,i)=>50+i*10).find(x=>
    solidGaitSurface(x-23)-solidGaitSurface(x+27)>25);
   check(Number.isFinite(edge),'Expected a shore fixture');
   const poolLevel=solidGaitSurface(edge-23)-13;
   const basin={kind:'lake',left:edge-80,right:edge+80,level:poolLevel,spill:poolLevel-1};
   ponds.splice(0,ponds.length,basin);
   const dry=edge+27,wet=edge-23;
   check(canoeWater(wet)?.depth>=10&&!canoePose({x:dry,length:95}).water,'Shore fixture must cross the float threshold');
   const q={x:dry,y:solidGaitSurface(dry)},size=142;
   createHuman(q.x,q.y-37);
   Body.setPosition(human,{x:q.x,y:q.y-37});
   const trunk=Bodies.rectangle(q.x,q.y-10,17,size,{isStatic:true});
   trunk.plugin.wood={tree_x:dry,length:size,width:17};
   const id=String(Math.round(dry*1000));
   woodTrunks.set(Number(id),trunk);
   check(!canoeTrunk(),'Thin trunk should be ineligible');
   trunk.plugin.wood.width=20;
   basin.left=dry-180;basin.right=dry+180;
   basin.level-=200;basin.spill-=200;
   const floating=floatingTrunkPose(trunk);
   check(floating&&Math.abs(floating.angle+Math.PI/2)<.001&&
    Math.abs(floating.y-physicalWaterLevel(basin,floating.x))<4,
    'A submerged trunk should float horizontally at the water surface');
   check(!canoeTrunk(),'A trunk in water should be ineligible for canoe work');
   workCanoe();check(!canoeWork,'Work must reject a wet trunk even when called directly');
   basin.left=edge-80;basin.right=edge+80;
   basin.level+=200;basin.spill+=200;
   check(!floatingTrunkPose(trunk),'A dry trunk should remain on the terrain');

   for(let stage=1;stage<=3;stage++){
    workCanoe();check(canoeWork,'Suitable trunk should support work');
    for(let i=0;i<49;i++)advanceCanoeWork(.05);
    while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
    check(saved.state.canoes[id].stage===stage,'Each work session should save one stage');
    applyWoodSnapshot(saved.state);
   }
   check(!nearbyTrunk()&&!canoeTrunk(),'Finished hull should replace its source trunk');
   grabCanoe("drag");
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(canoeControl?.mode==='drag','Dry hull should be draggable');
   Body.setPosition(human,{x:wet-32,y:solidGaitSurface(wet-32)-37});
   for(let i=0;i<60&&canoeControl;i++){
    updateCanoe({air:false},1);
    while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   }
   check(!canoeControl&&canoePose(canoes.get(id)).water,'Towing into water should launch the canoe');
   Body.setPosition(human,{x:canoes.get(id).x,y:poolLevel-20});
   grabCanoe("ride");
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(canoeControl?.mode==='ride','Afloat canoe should be boardable');
   const start=canoeControl.x;walk=-1;
   for(let i=0;i<12;i++)updateCanoe({},1);
   check(canoeControl.x<start,'Joystick should paddle');
   walk=0;
   basin.level-=35;basin.spill-=35;
   stopCanoe();
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(!canoeControl&&swimming&&!saved.state.canoes[id].owner,'Deep-water exit should start swimming and release the canoe');
   check(Math.abs(human.position.x-saved.state.canoes[id].x)<.001,'Exit should place the swimmer beside the canoe');
   grabCanoe('ride');
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(canoeControl?.mode==='ride','Swimmer should be able to reboard');
   basin.level+=35;basin.spill+=35;
   stopCanoe();
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(!canoeControl&&!swimming,'Shallow-water exit should return to wading');
   Body.setPosition(human,{x:dry,y:solidGaitSurface(dry)-37});
   check(canoeHaulTarget(canoeNearby())!==null,'A bank within reach should offer Drag canoe');
   grabCanoe('drag');
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(canoeControl?.mode==='haul','Haul should claim the floating canoe');
   for(let i=0;i<120&&canoeControl;i++){
    updateCanoe({air:false},1);
    while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   }
   applyWoodSnapshot(saved.state);
   check(!canoeControl&&!saved.state.canoes[id].owner&&!canoePose(canoes.get(id)).water,
    'Hauled canoe should be dry, unclaimed and saved ashore');
   Body.setPosition(human,{x:canoes.get(id).x,y:solidGaitSurface(canoes.get(id).x)-37});
   grabCanoe('ride');
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(canoeControl?.mode==='ride','A canoe on land should be boardable');
   const beached=canoeControl.x;walk=1;
   updateCanoe({},1);
   check(canoeControl.x===beached,'A canoe on land should not paddle');
   walk=0;stopCanoe();
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(!canoeControl&&!swimming,'Exit on land should leave the player standing');
   const deposits=[...stoneDeposits.values()];
   check(deposits.filter(q=>q.route!=='surface').length>deposits.filter(q=>q.route==='surface').length,
    'Stones should be more common underground');
   const [stoneId,stone]=[...stoneDeposits].find(([,q])=>q.route!=='surface'&&q.size==='large');
   const cave=caveById(stone.route);
   Body.setPosition(human,{x:stone.x,y:caveFloor(stone.x,cave)-37});
   human.plugin.route=stone.route;human.plugin.groundTravel={vx:0,vy:0};
   check(nearbyStone('large')?.id===stoneId,'Expected mineable stone at cave floor');
   mineStone();
   for(let i=0;i<34;i++)updateMining(.05);
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   const fragments=Object.keys(saved.state.stones).filter(id=>id.startsWith(stoneId+'-piece-'));
   check(saved.state.stones[stoneId].removed&&fragments.length>=3,'Mining should replace the large stone with small fragments');
   applyWoodSnapshot(saved.state);
   check(!nearbyStone('large'),'Mined stone should stay broken after reload');
   takeStone();
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   const carried=heldStone;
   check(fragments.includes(carried),'A fragment should be carryable');
   putStone(false);
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   check(!heldStone&&!saved.state.stones[carried].owner,'A dropped stone should persist on the ground');
   takeStone();
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   const piled=heldStone;
   check(piled&&nearbyStone('small',true),'Expected a nearby small stone to start a pile');
   putStone(true);
   while(woodBusy)await new Promise(resolve=>setTimeout(resolve,0));
   applyWoodSnapshot(saved.state);
   const pile=stoneChanges.get(piled)?.pile;
   check(pile&&[...placedStones()].filter(([,q])=>q.pile===pile).length===2,'Both stones should reload in the same pile');
   delete human.plugin.route;
   const floatX=Array.from({length:300},(_,i)=>400+i*40).find(x=>
    [...Array(33)].every((_,i)=>Math.abs(solidGaitSurface(x-160+i*10)-solidGaitSurface(x))<18));
   check(floatX,'Expected a level basin fixture');
   const floor=solidGaitSurface(floatX);
   const rest={x:floatX,y:floor-10,angle:-Math.PI/2};
   trunk.plugin.woodRest=rest;
   const floatId=Number(id)+1;
   trunk.plugin.wood.tree_x=floatId/1000;
   woodTrunks.set(floatId,trunk);
   woodTrunks.delete(Number(id));
   basin.left=floatX-180;basin.right=floatX+180;
   basin.level=floor-100;basin.spill=basin.level-1;
   streamTerrain(floatX);
   pondGroundCount=ground.length;
   ponds.splice(0,ponds.length,basin);
   const float=floatingTrunkPose(trunk);
   check(float,'Expected enough water to float the trunk');
   trunk.plugin.floatingTrunk=float;
   const deck=floatingTrunkSupport(float.x);
   check(deck?.trunk===trunk,'Floating trunk should have a walkable top');
   const landingFlight={air:true,vx:2,vy:2,diveBlend:.6};
   anticipateDive(landingFlight,{x:float.x-trunk.plugin.wood.length/2-5,y:deck.bottom-68},1);
   check(landingFlight.diveBlend===0,'A jump crossing a trunk edge should keep the landing pose');
   const waterFlight={air:true,vx:1,vy:2,diveBlend:0};
   anticipateDive(waterFlight,{x:float.x+trunk.plugin.wood.length/2+15,y:deck.bottom-68},1);
   check(waterFlight.diveBlend>0,'A jump missing the trunk should still prepare to dive');

   Body.setPosition(human,{x:float.x-32,y:deck.bottom-37-22});
   human.plugin.groundTravel={vx:0,vy:0};
   delete human.plugin.coordinatedGait;coordinatedGroundGait(1);
   human.plugin.groundTravel={air:true,vx:1.4,vy:3};
   const tick=()=>Engine.update(e,1000/60);
   for(let i=0;i<24&&human.plugin.groundTravel.trunkSupport!==trunk;i++)tick();
   const travel=human.plugin.groundTravel;
   check(travel.trunkSupport===trunk&&!travel.air&&!swimming,'A falling character should land on the trunk');
   const startOnTrunk=human.position.x;
   walk=rawPadX=facing=1;padY=0;
   travel.vx=0;travel.land=0;travel.compress=0;
   tick();
   check(Math.abs(travel.vx-.26)<.01,'Starting to walk on a trunk should use full dry-footing acceleration');
   let dip=trunk.plugin.deckDip||0;
   for(let i=0;i<29;i++){tick();dip=Math.max(dip,trunk.plugin.deckDip||0);}
   check(travel.trunkSupport===trunk&&human.position.x>startOnTrunk+12,'The player should walk along the trunk');
   check(dip>1&&dip<=6,'The weighted trunk should dip slightly');
   rawPadX=walk=0;padY=1;crouchInput=1;
   for(let i=0;i<8;i++)tick();
   padY=-1;crouchInput=0;
   for(let i=0;i<14;i++)tick();
   check(travel.air&&human.position.y<floatingTrunkSupport(human.position.x).bottom-38,'The player should jump from the trunk');
   for(let i=0;i<80&&travel.trunkSupport!==trunk;i++)tick();
   check(travel.trunkSupport===trunk,'The player should land back on the trunk');
   walk=rawPadX=1;padY=0;
   for(let i=0;i<150&&!swimming;i++)tick();
   check(swimming&&!travel.trunkSupport,'Walking beyond the trunk should lead to swimming '+JSON.stringify({x:human.position.x,y:human.position.y,support:!!travel.trunkSupport,air:travel.air,vx:travel.vx,pond:ponds.length}));


  });
  for(const speed of [1,15]){
   await page.goto('http://127.0.0.1:8080/?speed='+speed);
   await page.waitForFunction(()=>typeof physicalGeometry!=='undefined'&&typeof runner!=='undefined');
   const results=await page.evaluate(()=>{
    Runner.stop(runner);Render.stop(r);
    const cave=caves.find(c=>c.chamber),worldX=cave.left+460;
    const canvas=document.createElement('canvas');
    canvas.width=160;canvas.height=180;
    const rainCtx=canvas.getContext('2d');
    const surface=exteriorVisualSurface(worldX);
    const bounds={min:{x:worldX-160,y:surface-110},max:{x:worldX+160,y:surface+250}};
    clipRainToSky(rainCtx,160,180,bounds);
    rainCtx.fillRect(0,0,160,180);
    const alpha=y=>rainCtx.getImageData(80,y,1,1).data[3];
    if(alpha(40)!==255||alpha(75)!==0)throw Error('Rain must stop at the exterior terrain');
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
     for(let i=0;i<12;i++){
      tick();
      for(let arm=0;arm<2;arm++){
       const upper=anatomy[1+arm],shoulderX=upper.position.x+Math.sin(upper.angle)*7;
       if((hands[arm].position.x-shoulderX)*facing<-.25)throw Error('Arm swung back before crouch-walking');
      }
     }
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
