//=========={ Constants and Types }==========//
export const environmentPresets = ["Sunset", "Apartment", "City", "Dawn", "Forest", "Lobby", "Night", "Park", "Studio", "Warehouse"] as const;
export type EnvironmentPresetType = typeof environmentPresets[number];

export const environmentBackgrounds = ["Transparent", "Environment", "Gradient", "Color"] as const;
export const environmentBackgroundsOrthographic = ["Transparent", "Gradient", "Color"] as const;
export type EnvironmentBackgroundType = typeof environmentBackgrounds[number];

export const materials = ["Standard Material", "Gradient Material", "Basic Material", "Normal Material", "Wireframe Material"] as const;
export type MaterialType = typeof materials[number];

export const fonts = ["Inter", "Rubik", "Caviar Dreams", "Amiri", "Noto"] as const;
export type FontType = typeof fonts[number];

export const defaultControls = {
  text: "hello\nworld",
  font: "Inter" as FontType,

  height: { min: 0.1, max: 10, step: 0.1, value: 0.1 },
  curveSegments: { min: 1, max: 32, step: 1, value: 16 },
  size: { min: 0.1, max: 10, step: 0.1, value: 1.5 },

  bevelEnabled: true,
  bevelOffset: { min: 0, max: 1, step: 0.01, value: 0 },
  bevelSegments: { min: 1, max: 32, step: 1, value: 16 },
  bevelSize: { min: 0, max: 1, step: 0.01, value: 0.15 },
  bevelThickness: { min: 0, max: 1, step: 0.01, value: 0.65 },

  lineHeight: { min: 0, max: 2, step: 0.01, value: 0.62 },
  letterSpacing: { min: -1, max: 1, step: 0.01, value: -0.04 },

  material: "Standard Material" as MaterialType,
  colorOnly: false,
  color: "#d63d3d",
  secondColor: "#e69900",
  roughness: { min: 0, max: 1, step: 0.01, value: 0.5 },
  metalness: { min: 0, max: 1, step: 0.01, value: 0.5 },

  perspective: false,
  preset: "Sunset" as EnvironmentPresetType,
  background: "Transparent" as EnvironmentBackgroundType,
  backgroundColor: "#e03f3b",
  secondBackgroundColor: "#e69900",
  gradientAngle: { min: 0, max: 360, step: 1, value: 0 },

  backdropEnabled: false,
  backdropColor: "#ff6161",
  backdropRoughness: { min: 0, max: 1, step: 0.01, value: 0.5 },
  backdropMetalness: { min: 0, max: 1, step: 0.01, value: 0.5 },

  lightEnabled: false,
  light: { intensity: 1, color: "#ffffff", position: [5, 10, 7], minMax: [[-100, 100], [0, 100], [-100, 100]], step: 0.1 },

  enableVerticalShadow: true,
  verticalShadowOffset: { min: -10, max: 0, step: 0.1, value: -2.5 },

  panels: {
    general: { opened: true },
    material: { opened: false },
    bevel: { opened: false },
    light: { opened: false },
    scene: { opened: false },
  }
}

export type ControlsType = typeof defaultControls;