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
