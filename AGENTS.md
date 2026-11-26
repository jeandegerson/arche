# Archē
A mobile-first, self-evolving physics sandbox.

## Development rules
- Choose one meaningful incremental improvement per cycle, based on the actual latest source.
- Prioritize physical coherence, emergent interactions, touch usability, visual clarity and performance.
- Preserve existing features and compatibility with any saved state.
- Do not add paid services, credentials, tracking, or external infrastructure without approval.
- Work on a separate branch; run relevant tests before proposing a pull request. Never claim tests passed if they were not run. Do not merge untested changes.
- Avoid overlapping work: if an earlier autonomous pull request is pending, review its status rather than duplicating it.
- Record changes, rationale, test results and version in CHANGELOG.md.
- Skip a cycle if no safe meaningful improvement is possible.

## Development journal

- When a user-provided screenshot shows a bug and the fix has shipped, publish one short field note in the [Archē website journal](https://jeandegerson.github.io/arche/website/journal.html). Add it to the field notes, newest first. Give each note a playful, strange, or poetic title while explaining the fix plainly.
- Include a title, local date and time in Europe/Zurich, the game version, a small crop of the original screenshot with alt text, and one or two short paragraphs explaining the visible problem and what players will see after the fix. Crop out names and browser chrome wherever feasible.
- Update the official website in `website/` in this repository. Keep its latest entry linked from the home page. Preserve the landing page, archive, images, access settings and previous entries. Check whether an entry already exists for the same report, and verify the published entry and image before reporting completion.
