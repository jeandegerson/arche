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
