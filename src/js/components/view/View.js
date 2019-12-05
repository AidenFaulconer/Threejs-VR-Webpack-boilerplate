import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Clock
} from 'three'
import threeConfig from '../../config/threeConfig'
import { Controls } from '../controls/controls'
import Stats from 'stats-js/src/Stats'

// post processing
import Composer from '@superguigui/wagner/src/Composer'

class View {
  constructor (canvas) {
    // TODO: make an object pool for present scene objects, or use an entity component system
    this._canvas = canvas// passed in from start of program
    // initilaize (all values private for time being)

    // stats
    if(threeConfig.isDev) this._stats = new Stats()

    // deltatime
    this._clock = new Clock(true)
    this.deltaTime = this._clock.getDelta()

    // camera
    this._camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
    // configuration
    this._camera.fov = threeConfig.camera.fov
    this._camera.near = threeConfig.camera.near
    this._camera.far = threeConfig.camera.far
    this._camera.aspect = threeConfig.camera.aspect
    this._camera.position.x = threeConfig.camera.posX
    this._camera.position.y = threeConfig.camera.posY
    this._camera.position.z = threeConfig.camera.posZ

    // scene
    this._scene = new Scene()
    // configuration
    // this._scene.background = threeConfig.background

    // renderer (the render pipeline)
    this._renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    // configuration
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    this._renderer.shadowMap.enabled = threeConfig.renderer.shadow.enabled
    this._renderer.shadowMap.type = threeConfig.renderer.shadow.type
    this._canvas.appendChild(this._renderer.domElement)// append threejs canvas to the canvas on the document

    // post processing
    // TODO: append postprocessing routines to three library
    this._pixelRatio = this._renderer.getPixelRatio()// used in postprocessing uniform values in shader
    this._passes = []
    this._composer = new Composer(this._renderer)// manager allowing piping in new passes to render pipeline
    threeConfig.PostProcessing.enabled ? this.enablePostProcessing() : console.log('disabled postprocessing')

    // camera controls
    this._controls = new Controls(this._camera, this._renderer.domElement)

    // event listeneers
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }
  // private

  // public
  enablePostProcessing () {
    for (let pass in threeConfig.PostProcessing.Types) {
      console.log(pass)
      this._passes.push(new threeConfig.PostProcessing.Types[pass]())// new pass in pipeline to antialias in final render stages
    }
    this.onWindowResize()// ensure resolution is set when we enable this shader
  }
  disablePostProcessing () {
    for (i = 0; i < this._passes.length; ++i) {
      delete this._pass[i]// delete allocated memory from refrence
    }
    this.onWindowResize()// update frame to be without post processing passes
  }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  onWindowResize (e) {
    // camera
    this._camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight
    this._camera.updateProjectionMatrix()

    // render pipeline
    this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight)

    this._composer.setSize(this._canvas.clientWidth, this._canvas.clientHeight)
    if (threeConfig.PostProcessing.enabled && this._passes.length > 0) {
      // shader reconfiguration
      // for (pass in this._passes) {
      //   this.material.uniforms[ 'resolution' ].value.x = 1 / (window.innerWidth * this._pixelRatio)
      //   this._fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (window.innerHeight * this._pixelRatio)
      //   // re-append to render pipeline
      //   this._composer.addPass(this._renderPass)
      //   this._composer.addPass(this._fxaaPass)
      // }
    }
  }
  // apply new configurations to the current frame (this MUST be called every frame to see anything in the window)
  update (timestamp) {
    // if (this._stats !== 'undefined') this._stats.begin()

    requestAnimationFrame(this.update.bind(this))
    this._renderer.render(this._scene, this._camera)

    // if (this._stats !== 'undefined') this._stats.end()
  }
}

export default View
