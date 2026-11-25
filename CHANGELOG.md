# Changelog

## 0.0.2 — 2026-11-24 (proposed)
- Added Earth, Moon, zero and reverse gravity modes for experimentation with physical interactions.
- Fixed viewport resizing to remove each old boundary individually before adding replacements, avoiding stale collision walls.
- Tests: Node.js 22 mock-engine checks passed for all four gravity transitions, labels, dynamic-body wake calls and removal of four previous walls on resize. These checks exercised copied source functions, not the complete browser application.
- Actual Matter.js integration, browser rendering and mobile touch tests were not run (Matter.js unavailable in local test environment). Leave for review; do not merge until integration is verified.

## 0.0.3 — proposed
- Added selectable wood, rubber, stone and steel for newly spawned bodies, with distinct approximate densities, friction and restitution.
- Source patch checked for material property wiring; runtime and mobile tests not performed. Pending review and integration testing.

## 0.0.4
- Added small, medium and large sizes for newly spawned balls and boxes. Matter.js computes mass from area and material density.
- Source patch checked; browser test results not verified at publication.

## 0.0.5
- Added rod and spring constraints: select link mode and tap two bodies, then switch off to drag. Reset clears links.
- Source patch checked; browser behavior not yet verified.

## 0.0.6
- Added fixed world anchors: choose Anchor mode, tap a body, then an empty point to attach a stiff distance constraint. Switch off to drag and swing. Reset clears anchors.
- Source patch checked; browser and live deployment not verified.

## 0.0.7
- Added clockwise and counterclockwise torque-driven motors, selectable by tapping bodies; Clear mode removes motor, reset clears all motors. Motors apply bounded feedback torque rather than directly setting velocity.
- Source patch checked; browser and live deployment not verified.

## 0.0.8
- Added static terrain platforms built by tapping two endpoints, including slopes and walls. Erase mode removes user-built terrain; reset clears it. Terrain tools are exclusive with link and motor tools.
- Source patch checked; browser and deployment not verified.

## 0.0.9
- Grouped controls into Matter, Build and World tabs. Leaving Build cancels active selection tools, not existing mechanisms. Raised floor to reserve toolbar space.
- Source patch checked; browser and deployment not verified.

## 0.1.0
- Save and restore bodies, velocities, terrain, joints, motors and selected gravity/material/size using localStorage. Autosave every two seconds and on page hide. Device-local only.
- Source patch checked; browser persistence and deployment not verified.

## 0.1.1
- Swipe across free bodies in Build > Cut to split convex geometry into independent fragments with conserved mass. Reject tiny fragments and attached/motorized bodies. Persist polygon geometry and mass. JavaScript syntax checked; browser tests pending.

## 0.1.2
- Rods, springs and anchors attach at tapped points instead of body centres. First attachment is tracked in body-local coordinates and marked visually. JavaScript syntax checked; browser tests pending.

## 0.1.3
- Added glue (three-point rigid-bond approximation) and peg (single-point pivot) modes. Selected points must be within 22 simulation pixels. Connections break on excessive joint separation; this is a displacement heuristic, not a calibrated force model. Save joint metadata and visibility. Syntax checked; browser tests pending.

## 0.1.4
- Glue is painted onto body edges by swiping; visible adhesive spots follow the body and bond on physical contact. Save adhesive spots. Syntax checked; browser tests pending.

## 0.1.5
- Adhesive bonds cure over eight simulation seconds, increasing stiffness and displacement tolerance. Contacting adhesive spots determine coverage and are consumed by bonding. Cured bonds darken. Coverage and curing age persist through existing joint metadata. Syntax checked; browser tests pending.

## 0.1.6
- Added development Rope spawn tool: ten colliding lightweight nodes with tension-only approximate distance constraints and continuous visual links. Rope nodes can be dragged and attached with existing tools. Save rope metadata; cutting rope not yet supported. Syntax checked; browser tests pending.

## 0.1.7
- Rope: Tie mode secures a touched rope segment to a nearby dynamic object's surface, with visible knot and tap-to-untie interaction. Uses existing persistent constraints; approximates tying rather than simulating actual knots. Syntax checked; browser tests pending.

## 0.1.8
- Cut tool severs intersected rope links while retaining all physical nodes, mass and existing knots. Size selector chooses short, medium or long rope stock (6/10/16 nodes). Capacity checks account for chosen length. Syntax checked; browser tests pending.

## 0.1.9
- Drill tool creates a polygonal opening using convex compound collision parts and recovers removed material as a separate plug. Size controls hole radius. Supports free convex bodies; compound shapes saved. 2D approximation, syntax checked; browser tests pending.

## 0.2.0
- Pin stock in three radii; Insert tool places a nearby fitting circular piece into a newly drilled opening, checking clearance and collision. No hinge constraint added. Hole metadata persists. Recovered plugs placed outside original outline. Syntax checked; browser tests pending.

## 0.2.1
- Material-dependent impact fracture for convex solids, mass-preserving fragments, inherited motion and removal of connections on fractured bodies. Rope links fail after sustained excessive extension. Thresholds are approximate gameplay values, not calibrated engineering data. Syntax checked; browser tests pending.

## 0.2.2
- Steel permanently flattens under sufficiently strong impacts; rubber temporarily compresses and recovers over 350 ms. Convex collision geometry changes with approximately area-preserving compression and lateral expansion; mass retained. Wood and stone retain fracture behavior. Syntax checked; browser tests pending.

## 0.2.3
- Added per-body temperature, contact heat exchange using approximate thermal capacities and conductivity, ambient cooling, heat visualization and temporary hold-to-heat laboratory tool. Hot steel yields more easily. Temperature persists and is inherited by cut, drilled and fractured pieces. Syntax checked; browser tests pending.

## 0.2.4
- Wood and rope ignite above 300°C, burn autonomously, release heat to nearby matter, lose fuel and become ash. Released mass tracked as unmodeled combustion gases; burning state and fuel saved. Animated flames follow burning bodies. Simplified combustion model; syntax checked, browser tests pending.

## 0.2.5
- Added water stock as low-friction colliding particles with weak cohesion, thermal capacity, contact cooling and evaporation. Water can cool combustible matter below extinction threshold; evaporated mass tracked separately. Water state persists. Approximate particle model, not incompressible fluid dynamics. Syntax checked; browser tests pending.

## 0.2.6
- Added ice particles, freezing and melting, rising vapor parcels with mass-preserving condensation, and temporary cooling tool. Phase and vapor parcels persist. Condensation threshold and vapor motion are simplified; ice particles do not yet fuse into rigid blocks. Syntax checked; browser tests pending.

## 0.2.7
- Added 12×16 atmospheric grid with local temperature, approximate buoyant currents, adjustable wind, drag, humidity proxy and atmospheric visualization. Vapor responds to air currents and local temperature; humidity influences condensation. Air state persists. Simplified model, not full gas dynamics. Syntax checked; browser tests pending.

