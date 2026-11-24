# Changelog

## 0.0.2 — 2026-11-24 (proposed)
- Added Earth, Moon, zero and reverse gravity modes for experimentation with physical interactions.
- Fixed viewport resizing to remove each old boundary individually before adding replacements, avoiding stale collision walls.
- Tests: Node.js 22 mock-engine checks passed for all four gravity transitions, labels, dynamic-body wake calls and removal of four previous walls on resize. These checks exercised copied source functions, not the complete browser application.
- Actual Matter.js integration, browser rendering and mobile touch tests were not run (Matter.js unavailable in local test environment). Leave for review; do not merge until integration is verified.
