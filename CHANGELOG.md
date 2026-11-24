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
