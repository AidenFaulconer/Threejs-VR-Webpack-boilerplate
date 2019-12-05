// interpolations
import Easing from '@tweenjs/tween.js'
// for geometry
import { FrontSide } from 'three'
// post processing
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import FXAAPass from '@superguigui/wagner/src/passes/fxaa/FXAAPass'

// fxaa setting
// import { FXAAShader } from '../shaders/FXAAShader'
// import { ShaderPass } from '../shaders/ShaderPass'
// import { RenderPass } from '../shaders/RenderPass'

// This object contains the initial state of the app which will change realtime from datGUI
// TODO: make confiugration work realtime rather than at initialization
export default {
  isDev: true,
  isVR: false,
  isMobile: false,
  sceneBg: {
    mobile: '../../../static/textures/bg_mobile.png',
    pc: '../../../static/textures/bg-01.png'
  },
  PostProcessing: {
    enabled: false,
    Types: {
      'FXAA': FXAAPass,
      'Bloom': MultiPassBloomPass
    }
  },
  tween: {// https://createjs.com/docs/tweenjs/modules/TweenJS.html
    quadratic: [
      500, // duration
      Easing.Quadratic// ease type
    ],
    bounce: [
      500, // duration
      Easing.bounce // ease type
    ],
    circular: [
      500, // duration
      Easing.Circular // ease type
    ],
    linear: [
      500, // duration
      Easing.Linear // ease type
    ]
  },
  models: {
    aidenobj: [{
      path: '../../../../static/models/aiden.OBJ',
      scale: 4,
      position: [{ 'x': 1, 'y': 1, 'z': 1 }],
      material: [{
        type: 'physical',
        props: [
          {
            color: '#222135',
            reflectivity: 0.19,
            refractionRatio: 0.85,
            transparent: true,
            metalness: 1,
            roughness: 0.5,
            opacity: 0.7,
            side: FrontSide,
            envMapIntensity: 7,
            premultipliedAlpha: true
            // envMap: '../../../assets/bg.png',
            // shininess: 900,
            // specular: 0x111111,
            // // opacity: 1,
            // blending: THREE.GreaterDepth,
            // metalness: 0.0,
            // depth: THREE.GreaterDepth,
            // ide: THREE.Backside
          }
        ]
      }]
    }],
    lionobj: [{
      path: '../../../../static/models/lion.OBJ',
      scale: 4,
      position: [{ 'x': 1, 'y': 1, 'z': 1 }],
      material: [{
        type: 'physical',
        props: [
          {
            color: '#222135',
            reflectivity: 0.19,
            refractionRatio: 0.85,
            transparent: true,
            metalness: 1,
            roughness: 0.5,
            opacity: 0.7,
            side: FrontSide,
            envMapIntensity: 7,
            premultipliedAlpha: true
            // envMap: '../../../assets/bg.png',
            // shininess: 900,
            // specular: 0x111111,
            // // opacity: 1,
            // blending: THREE.GreaterDepth,
            // metalness: 0.0,
            // depth: THREE.GreaterDepth,
            // ide: THREE.Backside
          }
        ]
      }]
    }],
    kangarooobj: [{
      path: '../../../../static/models/kangaroo.OBJ',//be weary... these are relative to the class using them! (geometry)
      scale: 4,
      position: [{ 'x': 1, 'y': 1, 'z': 1 }],
      material: [{
        type: 'physical',
        props: [
          {
            color: '#222135',
            reflectivity: 0.19,
            refractionRatio: 0.85,
            transparent: true,
            metalness: 1,
            roughness: 0.5,
            opacity: 0.7,
            side: FrontSide,
            envMapIntensity: 7,
            premultipliedAlpha: true
            // envMap: '../../../assets/bg.png',
            // shininess: 900,
            // specular: 0x111111,
            // // opacity: 1,
            // blending: THREE.GreaterDepth,
            // metalness: 0.0,
            // depth: THREE.GreaterDepth,
            // ide: THREE.Backside
          }
        ]
      }]
    }]
  },
  //   texture: {
  //     path: './assets/textures/',
  //     imageFiles: [
  //       { name: 'UV', image: 'UV_Grid_Sm.jpg' }
  //     ]
  //   },
  mesh: {
    enableHelper: false,
    wireframe: false,
    translucent: false,
    material: {
      color: 0xffffff,
      emissive: 0xffffff
    }
  },
  fog: {
    isFog: false,
    color: 0xffffff,
    density: 0.1,
    near: 0.0008
  },
  camera: {
    fov: 40,
    near: 2,
    far: 1000,
    aspect: 1,
    // base position
    posX: 0,
    posY: 30,
    posZ: 40,
    // base orientation
    rotX: 90,
    rotY: 90,
    rotZ: 90
  },
  controls: {
    // togglables
    deviceOrientationEnabled: false,
    dragEnabled: false,
    zoomEnabled: false,
    clickEnabled: false,
    infinitePolar: true,
    mouseEnabled: true,
    // mouse
    mouseSpeed: 1,
    mouseDepth: 1, // how far a ray from the mouse goes into worldspace
    // orbit controls
    autoRotate: true,
    autoRotateSpeed: -0.5,
    rotateSpeed: 0.5,
    zoomSpeed: 0.8,
    minDistance: 200,
    maxDistance: 600,
    minPolarAngle: Math.PI / 5,
    maxPolarAngle: Math.PI / 2,
    minAzimuthAngle: -Infinity,
    maxAzimuthAngle: Infinity,
    enableDamping: true,
    dampingFactor: 0.5,
    enableZoom: true,
    // camera position
    target: {
      x: 0,
      y: 0,
      z: 0
    }
  },
  renderer: {
    shadow: {
      enabled: true,
      helperEnabled: true,
      bias: 0,
      mapWidth: 2048,
      mapHeight: 2048,
      near: 250,
      far: 400,
      top: 100,
      right: 100,
      bottom: -100,
      left: -100
    }
  },
  lighting: {
    shadow: {
      enabled: true,
      helperEnabled: true,
      bias: 0,
      mapWidth: 2048,
      mapHeight: 2048,
      near: 250,
      far: 400,
      top: 100,
      right: 100,
      bottom: -100,
      left: -100
    },
    ambientLight: {
      enabled: true,
      color: 0x141414
    },
    directionalLight: {
      enabled: true,
      color: 0xf0f0f0,
      intensity: 0.4,
      x: -75,
      y: 280,
      z: 150
    },
    pointLight: {
      enabled: true,
      color: 0xffffff,
      intensity: 0.34,
      distance: 115,
      x: 0,
      y: 0,
      z: 0
    },
    hemiLight: {
      enabled: true,
      color: 0xc8c8c8,
      groundColor: 0xffffff,
      intensity: 0.55,
      x: 0,
      y: 0,
      z: 0
    }
  },
  // isShowingStats: true,
  isLoaded: false,
  isRotating: true,
  isMouseMoving: false,
  isMouseOver: false,
  maxAnisotropy: 1,
  dpr: 1
}
