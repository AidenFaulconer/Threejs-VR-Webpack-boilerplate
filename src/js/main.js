import {
  Mesh,
  MeshPhysicalMaterial,
  ShaderMaterial,
  TextureLoader,
  FogExp2,
  CubeTextureLoader,
  Color,
  LinearFilter,
  DirectionalLight
} from 'three'

// camera
import View from './components/view/View'// do not use {View} it will break...

// helpers
import { Stats } from 'stats-js/src/Stats'
import Geometry from './components/gameobject/geometry'

// web worker
import Worker from './workers/file.worker.js'

// shaders
// import shaderVert from './shaders/custom.v ert'
// import shaderFrag from './shaders/custom.frag'

// data for initial scene
import threeConfig from './config/threeConfig.js'

// the view class contains the camera, render pipeline, and scene... TODO: abstract scene seperatly
class Main extends View {
  constructor (canvas) { // canvas div to pass into view
    super(canvas)// attribures to pass into the extended parent class (View)

    // webworkers to multithread any heavy or data realted computations
    const worker = new Worker()
    worker.postMessage({ a: 1 })
    worker.addEventListener('message', function (event) {
      console.log(event)
    })

    /// ////////////////////////
    //  handle configuration //
    /// //////////////////////
    {
      // if (threeConfig.isDev) {
      //   this._stats = new Stats()
      //   // stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
      //   // this._stats.style.position = 'absolute'
      //   // this._stats.style.left = 0
      //   // this._stats.style.top = 0
      //   // this._stats.style.zIndex = 999
      //   document.getElementById('stats').appendChild(this._stats)
      // } else {
      //   console.log('no performance statistics on configuration')
      // }
    }

    {
      for (var model in threeConfig.models) {
        // load obj
        console.log(threeConfig.models[model][0]['path'])
        let geometry = new Geometry(this._scene).objLoader.load(threeConfig.models[model][0]['path'],()=>{
          let materialprops = threeConfig.models[model][0]['material']
          let material
          // console.log(materialprops[0]['type'])
          // console.log(materialprops[0]['props'][0])
          switch (materialprops[0]['type']) {
            case 'physical':
              material = new MeshPhysicalMaterial(materialprops[0]['props'][0])
              break

            case 'custom':
              material = new ShaderMaterial(materialprops[0]['props'][0])
              break

            default: console.error('misconfigured material type, please use custom or physical')
              break
          }

          this._mesh = new Mesh(geometry, material)// create the mesh
          console.log(this._mesh)
          this._scene.add(this._mesh)
        })
        // configure material
      }
    }

    // setup scene
    threeConfig.fog.isFog ? this._scene.fog = new FogExp2(threeConfig.fog.color, threeConfig.fog.density) : console.log('not rendering fog')
    const texture = new CubeTextureLoader().load([threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc])
    texture.minFilter = LinearFilter
    this._scene.background = texture
    // this._scene.background = new Color('#affafa');

    {
      //lights
      this._dirlight = new DirectionalLight();
      this._dirlight.intensity = 2;
      this._scene.add(this._dirlight)
    }

    {
      let plane = new Geometry(this._scene)
      plane.make('plane')
    }
    this.update()
  }
}

export default Main
