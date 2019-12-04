import {
  PerspectiveCamera,
  WebGLRenderer,
  Scene
} from 'three'
import { OrbitControls } from 'three/examples/jsm/Controls/OrbitControls'
import threeConfig from '../../config/threeConfig'

class View {
  constructor (canvas) {
    // TODO: make an object pool for present scene objects, or use an entity component system
    console.error('test', canvas)
    this._canvas = canvas// passed in from start of program
    // initilaize (all values private for time being)

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
    this._renderer.shadowMap.enabled = threeConfig.shadow.enabled
    this._renderer.shadowMap.type = threeConfig.shadow.type
    this._canvas.appendChild(this._renderer.domElement)// append threejs canvas to the canvas on the document

    // post processing
    this._pixelRatio = this._renderer.getPixelRatio()// used in postprocessing uniform values in shader
    //TODO: append postprocessing routines to three library
    // this._renderPass = new THREE.RenderPass(this._scene, this._camera)// initial render pass in render pipeline
    // this._composer = new THREE.EffectComposer(this._renderer)// manager allowing piping in new passes to render pipeline
    // threeConfig.PostProcessing.FXAA.enabled ? this.toggleFXAA() : console.log('disabled FXAA filtering')

    // camera controls  TODO:(may make public refrence)
    this._controls = new OrbitControls(this._camera, this._renderer.domElement)
    // this._controls.addEventListener( 'change', render ) // add this only if there is no animation loop (requestAnimationFrame)
    this._controls.enableDamping = true
    this._controls.dampingFactor = 0.25
    this._controls.enableZoom = false

    // event listeneers
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }
  // private

  // public
  // enableFXAA () {
  //   this._fxaaPass = new THREE.ShaderPass()// new pass in pipeline to antialias in final render stages
  //   this.onWindowResize()// ensure resolution is set when we enable this shader
  // }
  // disableFXAA () {
  //   delete this._fxaaPass()// delete allocated memory
  //   this.onWindowResize()
  // }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  onWindowResize () {
    // camera
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()

    // render pipeline
    this._renderer.setSize(window.innerWidth, window.innerHeight)

    // update resolution on postprocessing shaders
    // this._composer.setSize(window.innerWidth, window.innerHeight)
    // if (threeConfig.PostProcessing.FXAA.enable && this.hasOwnProperty('_fxaaPass')) {
    //   // shader reconfiguration
    //   this._fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / (window.innerWidth * this._pixelRatio)
    //   this._fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / (window.innerHeight * this._pixelRatio)
    //   // re-append to render pipeline
    //   this._composer.addPass(this._renderPass)
    //   this._composer.addPass(this._fxaaPass)
    // }
  }
  // apply new configurations to the current frame (this MUST be called every frame to see anything in the window)
  update (timestamp) {
    requestAnimationFrame(this.update.bind(this))
    this._renderer.render(this._scene, this._camera)
  }
}

export default View
