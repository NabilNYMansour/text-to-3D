import { ControlsType } from "./constants-and-types";

export const defaultTemplate: ControlsType = {
  "text": "Default",
  "font": {
    "name": "Inter",
    "url": "/Inter.json"
  },
  "height": {
    "min": 0.1,
    "max": 10,
    "step": 0.1,
    "value": 0.1
  },
  "curveSegments": {
    "min": 1,
    "max": 32,
    "step": 1,
    "value": 16
  },
  "size": {
    "min": 0.1,
    "max": 10,
    "step": 0.1,
    "value": 1.5
  },
  "bevelEnabled": true,
  "bevelOffset": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0
  },
  "bevelSegments": {
    "min": 1,
    "max": 32,
    "step": 1,
    "value": 16
  },
  "bevelSize": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.15
  },
  "bevelThickness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.65
  },
  "lineHeight": {
    "min": 0,
    "max": 2,
    "step": 0.01,
    "value": 0.62
  },
  "letterSpacing": {
    "min": -1,
    "max": 1,
    "step": 0.01,
    "value": -0.04
  },
  "material": "Standard Material",
  "colorOnly": false,
  "color": "#d63d3d",
  "secondColor": "#e69900",
  "roughness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "metalness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "perspective": false,
  "preset": "Sunset",
  "background": "Transparent",
  "backgroundColor": "#e03f3b",
  "secondBackgroundColor": "#e69900",
  "gradientAngle": {
    "min": 0,
    "max": 360,
    "step": 1,
    "value": 0
  },
  "backdropEnabled": false,
  "backdropColor": "#ff6161",
  "backdropRoughness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "backdropMetalness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "lightEnabled": false,
  "light": {
    "intensity": 1,
    "color": "#ffffff",
    "position": [
      5,
      10,
      7
    ],
    "minMax": [
      [
        -100,
        100
      ],
      [
        0,
        100
      ],
      [
        -100,
        100
      ]
    ],
    "step": 0.1
  },
  "enableVerticalShadow": true,
  "verticalShadowOffset": {
    "min": -10,
    "max": 0,
    "step": 0.1,
    "value": -2.5
  },
  "panels": {
    "general": {
      "opened": true
    },
    "material": {
      "opened": false
    },
    "bevel": {
      "opened": false
    },
    "light": {
      "opened": false
    },
    "scene": {
      "opened": false
    }
  }
};

export const gradientTemplate: ControlsType = {
  "text": "Gradient",
  "font": {
    "name": "Rubik",
    "url": "/Rubik.json"
  },
  "height": {
    "min": 0.1,
    "max": 10,
    "step": 0.1,
    "value": 0.1
  },
  "curveSegments": {
    "min": 1,
    "max": 32,
    "step": 1,
    "value": 16
  },
  "size": {
    "min": 0.1,
    "max": 10,
    "step": 0.1,
    "value": 1.5
  },
  "bevelEnabled": true,
  "bevelOffset": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0
  },
  "bevelSegments": {
    "min": 1,
    "max": 32,
    "step": 1,
    "value": 16
  },
  "bevelSize": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.15
  },
  "bevelThickness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.91
  },
  "lineHeight": {
    "min": 0,
    "max": 2,
    "step": 0.01,
    "value": 0.62
  },
  "letterSpacing": {
    "min": -1,
    "max": 1,
    "step": 0.01,
    "value": -0.04
  },
  "material": "Gradient Material",
  "colorOnly": true,
  "color": "#d63d3d",
  "secondColor": "#e69900",
  "roughness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "metalness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "perspective": false,
  "preset": "Sunset",
  "background": "Color",
  "backgroundColor": "#e03f3b",
  "secondBackgroundColor": "#e69900",
  "gradientAngle": {
    "min": 0,
    "max": 360,
    "step": 1,
    "value": 0
  },
  "backdropEnabled": false,
  "backdropColor": "#ff6161",
  "backdropRoughness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "backdropMetalness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "lightEnabled": false,
  "light": {
    "intensity": 1,
    "color": "#ffffff",
    "position": [
      5,
      10,
      7
    ],
    "minMax": [
      [
        -100,
        100
      ],
      [
        0,
        100
      ],
      [
        -100,
        100
      ]
    ],
    "step": 0.1
  },
  "enableVerticalShadow": false,
  "verticalShadowOffset": {
    "min": -10,
    "max": 0,
    "step": 0.1,
    "value": -2.5
  },
  "panels": {
    "general": {
      "opened": true
    },
    "material": {
      "opened": true
    },
    "bevel": {
      "opened": true
    },
    "light": {
      "opened": true
    },
    "scene": {
      "opened": true
    }
  }
};

export const perspectiveTemplate: ControlsType = {
  "text": "Perspective",
  "font": {
    "name": "Caviar Dreams",
    "url": "/CaviarDreams.json"
  },
  "height": {
    "min": 0.1,
    "max": 10,
    "step": 0.1,
    "value": 0.1
  },
  "curveSegments": {
    "min": 1,
    "max": 32,
    "step": 1,
    "value": 16
  },
  "size": {
    "min": 0.1,
    "max": 10,
    "step": 0.1,
    "value": 1.5
  },
  "bevelEnabled": true,
  "bevelOffset": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0
  },
  "bevelSegments": {
    "min": 1,
    "max": 32,
    "step": 1,
    "value": 16
  },
  "bevelSize": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.15
  },
  "bevelThickness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.19
  },
  "lineHeight": {
    "min": 0,
    "max": 2,
    "step": 0.01,
    "value": 0.62
  },
  "letterSpacing": {
    "min": -1,
    "max": 1,
    "step": 0.01,
    "value": -0.04
  },
  "material": "Gradient Material",
  "colorOnly": false,
  "color": "#d63d3d",
  "secondColor": "#e69900",
  "roughness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "metalness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "perspective": true,
  "preset": "Sunset",
  "background": "Gradient",
  "backgroundColor": "#e03f3b",
  "secondBackgroundColor": "#e69900",
  "gradientAngle": {
    "min": 0,
    "max": 360,
    "step": 1,
    "value": 0
  },
  "backdropEnabled": true,
  "backdropColor": "#ff6161",
  "backdropRoughness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "backdropMetalness": {
    "min": 0,
    "max": 1,
    "step": 0.01,
    "value": 0.5
  },
  "lightEnabled": false,
  "light": {
    "intensity": 1,
    "color": "#ffffff",
    "position": [
      5,
      10,
      7
    ],
    "minMax": [
      [
        -100,
        100
      ],
      [
        0,
        100
      ],
      [
        -100,
        100
      ]
    ],
    "step": 0.1
  },
  "enableVerticalShadow": true,
  "verticalShadowOffset": {
    "min": -10,
    "max": 0,
    "step": 0.1,
    "value": -2.5
  },
  "panels": {
    "general": {
      "opened": true
    },
    "material": {
      "opened": true
    },
    "bevel": {
      "opened": true
    },
    "light": {
      "opened": false
    },
    "scene": {
      "opened": true
    }
  }
}; 