## 0.2.8
- Continuous eight-minute simulated day, solar position, day/night illumination, ambient thermal cycle and approximate direct solar heating with ray-based obstruction. Time persists and advances only during simulation. Decorative night moon, not astronomical lunar simulation. Syntax checked; browser tests pending.

## 0.2.9
- Optional finite ground with 48 cells across soil, sand, clay and stone strata. Dig exposed cells to convert static ground into dynamic chunks with corresponding density, friction and mass. Excavations persist; reset clears ground. Ground cannot be regenerated without reset. Granular behavior and unsupported-ground collapse are not yet modeled. Syntax checked; browser tests pending.

## 0.3.0
- Soil and sand excavation releases mass-preserving polygonal grains with friction and low restitution. Exposed side faces can be excavated. Unsupported granular deposits collapse into particles under downward gravity, subject to the 100-dynamic-body budget. Grain metadata persists. Clay and stone remain chunks. Syntax checked; browser tests pending.

## 0.3.1
- Earth absorbs nearby water particles, gains mass and darkens; wet grains form temporary cohesive bonds. Moist clay yields under impact; drying transfers moisture into vapor parcels; sufficiently dry clay fired above 600°C for three seconds becomes ceramic. Moisture and firing state persist. Approximate model; syntax checked, browser tests pending.

## 0.3.2
- Plant seeds on soil; plants absorb nearby liquid water, grow physical trunk and branch segments under suitable sunlight and air temperature, release water vapor, and can be harvested into dynamic wood. Growth persists. Biomass carbon uptake and root mechanics not yet simulated; seed placement is a laboratory tool. Syntax checked; browser tests pending.

## 0.3.3
- Mature plants disperse seeds carried by wind; seeds landing on suitable unoccupied soil can germinate. Plants age, die after 600 simulation seconds or loss of soil, and decompose progressively, returning an approximate nutrient quantity to soil. Growth consumes fertility; seeds, fertility and ageing persist. Population capped at six plants and 24 airborne seeds. Nutrients are a proxy, not a closed chemical mass balance. Syntax checked; browser tests pending.

## 0.4.0
- Optional human mode with a colliding upright body, force-based walking, grounded step/jump, animated limbs, touch controls and limited reach and lifting mass. Grasp uses a compliant physical constraint; release drops the object. Human position persists. Laboratory tools remain available; articulated balance and bodily tool use are future work. Syntax checked; browser tests pending.

## 0.4.1
- Human torso, head, arms, thighs and shins are separate colliding bodies connected by compliant joints. Torque-based posture and gait controller, physical arm grasp, and torso force assistance. Internal self-collision disabled for stability. Saved torso position reconstructs anatomy; full pose persistence and realistic balance remain future work. Syntax checked; browser tests pending.

## 0.4.2
- Added physical forearms and hands, elbow and wrist constraints, independent left/right grasp selection, touch-directed reach and approximate arm inverse kinematics with torque control. Both hands may hold separate objects or the same object. Selected hand releases independently. Grasp mass and reach are limited; collisions transmit physical forces. Syntax checked; browser tests pending.

## 0.4.3
- Human stabilization: upright torso, lower bounded joint torque, additional solver iterations, corrected limb starting positions, individual leg contact detection, safe spawn height and visible controls. Syntax checked; device behavior not yet verified.

## 0.4.4
- New and reset worlds start with a centered human and no spawned objects. Existing saved objects are preserved until reset. Human automatically enabled on load. Large horizontal analog touch pad with variable speed, release-to-stop, keyboard arrows and assisted ground locomotion. Syntax checked; device tests pending.

## 0.4.5
- Replaced unstable load-bearing ragdoll legs with an upright collision body and controlled articulated stepping animation driven by movement speed. Legs are positioned kinematically and do not independently collide; arms retain physical articulation. Ground detection uses the upright body footprint. Syntax checked; device tests pending.

## 0.4.6
- Disable text selection, touch callouts, context menus, drag selection and overscroll in the game; retain normal button activation and joystick pointer events. Syntax checked; iPad Safari verification pending.

## 0.4.7
- Suppress Safari gesture zoom, multi-touch scrolling and double-tap zoom on game controls while preserving repeated button activation. Syntax checked; iPad verification pending.

## 0.4.8
- Human collision damage based on incoming mass and relative normal speed, increased head vulnerability, stun, involuntary release, severe-impact collapse and death. Health indicator and saved injury state. Reset or toggle human to restart. Approximate injury model; syntax checked, device tests pending.

## 0.4.9
- Human-first interface: laboratory hidden behind Tools, joystick and Release remain visible, automatic hand selection, touch grasp and bounded drag reach, automatic carrying posture after touch release. Manual hand and jump controls hidden. Syntax checked; device tests pending.

## 0.5.0
- Two-axis joystick, upward and diagonal climbing near substantial physical surfaces, assisted ascent and alternating limb reach, release to stop climbing. Syntax checked; device testing pending.

## 0.5.1
- Allow ordinary boxes as climbing targets, detect low obstacles, retain target through ledge transition, approach side and move onto top; exclude boundary walls. Syntax checked; gameplay verification pending.

## 0.5.2
- Downward joystick crouches, reduced collision height and speed, overhead clearance required to stand, assisted small steps, automatic recovery after nonfatal incapacitation when stationary and clear. Syntax checked; gameplay verification pending.

## 0.5.3
- Automatic two-handed grasp for wide or heavy objects, compliant heavy-object grips, bounded push/pull assistance and weight-dependent walking speed. Heavy objects receive no direct lifting assistance. Syntax checked; gameplay verification pending.

## 0.6.0
- New 3600-unit landscape with rolling layered terrain, six mature trees, scattered physical stones, dawn start, following camera and world-coordinate touch mapping. Separate landscape save preserves old laboratory save. Syntax checked; browser verification pending.

## 0.6.1
- Fix standing clearance using actual collision geometry in the newly occupied overhead space, preserve foot height during posture changes and add joystick hysteresis. Syntax checked; device verification pending.

## 0.6.2
- Standing trees no longer collide with human limbs or torso, obstruct standing, or trigger automatic stepping/climbing. Trees retain collision with other matter; harvested wood remains solid. Syntax checked; gameplay verification pending.

## 0.6.3
- Add layered parallax hills, grass along existing soil surfaces, scattered flowers and varied tree canopies with gentle animated sway. Existing physical terrain and saves unchanged. Syntax checked; visual/device verification pending.

## 0.6.4
- Restore infinite torso inertia after posture scaling, enforce upright orientation during conscious locomotion, preserve feet and suppress low-speed crouch impact damage. Syntax checked; gameplay verification pending.

## 0.6.5
- Anticipatory automatic stepping over low stones and terrain ledges up to 28 units, with full-body collision clearance. Larger obstacles retain climbing mechanics. Syntax checked; gameplay verification pending.

## 0.6.6
- Atmospheric sky gradients, dawn/dusk horizon warmth, drifting clouds and night stars. Preserve existing world and physics. Long-term direction: persistent shared natural world with organic encounters; prioritize autonomous environmental richness before multiplayer. Syntax checked; visual verification pending.

