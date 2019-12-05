import {
  Mesh,
  MeshPhysicalMaterial,
  ShaderMaterial,
  TextureLoader,
  FogExp2,
  CubeTextureLoader,
  Color,
  LinearFilter,
  DefaultLoadingManager
} from 'three'

// interaction (raycasting methods)
// import Interaction from './components/Interaction/Interaction'

// camera
import View from './components/view/View'// do not use {View} it will break...

// helpers
import Geometry from './components/gameobject/geometry'

// web worker
import Worker from './workers/file.worker.js'

// shaders
// import shaderVert from './shaders/custom.v ert'
// import shaderFrag from './shaders/custom.frag'

// data for initial scene
import threeConfig from './config/threeConfig.js'
import Lighting from './components/lighting/lighting'

// the view class contains the camera, render pipeline, and scene... TODO: abstract scene seperatly
// TODO: Go through code and add naming convention __property for private object refrences
class Main extends View {
  constructor (canvas) { // canvas div to pass into view
    super(canvas)// attribures to pass into the extended parent class (View)

    // webworkers to multithread any heavy or data realted computations
    // refrence: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
    const worker = new Worker()
    worker.postMessage({ a: 1 })
    worker.addEventListener('message', function (event) {
      console.log(event)
    })

    // feedback on this threejs context's loading progress
    DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log('Loading: ', itemsLoaded / itemsTotal * 100)
      // show progress in the text of the element
      document.getElementById('loader').innerText = itemsLoaded / itemsTotal * 100
    }
    DefaultLoadingManager.onLoad = () => {
      console.log('loaded')
      // tell the window when we are done loading for threejs and apply new styles on the eventj
      document.getElementById('loader').className += ' finished'
    }
    /// ////////////////////////
    //  handle configuration //
    /// //////////////////////
    {
      // load obj
      let geometry = new Geometry(this._scene)
      geometry.loadFromConfiguration(true, this._controls)//these objects lookat the mouse
    }

    // setup scene
    {
      threeConfig.fog.isFog ? this._scene.fog = new FogExp2(threeConfig.fog.color, threeConfig.fog.density) : console.log('not rendering fog')
      const texture = new CubeTextureLoader().load([threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc, threeConfig.sceneBg.pc])
      texture.minFilter = LinearFilter
      this._scene.background = texture
      // this._scene.background = new Color('#affafa');
    }

    {
      // lights
      // this._lighting = new Lighting(this._scene)
      // this._lighting.place(this._lighting.lightTypes.ambient)
      // this._lighting.place(this._lighting.lightTypes.directional)
      // this._lighting.place(this._lighting.lightTypes.hemi)
      // this._lighting.place(this._lighting.lightTypes.point)
    }

    {
      // let plane = new Geometry(this._scene)
      // plane.make('plane')
    }

    {
      // this._interaction = new Interaction(this._camera,)
    }

    this.update()
  }
}

export default Main
