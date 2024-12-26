export const environmentPresets = ["Sunset", "Apartment", "City", "Dawn", "Forest", "Lobby", "Night", "Park", "Studio", "Warehouse"] as const;
export type EnvironmentPresetType = typeof environmentPresets[number];

export const environmentBackgrounds = ["Transparent", "Environment", "Gradient", "Color"] as const;
export const environmentBackgroundsOrthographic = ["Transparent", "Gradient", "Color"] as const;
export type EnvironmentBackgroundType = typeof environmentBackgrounds[number];

export const materials = ["Standard Material", "Gradient Material", "Basic Material", "Normal Material", "Wireframe Material"] as const;
export type MaterialType = typeof materials[number];

export const fonts = [
  { name: "Inter", url: "/Inter.json" },
  { name: "Rubik", url: "/Rubik.json" },
  { name: "Caviar Dreams", url: "/CaviarDreams.json" },
];

export const defaultControls = {
  text: "hello\nworld",
  font: fonts[0],

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

export type SearchParams = { [key: string]: string | string[] | undefined };

export type ActionResponseType = { error: string; success?: undefined; } | { success: boolean; error?: undefined; };

export function compressControls(controls: ControlsType): string {
  const valuesOnly = {
    text: controls.text,
    font: controls.font,
    height: controls.height.value,
    curveSegments: controls.curveSegments.value,
    size: controls.size.value,
    bevelEnabled: controls.bevelEnabled,
    bevelOffset: controls.bevelOffset.value,
    bevelSegments: controls.bevelSegments.value,
    bevelSize: controls.bevelSize.value,
    bevelThickness: controls.bevelThickness.value,
    lineHeight: controls.lineHeight.value,
    letterSpacing: controls.letterSpacing.value,
    material: controls.material,
    colorOnly: controls.colorOnly,
    color: controls.color,
    secondColor: controls.secondColor,
    roughness: controls.roughness.value,
    metalness: controls.metalness.value,
    perspective: controls.perspective,
    preset: controls.preset,
    background: controls.background,
    backgroundColor: controls.backgroundColor,
    secondBackgroundColor: controls.secondBackgroundColor,
    gradientAngle: controls.gradientAngle.value,
    backdropEnabled: controls.backdropEnabled,
    backdropColor: controls.backdropColor,
    backdropRoughness: controls.backdropRoughness.value,
    backdropMetalness: controls.backdropMetalness.value,
    lightEnabled: controls.lightEnabled,
    light: {
      intensity: controls.light.intensity,
      color: controls.light.color,
      position: controls.light.position
    },
    enableVerticalShadow: controls.enableVerticalShadow,
    verticalShadowOffset: controls.verticalShadowOffset.value,
    panels: controls.panels
  };
  return btoa(JSON.stringify(valuesOnly));
}

export function decompressControls(compressed: string): ControlsType {
  const jsonString = atob(compressed);
  if (!jsonString) {
    throw new Error("Failed to decompress controls");
  }
  const valuesOnly = JSON.parse(jsonString);

  return {
    ...defaultControls,
    ...valuesOnly,
    height: { ...defaultControls.height, value: valuesOnly.height },
    curveSegments: { ...defaultControls.curveSegments, value: valuesOnly.curveSegments },
    size: { ...defaultControls.size, value: valuesOnly.size },
    bevelOffset: { ...defaultControls.bevelOffset, value: valuesOnly.bevelOffset },
    bevelSegments: { ...defaultControls.bevelSegments, value: valuesOnly.bevelSegments },
    bevelSize: { ...defaultControls.bevelSize, value: valuesOnly.bevelSize },
    bevelThickness: { ...defaultControls.bevelThickness, value: valuesOnly.bevelThickness },
    lineHeight: { ...defaultControls.lineHeight, value: valuesOnly.lineHeight },
    letterSpacing: { ...defaultControls.letterSpacing, value: valuesOnly.letterSpacing },
    roughness: { ...defaultControls.roughness, value: valuesOnly.roughness },
    metalness: { ...defaultControls.metalness, value: valuesOnly.metalness },
    gradientAngle: { ...defaultControls.gradientAngle, value: valuesOnly.gradientAngle },
    backdropRoughness: { ...defaultControls.backdropRoughness, value: valuesOnly.backdropRoughness },
    backdropMetalness: { ...defaultControls.backdropMetalness, value: valuesOnly.backdropMetalness },
    verticalShadowOffset: { ...defaultControls.verticalShadowOffset, value: valuesOnly.verticalShadowOffset }
  };
}