## 0.6.7
- Small slow-moving ground objects no longer block human locomotion; retain collisions with other matter and restore human collision for airborne or held objects. Exclude bypassed debris from foot support and step assistance. Syntax checked; gameplay verification pending.

## 0.6.8
- Deterministic regional vegetation variation: scrub, flowering meadows, rocky patches and distant woodland silhouettes. Decorative features follow existing soil and do not obstruct walking. Existing saves unchanged. Syntax checked; visual verification pending.

## 0.6.9
- Reduce locomotion collider friction, anticipate terrain rises farther ahead, ascend incrementally instead of teleporting up steps, and maintain horizontal walking velocity during ascent. Syntax checked; gameplay verification pending.

## 0.7.0
- Minimal exploration interface, contextual release control, optional synthesized wind and day/night nature calls. Physics lab remains available. Design direction: utopian shared exploration, no hunger, survival obligations, grinding or progression. Syntax checked; audio/device verification pending.

## 0.7.1
- Remove laboratory and sound toggle from the visible exploration interface. Ambient audio starts automatically where permitted, otherwise unlocks on ordinary touch or keyboard interaction. Physics engine retained. Syntax checked; device verification pending.

## 0.7.2
- Autonomous gradual rain cycles, atmospheric dimming, dawn mist and weather-responsive ambient noise. No survival penalties or new controls. Visual weather only; hydrology remains future work. Syntax checked; device verification pending.

## 0.7.3
- Detect natural terrain depressions and render shallow ponds with ripples, daylight-dependent color and temporary rain-related surface changes. Nonblocking visual water; no swimming or hydrology yet. Syntax checked; device verification pending.

## 0.7.4
- Add autonomous nonblocking wildlife: birds, butterflies, hares and pulsing evening fireflies. Activity varies with daylight and rain. No hunting, rewards or controls. Syntax checked; gameplay verification pending.

## 0.7.5
- Expand world width from 3,600 to 10,800 units; append terrain to existing saves, add regional elevation variation, trees and proportional wildlife population. Increase terrain and plant restore limits. Syntax checked; performance/device verification pending.

## 0.7.6
- Clamp pond surface to bank spill elevation, including rain rise, and render water to the deepest basin point instead of a fixed depth. Syntax checked; visual verification pending.

## 0.7.7
- Hide geological block rendering and draw continuous textured earth with a connected grass-colored surface. Preserve physical terrain and saves. Syntax checked; visual verification pending.

## 0.7.8
- Add connected sloped collision surfaces for human locomotion matching the rendered terrain contour; original geological cells remain physical for other objects. Exclude old cells from human stepping and climbing. Syntax checked; gameplay verification pending.

## 0.7.9
- Add slope-following movement assistance and automatic swimming with buoyancy and paddling animation in sufficiently deep ponds. No drowning or new controls. Syntax checked; gameplay verification pending.

## 0.7.10
- Display current version discreetly in the top-right corner.

## 0.7.11
- Horizontal swimming pose with animated strokes and kicks; automatically lift toward shore when moving near pond edges. Syntax checked; gameplay verification pending.

## 0.7.12
- Disable obstructive character collisions while swimming; explicitly transition onto dry bank. Match swimming body proportions, colors and rectangular articulated style to walking character. Syntax checked; gameplay unverified.

## 0.7.13
- Use actual articulated character bodies in swimming, orient torso toward travel, blend rotation and elevation during shoreline exit instead of teleporting. Syntax checked; gameplay unverified.

## 0.7.14
- Analog joystick speed curve from slow walking to running, speed-dependent gait cadence, smoother acceleration. Swimming stroke cadence, elbow flexion, kicks and buoyancy bob respond to input effort. Syntax checked; gameplay unverified.

## 0.7.15
- Continuous phase-driven swimming with connected limb geometry; suspend competing joint stiffness in water and gradually restore on land. Syntax checked; gameplay unverified.

## 0.7.16
- Keep swimming active inside pond regardless of rotated collider depth; latch shore transition and guard constraint metadata. Syntax checked; gameplay unverified.

## 0.7.17
- Determine swimming from local water depth rather than character collider immersion. Walk in shallow water, swim at approximately hip depth, transition back to wading with hysteresis. Syntax checked; gameplay unverified.

## 0.7.18
- Wider joystick dead zone, calm walking across most of the range, gentle running only near full displacement, smoother acceleration and slower swimming. Syntax checked; gameplay unverified.

## 0.7.19
- Acceleration-limited walking, gradual braking and reversal, velocity-driven gait with directional knee flexion, arm swing, torso lean, body bob and subtle stride variation. Terrain following preserves momentum. Syntax checked; gameplay unverified.

## 0.7.20
- Shallow water progressively slows walking and running as immersion increases, using the same terrain depth calculation as swimming. Dry-land movement is unchanged. Syntax and 35 resistance assertions passed; mobile gameplay unverified.

## 0.7.20
- Guard joint metadata on land; remove legacy injury/stun locomotion lock and allow directional movement across brief loss of ground contact. Syntax checked; gameplay unverified.

## 0.7.21
- Restore pre-0.7.19 land propulsion with gradual braking; isolate gait animation errors from movement. Syntax checked; gameplay unverified.

## 0.7.22
- Walking animation uses two-segment inverse kinematics, alternating foot lift and stride trajectories, coordinated head bob and delayed arm swing. Land propulsion unchanged. Syntax checked; gameplay unverified.

## 0.7.23
- Increase maximum jogging speed modestly; blend into a distinct running pose with faster cadence, higher knee lift, bent elbows, forward lean and visual flight phase. Syntax checked; gameplay unverified.

## 0.7.24
- Stronger coordinated shoulder, elbow and wrist animation; smooth time-filtered walk/run blend and stride amplitude, including brief ground-contact changes. Propulsion unchanged. Syntax checked; gameplay unverified.

## 0.7.25
- Reduce and cap running cadence; active damped angular velocity control for free arms, forearms and wrists; posture responds to acceleration and vertical velocity. Preserve gravity and existing propulsion. Syntax checked; gameplay unverified.

## 0.7.26
- Inset joystick, remove health overlay, render connected rounded anatomy with shaped torso, neck, directional face, joint connections and feet using live articulated body positions across locomotion modes. Syntax checked; gameplay unverified.

