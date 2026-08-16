import { getProject, types } from '@theatre/core';

// 1. Initialize Theatre.js Project
export const theatreProject = getProject('Aetheria Cinematic Project');

// 2. Create Sheet for Hero 3D Reveal Sequence
export const heroSheet = theatreProject.sheet('Hero 3D Blueprint Sheet');

// 3. Create Theatre.js Animated Objects with Keyframe Types
export const cameraTheatreObj = heroSheet.object('3D Camera Controller', {
  dist: types.number(14, { range: [6, 30] }),
  rotX: types.number(0.35, { range: [0, 1.2] }),
  rotY: types.number(0.85, { range: [-Math.PI * 2, Math.PI * 2] }),
  height: types.number(4.5, { range: [1, 15] })
});

export const buildingTheatreObj = heroSheet.object('3D Villa Mesh Controller', {
  revealProgress: types.number(0.2, { range: [0, 1] }),
  scale: types.number(1, { range: [0.5, 1.5] }),
  rotationY: types.number(0, { range: [-Math.PI, Math.PI] }),
  wireframeOpacity: types.number(0.8, { range: [0, 1] }),
  solidOpacity: types.number(0.9, { range: [0, 1] })
});

export const lightingTheatreObj = heroSheet.object('3D Studio Lighting', {
  sunIntensity: types.number(1.8, { range: [0.2, 4] }),
  sunPosX: types.number(15, { range: [-30, 30] }),
  sunPosY: types.number(25, { range: [5, 50] }),
  ambientIntensity: types.number(0.9, { range: [0.1, 2] })
});

export const hudTheatreObj = heroSheet.object('Cinematic HUD Overlays', {
  badgeOpacity: types.number(1, { range: [0, 1] }),
  textYOffset: types.number(0, { range: [-50, 50] }),
  glowIntensity: types.number(1, { range: [0, 2] })
});

// Helper to scrub Theatre sequence position smoothly
export const setTheatreSequencePosition = (positionInSeconds) => {
  if (heroSheet && heroSheet.sequence) {
    heroSheet.sequence.position = positionInSeconds;
  }
};

// Helper to play Theatre sequence smoothly
export const playTheatreSequence = (options = { range: [0, 10], iterationCount: 1 }) => {
  if (heroSheet && heroSheet.sequence) {
    return heroSheet.sequence.play(options);
  }
};

// Enable Studio GUI in non-production environment if requested
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_THEATRE_STUDIO === 'true') {
  import('@theatre/studio').then((studio) => {
    studio.default.initialize();
  }).catch((err) => console.warn('[Theatre Studio] Studio loader skipped:', err.message));
}
