# Portfolio

A personal portfolio site with a persistent Three.js backdrop: a real
photograph, layered with a distant starfield and a nearer firefly swarm at
different depths, occasional shooting stars, and a mouse/scroll/idle-driven
camera that swings enough to make the depth layers actually visible. No
frameworks beyond Vite — just ES modules.

## Running it

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # production build to dist/
```

## How it's put together

```
index.html              Page markup + section shells (content is injected by JS)
src/
  main.js               Entry point: wires content, UI, and the 3D scene together
  style.css              All styling (design tokens at the top as CSS custom properties)
  content.js             Plain-data bio/experience/projects/etc — the only place to edit copy

  scene/                 Everything Three.js. Each file owns one visual concern.
    World.js              Orchestrator: renderer, camera, scene graph, render loop
    backdrop.js             The photo plane: cover-fit texture UVs + a slow "Ken Burns" zoom
    particles.js            Generic glowing-point swarm — used for both the stars and the fireflies
    shootingStars.js         A small pool of meteor streaks that spawn, fly, and fade on a timer
    cameraRig.js            Mouse parallax + scroll-linked camera dolly + idle look-drift
    bloom.js                Postprocessing (UnrealBloomPass) for the glow on bright pixels

  ui/                     DOM-only code; none of it knows Three.js exists.
    render.js               Turns content.js data into DOM nodes
    navigation.js            Mobile menu + active-section nav highlighting
    reveal.js                Scroll-triggered fade-in via IntersectionObserver
    loader.js                 Hides the loading veil once the first frame has rendered
```

**Why it's split this way:** `World.js` is meant to be readable top-to-bottom as
a table of contents — it never contains shader or texture logic itself, only
calls into the module that owns it. Content (`content.js`) is separated from
rendering (`ui/render.js`) so updating your bio/projects never means touching
DOM code.

## Editing your info

Everything text-based — bio, skills, experience, projects, interests, contact
links — lives in `src/content.js`. Nothing else needs to change to update it.
Photos referenced from there (portrait, AWS badge, project screenshots) live
in `public/images/`.

## Tuning the scene

- Backdrop photo / zoom amount: `BACKDROP_IMAGE` in `src/scene/World.js`, `KEN_BURNS_AMOUNT` in `src/scene/backdrop.js`
- Star/firefly counts, colors, depth ranges: the `createParticleField(...)` calls in `src/scene/World.js`
- Shooting star frequency/speed: the constants at the top of `src/scene/shootingStars.js`
- Camera motion feel: the constants in `src/scene/cameraRig.js` (`LOOK_PARALLAX_*` is what makes the backdrop track the cursor; `IDLE_LOOK_SWAY_*` is the autonomous drift)
- Glow strength: the `UnrealBloomPass` params in `src/scene/bloom.js`