## 0.7.27
- Replace sinusoidal foot path with distinct stance/swing intervals (62% walking, 38% running), terrain-relative foot targets, heel/toe pitch, slower cadence and revised arm counter-swing. Based on human gait biomechanics (https://journals.physiology.org/doi/full/10.1152/jn.00081.2006). Existing propulsion retained; syntax checked, gameplay unverified.

## 0.7.28
- Anchor stance foot targets in world coordinates, release at swing, add modest physical running push-off impulses under gravity. Retain stable collision controller; syntax checked, gameplay unverified.

## 0.7.29
- Smooth foot target transitions, gradual stance anchor correction, averaged terrain samples and reset gait filters during swimming. Syntax checked; gameplay unverified.

## 0.7.30
- Hide raw anatomy before rendering to prevent duplicate heads. Free arms use continuous connected shoulder/elbow/wrist poses counter to leg stance; restore physical joint constraints for reaching and swimming. Syntax checked; visual testing pending.

## 0.7.31
- Progressive crouch collider height with overhead clearance, blended knee/hip/torso and arm poses, upward joystick flick jump with grounded gate and cooldown, gravity-driven trajectory. Syntax checked; gameplay unverified.

## 0.7.32
- Require recent downward preparation and actual crouch before upward jump flick; extend before takeoff, directional impulse, analog crouch depth and foot-relative crouch IK with rearward pelvis. Syntax checked; gameplay unverified.

## 0.7.33
- Landing compression scales with downward velocity and recovers progressively; crouched locomotion uses alternating short foot trajectories and swing clearance. Syntax checked; gameplay unverified.

## 0.7.34
- Distinct arm balance, preparation backswing, anticipatory takeoff swing, velocity-dependent flight pose and landing recovery. Inspired by DOI 10.1038/s41598-024-70194-z and PMID 18674837. Existing jump impulse unchanged; syntax checked, gameplay unverified.

## 0.7.35
- Impact-scaled landing compression peaks over 130 ms and recovers over 720 ms; increased torso inclination, arm counterbalance and head stabilization. Syntax checked; gameplay unverified.

## 0.7.36
- Longer landing recovery (1.25 s), stronger forward lean, damped torso sway, asymmetric arm and foot balance corrections. Syntax checked; gameplay unverified.

## 0.7.37
- Sample airborne velocity and terrain slope, resolve normal/tangential impact, drive compression and damped balance feedback from impact and ongoing motion; slope-adjusted corrective feet and reduced braking during recovery. Syntax checked; gameplay unverified.

## 0.7.38
- Replace overlapping center-to-center and segment strokes with one connected joint chain per limb; draw far arm behind torso, near arm in front; align head to torso on land and hide all raw anatomy. Syntax checked; gameplay unverified.

## 0.7.39
- Four deterministic climbable rock outcrops near the starting region, heights 65–240 world units, compatible with existing saves. Existing climbing and landing physics reused. Syntax checked; gameplay unverified.

## 0.7.40
- Small loose objects no longer collide with character regardless of vertical motion. Strong normal/tangential landing impacts unlock physical torso rotation and momentum, followed by automatic recovery. No injury penalty. Syntax checked; gameplay unverified.

## 0.7.41
- Impact ragdoll with temporary physical leg constraints, limb collisions and motor-assisted recovery. Reachable cliff ledges attach a temporary pull-up constraint and hand-targeted climbing pose. Syntax checked; gameplay unverified.

## 0.7.42
- Separate ledge pull-up into vertical clearance and horizontal mantle phases; weaken grip during lift and release only once over summit. Syntax checked; gameplay unverified.

## 0.7.43
- Explicit wall climb to ledge handoff; temporarily suspend torso collisions and joint forces during incremental mantle, restore on summit. Syntax checked; gameplay unverified.

## 0.7.44
- Fixed-length two-bone IK for ledge climbing, staggered hand release, bent legs and consistent torso alignment. Damped ragdoll leg joints and angular velocities, reduced recovery motor strength. Syntax checked; gameplay unverified.

## 0.7.45
- Expand four cliff obstacles into 31 varied rock formations, including stepped ascents, narrow gaps and high plateaus. Existing terrain saves retained. Syntax checked; gameplay unverified.

## 0.7.46
- Swimming checks actual immersion and cliff support, yields to climbing, blocks swimming through cliff faces, and permits upward swim-to-climb transition. Syntax checked; gameplay unverified.

## 0.7.47
- Low ledges (13–34 units) trigger assisted hops instead of grabs. Tall cliff ascent uses alternating hand/foot targets, fixed-length IK and phased upward velocity. Holds are procedural, not actual rock geometry. Syntax checked; gameplay unverified.

## 0.7.48
- Replace continuously drifting climbing targets with per-character alternating reach, opposite-foot placement and body transfer phases; smooth mantle movement and later summit handoff. Procedural contacts and assisted body motion remain. Syntax checked; gameplay unverified.

## 0.7.49
- Add deterministic visible cliff hold points, select reachable targets per climbing cycle and vary rise distance. Holds are terrain metadata, not separate collision bodies; ascent remains assisted. Syntax checked; gameplay unverified.

## 0.7.50
- Stable mantle target, summit regrab prevention, restored joint stiffness and collision masks, and 3.5-second mantle fallback. Syntax checked; gameplay unverified.

## 0.7.51
- Prioritize actual summit support over swimming and climbing, clear stale movement state, use cliff-aware foot targets, disable soil slope correction on rock tops and account for overlapping cliffs at mantle exit. Syntax checked; gameplay unverified.

## 0.7.52
- Cancel gravity during controlled mantle, allow 1.5-unit phase transition tolerance, and align head throughout pull-up to avoid waiting at summit edge. Syntax checked; gameplay unverified.

## 0.7.53
- Track actual collider height independently of velocity-expanded bounds; continuous foot support probe and brief support hysteresis; full crouch to 44 units; suppress automatic hops while crouching. Syntax checked; gameplay unverified.

## 0.7.54
- Running engages directly above 76% horizontal joystick input with rapid gait blend and acceleration; preserve smooth stopping. Increase climbing cycle rate by 27% and upward tracking speed. Syntax checked; gameplay unverified.

## 0.7.55
- Automatically initiate short mantle for grounded forward movement toward 35–70 unit cliff ledges; quicker lift and crossing using existing fixed-length limb animation. Syntax checked; gameplay unverified.

## 0.7.56
- Exclude only the supporting cliff from new grabs; allow adjacent higher cliff climbing from summit and forward input. Syntax checked; gameplay unverified.

## 0.7.57
- Continuous overlapping lift, crossing and standing curves for mantle; blend from initial limb contacts, torso inclination, staggered foot placement and hand release, input-sensitive walking handoff. Assisted trajectory remains; syntax checked, gameplay unverified.

## 0.7.58
- Add eight polygonal rock formations with matching convex collision segments and local slope/foot support queries. Existing vertical cliffs retained. Arbitrary-angle climbing not yet implemented. Syntax checked; gameplay unverified.

## 0.7.59
- Blend uphill gait into slower forward-leaning scrambling, with arm IK toward sampled rock surfaces and shorter strides. Extend slope support assistance. Hands are visual contacts, not weight-bearing constraints. Syntax checked; gameplay unverified.

## 0.7.60
- Irregular slope traversal uses joystick intent even when collision stalls velocity; anticipatory surface sampling, slope clearance and lower rock friction. Scrambling recognizes nearby support. Syntax checked; gameplay unverified.

## 0.7.61
- Require directional intent for ledge grabs and cliff selection, cancel ascent when moving away, and briefly suppress regrabs. Apply direction check to water-to-climb transition. Syntax checked; gameplay unverified.

## 0.7.62
- Separate player slope contact from polygon collision response; continuous surface tracking with arc-length speed, grounded support and jump release. Other objects retain rock collisions. Exclude slope segments from rectangular climbing selection. Syntax checked; gameplay unverified.

## 0.7.63
- Stabilize swimming immersion and support checks, cancel blocked/reversed shore exits, retain water level during exit, guard reentry after climbing or shore exit, clear stale fall and slope state. Syntax checked; gameplay unverified.

## 0.7.64
- Allow horizontal swimming across cliff silhouettes; upward input near a cliff edge initiates climbing. Prevent automatic shore exit into rock. Climbing still uses existing edge-based system, not arbitrary face contacts. Syntax checked; gameplay unverified.

## 0.7.65
- Require near-vertical upward input for swimming-to-climbing. Allow shallow-water exit in front of background cliffs and retain foreground collision layer until leaving cliff footprint or deliberately climbing. Syntax checked; gameplay unverified.

## 0.7.66
- Require raw joystick horizontal displacement below .065 and upward displacement above .85 for climb initiation on land and water. Foreground walking by default away from summit. Exit swimming based on local depth rather than arrival at shore waypoint; restore upright collider and foreground mask immediately. Syntax checked; gameplay unverified.

## 0.7.67
- Apply foreground cliff exclusion to all anatomy collision masks and ground queries; recover excessively displaced limbs. Syntax checked; gameplay unverified.

## 0.7.68
- Summit detection uses actual crouched collider height. Hold crouch near edge for 850 ms before assisted descent; shorter crouches preserve summit support. Syntax checked; gameplay unverified.

## 0.7.69
- Sustained edge crouch initiates assisted lowering and descending hand/foot cycle instead of falling. Add bounded climb cycle wait and head pose update. Syntax checked; gameplay unverified.

## 0.7.70
- Lock facing to selected cliff side during climb, prevent joystick from flipping pose, compensate gravity and exclude cliff collision during assisted climbing. Bound stalled cycle target recovery. Syntax checked; gameplay unverified.

## 0.7.71
- Expand sustained crouch descent activation from 18 to 42 world units, capped at half summit width. Preserve 850 ms hold. Syntax checked; gameplay unverified.

## 0.7.72
- Retain vertical cliff grip on neutral input and minor horizontal deviations. Release only on outward raw horizontal input above 78%, vertical deviation below 40%, held 180 ms. Pause upward cycle on neutral. Syntax checked; gameplay unverified.

## 0.7.73
- Protect crouching and standing recovery near summit edges with a 10-unit inward support margin and 12-unit edge detection tolerance; disable protection during jump. Preserve deliberate descent hold. Syntax checked; gameplay unverified.

## 0.7.74
- Reduce edge crouch hold from 850 to 500 ms; preserve edge protection and jump preparation. Syntax checked; gameplay unverified.

## 0.7.75
- Prevent generic ledge acquisition interrupting active climbing. Require torso within 9 units of lip and both hands near lip before mantle; clamp final ascent target and hand targets. Blend entry velocity and initial hand contacts into pull-up. Syntax checked; gameplay unverified.

## 0.7.76
- Replace generic gait during descent entry with staged hand reach, torso inclination, staggered leg lowering and gradual collider extension. Seed descending cycle from final limb contacts. Syntax checked; gameplay unverified.

## 0.7.77
- Allow vertical joystick reversal between ascent and descent on a cliff, preserving current limb contact heights. Neutral pauses either direction. Syntax checked; gameplay unverified.

## 0.7.78
- Add four scenic animated waterfalls, falling water streaks, spray and terrain-following stream traces. Visual prototype only; no fluid transport or collision changes. Syntax checked; gameplay unverified.

## 0.7.79
- Isolate jump charging and triggering from climbing, ledge grip and descent entry so reversing vertical joystick direction does not queue a jump. Syntax and 12 input assertions passed; browser gameplay unverified.

## 0.7.79
- Detect nearby vertical cliff faces during deliberate airborne jumps and moving toward the face; catch and enter persistent climbing grip. Preserve foreground walking and swimming. Syntax checked; gameplay unverified.

## 0.7.80
- Add upward-diagonal assisted step mantles for 8–70 unit rises within 32 units, including adjacent cliff summits. Use faster existing articulated mantle without full climbing mode; horizontal foreground travel unchanged. Syntax checked; gameplay unverified.

## 0.7.81
- Assist horizontal and downward-diagonal descent from low terraces (4–70 unit drops), with eased body trajectory and landing flex. Preserve deliberate descent on tall cliffs. Syntax checked; gameplay unverified.

## 0.7.82
- Add wall jump preparation with down input and upward-outward flick within 650 ms. Compress climbing pose, launch away and catch a different cliff using airborne grab. Sustained down input resumes descent. Syntax checked; gameplay unverified.

## 0.7.83
- Widen wall jump preparation and diagonal launch thresholds; extend gesture window to 1100 ms and prevent accidental release during preparation. Syntax checked; gameplay unverified.

## 0.7.84
- Require downward diagonal toward wall to charge jump, followed by upward diagonal away. Vertical down immediately selects descent. Increase visible compression of torso and legs. Syntax checked; gameplay unverified.

## 0.7.85
- Introduce deterministic blended regional terrain profiles, quieter meadows and clustered cliff formations. New landscape save key preserves old save separately and starts new geography. Syntax checked; gameplay unverified.

## 0.7.86
- Clip buried cliff faces, restore foreground trees and show waterfall source.
## 0.7.87
- Generate deterministic asymmetric rock profiles with fourteen segments, local terrain anchoring and continuous strata. Existing soil saves retained; rock geometry changes. Syntax checked; gameplay unverified.

## 0.7.88
- Broaden irregular rock formations and cluster overlapping ridges in three regions. Add subtle terraced profile variation and reduce random surface roughness. Preserve soil save. Syntax checked; gameplay unverified.

## 0.7.89
- Introduce common geological edge representation for cliff faces, summits and irregular rock segments, including tangent, outward normal, inclination and nearest contact queries. Route existing rock support through shared queries while retaining legacy movement behavior. Syntax checked; gameplay unverified.

## 0.7.90
- Use common support queries for gait on soil, summits and irregular rock. Blend current and upcoming grade, adapt scramble on ascent and descent, and select reachable geological hand contacts. Legacy climbing and terrain generation retained. Syntax checked; gameplay unverified.

## 0.7.91
- Prototype climbing on irregular rock segments steeper than 60 degrees using shared surface tangents, normals and reachable limb targets. Follow connected steep segments; release or exit at endpoints. Legacy cliff climbing retained. Syntax checked; gameplay unverified.

## 0.7.92
- Ease body tracking between inclined rock segments and replace endpoint snap with timed ascent/descent transition onto nearby support. Suspend rock tracking during transition and resume afterward. Syntax checked; gameplay unverified.

## 0.7.93
- Replace rectangular cliffs at x1750 and x4500 with continuous asymmetric profiles combining slopes, steep faces and terraces. Reuse shared geological contact and inclined climbing systems. Other cliffs and soil saves retained. Syntax checked; gameplay unverified.

## 0.9.6
- Index static geological edges in 128-unit horizontal buckets to reduce repeated contact-search work on mobile. Preserve contact geometry; 1,000 synthetic equivalence checks and syntax validation passed. Browser gameplay unverified.

## 0.10.1
- Calculate wading resistance from the same solid terrain surface and water level used by swimming, so exposed rocks above ponds do not slow walking. JavaScript syntax and 90 targeted assertions passed; browser gameplay unverified.

## 0.10.4
- Expand the deterministic landscape east from 10,800 to 18,720 units. A lake basin leads into mixed woodland and conifer foothills, an exposed ridge, and open heath. Elevation, moisture, slope, and rock exposure shape plant cover and tree mix. New ridges use the same collision and climbing profile as the original terrain.
- Extend existing terrain saves in place and record the generated extent so removed edge terrain stays removed. Use the expanded bounds for shared positions and tree events.
- Index rock spans for surface-height queries and remove a premature startup reset that ran before character initialization.
- Verified in Chromium with a mobile viewport and Matter.js: coherent terrain join, lake and ridge profiles, biome distribution, camera tracking, deterministic reset, and old-save migration with preserved terrain edits. JavaScript syntax and diff checks passed. WebKit and live multiplayer were not tested.

## 0.10.5
- Add an experimental solo Watershed world, selectable from the game and the shared-world entry screen. A seeded 195 by 97 regional map generates landforms, rain, drainage, and vegetation before sampling the playable side-on terrain. The slope profile drives the existing walking and climbing physics. Water includes coastal shallows, river crossings, and lake basins.
- Keep existing worlds available. Watershed saves and tree cuts are stored separately per seed. Use the seed query parameter to explore a different region.
- Verified seed repeatability, drainage, biome variety, and dry starts across five seeds. Tested world navigation, terrain and water rendering, and save isolation in mobile-sized Chromium with Matter.js. Safari was not tested.

## 0.10.6
- Clip standing water to the painted slope and lower Watershed river surfaces to their local banks where needed, removing abrupt vertical edges inside riverbeds.
- Extend the soil fill below the visible floor in tall viewports while retaining the collision boundary.
- Checked JavaScript syntax and shoreline geometry with four generated seeds, including two-bank crossings and dry islands. Device rendering was not tested.

## 0.11.0
- Open directly into one continuous side-on world based on the coastal and alpine concept sketch. A single rocky island sits in the western ocean. The mainland crosses dunes, reed marsh, broadleaf woodland, conifer slopes, the alpine ridge, and a dry steppe with a salt lake.
- Generate nearby terrain, geological contacts, scenery, and wildlife as the player moves. Keep excavation edits and position in a new save while leaving prior save data in place. This release uses local play because the previous shared coordinates belong to different geography.
- Verified seeded terrain over three seeds. Mobile-viewport Chromium with Matter.js completed the entire mainland crossing in about 59 simulated minutes and verified streaming, excavation persistence, reload position, and island and lake terrain. Safari was not tested.

## 0.11.1
- Add a temporary 3× travel mode via `?speed=3` for testing the mainland. Walking, wading, and swimming go faster. Both speeds use the same world save.
- Verified the complete accelerated mainland crossing in mobile-sized Chromium with Matter.js in about 20 simulated minutes.

## 0.11.2
- Shrink the world to 59,520 units, one fifth of its previous width. Keep its offshore island and all major mainland regions. Alternate broadleaf forest with open meadow and add more frequent local changes in relief.
- Start a separate save for the new geography. Previous saves remain stored.
- Ran generator assertions across three seeds and checked inline script syntax. Browser traversal was not tested.

## 0.11.3
- Give each biome distinct vegetation. Dune grass, tidal eelgrass, cattails, woodland ferns, meadow flowers, conifer understory, alpine cushions, dry steppe grasses, salt-tolerant shrubs, and wind-bent island pines use local placement and wind sway.
- Add smoothly blended local relief, including dunes, marsh hummocks, wooded rises, mountain shoulders, and steppe terraces. Keep the world's dimensions and save key. Move a restored character clear of the ground if the new relief covers their saved position.
- Generator assertions passed across three seeds. Mobile-sized Chromium rendered all ten environments, restored position and excavations, and completed a full mainland crossing at 3× speed. iPad Safari was not tested.

## 0.11.4
- Add snow-covered pines in sheltered alpine stands and increase changes in elevation inside each biome.
- Generate a lake in each land biome, including the island, while retaining the steppe salt lake. Use the exposed geological surface for the lakebed so alpine water follows the actual rock banks.
- Deepen the offshore seabed while keeping shallow approaches to the mainland and island. The release uses the existing save.
- Generator checks passed across three seeds. Mobile Chromium verified all eight new lakes, snowy trees, a complete mainland crossing, and a swim from the mainland to the island. Safari was not tested.

## 0.11.5
- Replace repeated ridges with seeded terrain at several scales. The western conifer forest rises steadily into a much taller snowy range with two summits and a saddle. The conifer lake sits on the eastern descent.
- Widen the ocean, deepen offshore water, and enlarge the island. The reshaped world starts a fresh save.
- Passed three-seed generator checks and a mobile Chromium crossing over the snowy summits and an ocean swim to the island. Safari was not tested.

## 0.11.6
- Add scattered trees on stable ground in the dunes, marsh, meadow and steppe. The uppermost alpine rock remains above the treeline.
- Increase the width and depth of all eight biome lakes and enlarge the salt lake. Blend the wider banks back into the surrounding terrain.
- Generator checks passed across three seeds. Mobile Chromium verified trees in the four previously excluded biomes and completed the mainland crossing through the enlarged lakes.

## 0.11.7
- Add optional 5× exploration via `?speed=5` using the existing world save.
- Verified JavaScript syntax and speed selection for normal, 3×, 5×, and unsupported values. Browser traversal was not tested.

## 0.11.8 — Tropical shores and mountain lakes
- Extended the western ocean, replaced the island lake with sandy palm habitat, and shaped dunes on the mainland beach.
- Increased the western conifer climb, extended the eastern forest and froze the alpine lake into a walkable surface. Widened and deepened the salt basin.
- Started a fresh world layout. Three-seed terrain checks and inline JavaScript syntax checks passed.

## 0.11.9 — Beach sand in cross-section
- Render deep, grain-textured sand beneath dunes and palms and taper the deposit offshore and inland.
- Three-seed world checks, beach-depth checks and inline script syntax passed.

## 0.11.10 — Continuous beach slopes
- Draw the sand deposit as continuous contours and follow the ground slope with the surface trim and grass.
- Interpolate ground height between adjoining soil cells so walking and wading do not encounter artificial steps. The update uses the existing world save.
- Inline JavaScript syntax and Matter.js simulation checks passed. The simulation crossed both island shores and the mainland shoreline at 1× and 5× using a mocked DOM and canvas. Browser rendering and Safari touch controls were not tested.

## 0.11.11 — Shared world on the current map
- Add entry and exit controls for shared play on the same terrain as solo. Ask for the traveller’s name on entry and show online presence after the channel reports it.
- Load terrain around a restored multiplayer checkpoint before positioning the character. Preserve the existing solo and shared saves.
- Checked JavaScript syntax, mode navigation, name submission and simulated two-player presence. The existing shared forest API responded to read requests. Live two-device gameplay was not tested.

## 0.11.12 — Default shared world and common spawn
- Open the shared world by default and keep solo play available through Play solo.
- Place every shared arrival at the same mainland spawn after name entry. Saved character coordinates no longer determine the entry location.
- JavaScript syntax and simulated mode navigation, shared spawn with an old character save, name entry and online presence passed. Physical devices were not tested.

## 0.11.13 — Shared player visibility
- Validate incoming player positions against the current map bounds. The old horizontal cutoff discarded updates at the mainland spawn and farther east.
- Stack nearby name labels when players overlap.
- JavaScript checks and simulated incoming pose, out-of-bounds rejection, overlapping labels and online presence passed. Live two-device gameplay was not tested.

## 0.11.14 — Shared tree falls
- Broadcast a completed chop as soon as the tree falls and save the event independently. Keep the trunk pose in shared history and apply events when their terrain streams in.
- Simulated shared fall, trunk creation, duplicate suppression and broadcasting while a database save was pending. Live two-device gameplay was not tested.

## 0.11.15 — Shared carrying visuals
- Send carried branch counts in player updates and accept palm logs and planks on receiving clients. Attach carried wood to the remote character’s hand.
- Simulated sending and receiving carry updates, drawing branches and clearing the branch count. Physical devices were not tested.

## 0.11.16 — Smoother shared movement
- Send moving player poses up to ten times per second. Interpolate remote limbs and body positions on a 125 ms buffer, following the shortest rotation between poses.
- Verified simulated pose delivery, remote carry rendering, interpolation across irregular intervals, angle wrapping and movement after an idle gap. Physical devices were not tested.

## 0.11.17 — Shared world only
- Remove the Play solo button. The official link and old mode-specific URLs open the current shared map.
- Verified shared startup, name entry and simulated presence for the official link and both legacy mode URLs.

## 0.11.18 — Shared action timing
- Buffer remote carry, facing and tool state alongside each body pose, so visible objects and actions change on the same playback timeline rather than ahead of the character.
- Inline JavaScript syntax and 700 simulated timeline checks passed. Live shared multiplayer and mobile browser tests unverified.


## 0.11.19
- Replace generic distant hills with three biome-aware regional landscape layers, using official shared-world elevation, water levels, vegetation and daylight. Stable world-space parallax; no physics or persistence changes.
- Mock drawing checks exercised all ten biome palettes in the initial renderer; final browser rendering and live multiplayer visual checks unverified.

- Added opt-in `?speed=15` exploration speed; normal speed unchanged. Parameter checks passed; high-speed physics and live browser behavior unverified.


## 0.11.20
- Independent two-dimensional scenic noise field replaces mirrored playable elevation. Regional biome classifications guide relief and vegetation; depth slices generate distinct ridges, coastal hills and offshore islands. Playable map and persistence unchanged.
- 1494 deterministic elevation-independence and finite-value sample checks passed (mock regional world); browser visuals and multiplayer not verified.


## 0.11.21
- Scenic layers gain depth-dependent haze, vertical shading, water glints, alpine snow and rock facets, curved palms, layered conifers and irregular deciduous crowns. Reuse sampled points within each frame. No gameplay changes.
- 36 mock canvas frames passed finite-coordinate checks; actual browser visuals and mobile performance unverified.


## 0.11.22
- Altitude-dependent patchy snow tint for terrain and pine foliage; blended coastal soil and background biome palettes; soften alpine snow facets. Existing physical world and tree population unchanged. Browser rendering unverified.


## 0.11.23
- Extend world east by 27,000 units to 95,160. Add arid steppe, dune sea, two oasis basins and sandstone mountains with desert palettes and sparse vegetation. Preserve original lake search extent and coastal rendering extent.
- 2,841 original-world sample comparisons identical; new terrain samples finite; inline JavaScript syntax passed. Live water, persistence, mobile rendering and deployment unverified. Desert-specific weather and deep sand physics deferred.


## 0.11.24
- Expand eastern conifer habitat across descending foothills toward the salt lake, with scattered eastern groves tapering into steppe. Sampled conifer extent 3624 to 4992 units. Preserve existing elevations, water, world width and desert coordinates. 3966 physical sample comparisons and inline syntax checks passed; live rendering and tree persistence unverified.


## 0.11.25
- Insert 5,000 units of new conifer terrain at x=59,000, shifting eastern geography by 5,000 without replacing existing terrain. Total width 100,160. Original sample equivalence and syntax checks passed. Existing persisted entity coordinates east of insertion are not migrated; live deployment unverified.


## 0.11.26
- Grade eastern conifer forest into a long descent comparable to western ascent; retain lake depth and geography outside eastern foothills. Existing object heights not migrated; live rendering and water behavior unverified.


## 0.11.27
- Alpine pines use the same 95–190 base size range as conifer forest pines. Snow, density and tree placement rules unchanged. Inline JavaScript syntax passed; live rendering unverified.


## 0.11.28
- Seeded compact local hills, hollows, banks, gullies and asymmetric outcrops with clustered activity and biome-dependent strength. Protect water, ice and spawn margins; retain regional profile and biome layout. 12521 terrain comparisons passed; inline syntax passed. Saved object elevations, mobile performance, actual collision traversal and live deployment unverified.


## 0.11.29
- Add deterministic level clearings and terraces with smooth shoulders and biome-specific frequency. Preserve water, ice and biome layout. 12521 samples checked; 53 dry flat runs at least 96 units long. Inline syntax passed. Saved object elevations, live collision and deployment unverified.


## 0.11.30
- Visual geology: continuous regional rock palette and folded bedding, biome-sensitive soil and sediment thickness, roots, gravel, fractures and sand lamination. Unified rendering for terrain and rock spans. No physics or terrain changes. Syntax and mock canvas checks passed; actual mobile rendering/performance unverified.


## 0.11.31
- Stable water-body identities derived from the full map; project narrow meandering river and broad lake continuations behind the playable slice, plus a closer vegetation layer. Visual only: width-based river classification, no drainage simulation or current changes. Syntax and mock canvas checks passed; live rendering unverified.


## 0.11.32
- Fix oversized background water projection: cap vertical extent at 8.5% of viewport, constrain far edge below upper landscape, reduce lateral distortion. Perspective guard only; terrain-aware occlusion still pending. Syntax and projection bounds checks passed.


## 0.11.33
- Add 5 deterministic river crossings with explicit waterKind, distinct background shape and faster directional surface ripples. Preserve existing lakes and ice. 12521 terrain checks and syntax passed. No physical current or connected drainage simulation; saved objects and live rendering unverified.


## 0.11.34
- River depths +85%, other unfrozen inland water depths +35%; preserve shoreline and level. Taper distant rivers, fade far edge and add subtle bank contours. 25041 terrain checks and syntax passed. Live visuals and saved submerged objects unverified.


## 0.11.35
- Incised river channels and substantially deeper lake basins, distinct receding river and broad lake projections, different palettes and ripples. 25041 terrain comparisons and syntax passed. Live rendering and swimming unverified.


## 0.11.36
- Fix camera-height clipping that suppressed background water; remove camera-center lateral drift, extend visible water and add bank vegetation. Projection bounds and syntax checked. Still a projected near landscape, not a full hydrological elevation field; live visuals unverified.


## 0.11.37
- Shared near terrain/water mesh with exclusive basin ownership, depth-ordered rendering and opaque underwater base. Playable terrain unchanged. Syntax and mock mesh tests passed; mobile visuals and performance unverified. Distant ridges remain separate.


## 0.11.38
- Finer near mesh, reduced facet contrast and seam coverage, conifer silhouettes, finite lake basins with raised far banks. Playable terrain unchanged. Syntax and mock geography/render checks passed; live visuals and mobile performance unverified.


## 0.11.39
- Cache near geography on a fixed world grid, reduce sampling resolution, batch same-colour terrain into continuous strips and remove per-facet shading. Syntax and mock rendering passed. Riverbank clipping and curved shorelines still pending; mobile FPS unverified.


## 0.11.40
- Sample basin contours at four-unit intervals and extend to adjacent terrain centers. Draw opaque water backing before local character, translucent tint and ripples afterward. Syntax and shore intersection test passed; live clipping and remote swimmer tint unverified.


## 0.11.41
- Render near-background inland water using cached analytical basin boundaries and quadratic curves, preserving depth ordering and mesh resolution. Playable geography unchanged. Syntax and mock curve rendering passed; live occlusion and FPS unverified.


## 0.11.42
- Share one continuous gradient per background water body and overlap internal curved strip edges to hide antialiasing seams while retaining terrain occlusion. Playable terrain and swimmer rendering unchanged. Syntax and mock gradient/curve tests passed; live visuals and FPS unverified.


## 0.11.43
- Preserve frozen basin depth separately from walkable ice collision surface. Render ice and underwater cross-section, tint background ice pale blue. Existing collision and wet flags unchanged. Sample equivalence and syntax passed; mobile visuals unverified.


## 0.11.44
- Restore local character checkpoint on shared-world join, stream destination terrain before moving character, and use safe ground or water surface height. First-time spawn unchanged. Syntax checked; live reload unverified.


## 0.11.45
- Double island and mainland beach spans by inserting 4428 world units. Preserve inland geography and ocean spans. No inland island water. Saved entity coordinates not migrated; live visuals unverified.


## 0.11.46
- Tropical island central mountain, dense mixed broadleaf/palm canopy, sandy coastal margins; remove mainland coastal lake. World width unchanged. Terrain sampling and syntax passed; live visuals and existing object elevations unverified.


## 0.11.47
- Ocean-only procedural swells with shared epoch, variable amplitude, seabed-clipped shoreline and shallow foam. Depth gradient. Physics and background waves unchanged; mock render and syntax checked.


## 0.11.48
- Swimming follows ocean wave height with bounded drift and tilt; wading responds to moving surface. Lakes unchanged. Syntax and numerical tests passed; live physics and floating objects not yet verified/implemented.


## 0.11.49
- Animated perspective-scaled ocean crests in near scenic geography, clipped to sea strips; distant sea glints move. Syntax and mock rendering passed; device visuals unverified.


## 0.11.50
- Extend near scenic ocean 36 units behind foreground wave troughs, only across sea cells, to eliminate exposed background seam. Wave physics unchanged. Syntax and amplitude bound checked; live visual verification pending.


## 0.11.51
- Free logs in sea render at deterministic wave surface with tilt; persistent positions unchanged (visual buoyancy only). More dispersed shallow crest foam and proximity-modulated procedural surf audio. Existing background overlap retained. Syntax and numerical checks passed; live audio and visuals unverified.


## 0.11.52
- Add destination-over ocean seam backing using playable sea banks rather than scenic samples, before distant ridges. Syntax and shoreline coverage test passed; device visual verification pending.


## 0.11.53
- Loose planks and branches use the same deterministic visual ocean buoyancy as logs; carried items and piles retain existing poses. No persistent drift or pickup changes. Syntax checked; device rendering pending.


## 0.11.54
- Grouped broad ocean swells with smaller ripples, irregular scenic crest spacing/length/opacity, surface sheen and wider foam dispersion. Shared wave function retained. Syntax and amplitude checks passed; live visual verification pending.


## 0.11.55
- Depth-dependent crest asymmetry and ripple attenuation, deterministic recent-wave wet sand shading, shoreline foam and stronger shallow crest highlights. Approximate shoaling, not fluid simulation or variable propagation speed. Syntax and numerical checks passed; live rendering pending.


## 0.11.56
- Coordinated breaststroke cycle and stroke-driven propulsion, drag, relaxed floating posture, damped vertical buoyancy and averaged wave surface. All swimmable waters. Syntax and numerical propulsion tests passed; live animation, remote pose and shore transitions unverified.


## 0.11.57
- Predict descending deep-water landings, blend into streamlined dive pose, retain entry momentum and briefly submerge before resurfacing. Minimum dive depth 70 units. Syntax checked; live pose and entry transitions unverified.


## 0.11.58
- Allow descending backflips to enter deep water, retain entry orientation and translational momentum, and recover swimming posture along shortest angular arc. Syntax checked; live animation pending.


## 0.11.59
- Underwater swimming with vertical joystick input, stroke-driven vertical thrust, drag, passive resurfacing, directional posture and seabed bounds. No oxygen limit. Syntax and simplified vertical dynamics checks passed; live controls and remote rendering unverified.


## 0.11.60
- Impact-scaled splash droplets and synthesized sound, stroke-triggered surface splashes, underwater bubbles and head-submersion ambient lowpass with hysteresis. Local effects only; syntax checked, live audio and rendering pending.


## 0.11.61
- Route surf and environmental action sounds through the underwater acoustic filter as well. Syntax checked.


## 0.11.62
- Render scenic standing and falling trees before local player, preserving water overlay and tool effects. Syntax and layer order checks passed.


## 0.11.63
- Add clipped depth-dependent underwater attenuation, subtle animated sunlight shafts and world-anchored suspended particles in oceans and freshwater. Syntax and mock canvas checks passed; device visuals pending.


## 0.11.64
- Shared world solar time and season derive from a common UTC epoch, independent of session start, frame rate and travel speed. Retains 480-second day and existing seasonal rate. Device clock accuracy required; weather remains separate. Syntax and 2000 clock checks passed.


## 0.11.65
- Deterministic shared regional weather from UTC epoch, world position and terrain elevation. Rain, clouds, wind and estimated recent rainfall soil wetness no longer depend on session duration. Preserve underwater wind muffling. Syntax and 3000 deterministic weather checks passed; device clocks and live testing limitations remain.
