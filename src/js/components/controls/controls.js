
import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Vector3 } from 'three'
import threeConfig from '../../config/threeConfig'

// TODO: abstract further into an event handler class
export class Controls {
  // control object is the object being moved around from input
  // container is the canvas element we are using threejs in, so we know where to search for input at
  // takes in configuration to allow attatching more logic when a given event happens
  constructor (camera, container, eventHandlers = []) {
    // private base properties
    this._camera = camera
    this._container = container
    this.eventHandlers = eventHandlers// we allow passing in an array of event handlers at initialization
    this._orbitControls = new OrbitControls(this._camera, this._container)

    // mouse in world coodinites
    this._mouseRay = new Vector3()

    // configuration
    if (threeConfig.controls.dragEnabled) this._dragControls = new DragControls([], this._camera, this._container)
    if (threeConfig.controls.deviceOrientationEnabled) this._orientationControls = new DeviceOrientationControls(this._camera)

    // orbit controls
    this._orbitControls.minAzimuthAngle = threeConfig.controls.minAzimuthAngle
    this._orbitControls.maxAzimuthAngle = threeConfig.controls.maxAzimuthAngle
    this._orbitControls.enableZoom = threeConfig.controls.enableZoom
    this._orbitControls.minDistance = threeConfig.controls.minDistance
    this._orbitControls.maxDistance = threeConfig.controls.maxDistance
    if (!threeConfig.controls.infinitePolar) {
      this._orbitControls.maxPolarAngle = threeConfig.controls.maxPolarAngle
      this._orbitControls.minPolarAngle = threeConfig.controls.minPolarAngle
      this._orbitControls.enableDamping = threeConfig.controls.enableDamping
    }
    this._orbitControls.dampingFactor = threeConfig.controls.dampingFactor
    this._orbitControls.enableZoom = threeConfig.controls.enableZoom

    // input controls
    if (threeConfig.controls.zoomEnabled) window.addEventListener('mousewheel', this.onMouseWheel.bind(this), false)
    if (threeConfig.controls.mouseEnabled) { // initialize values publically
      // get center of current canvas
      this.windowHalf = { x: 0, y: 0 }
      this.windowHalf.x = this._container.clientWidth / 2
      this.windowHalf.y = this._container.clientHeight / 2
      // have a mouse variable track mouse position
      this.mouse = { x: 0, y: 0 }
      // listen to mouse movement on canvas
      window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    }
  }

  onDeviceOrientationChangeEvent (e) {
  }
  onScreenOrientationChangeEvent (e) {
  }

  // TODO: move to a seperate class so we can re-use mouse inputs
  onMouseWheel (e) {
    this._camera.position.z += e.deltaY * 0.1
  }

  // https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
  onMouseMove (e) {
    this.mouse.x = (event.clientX / threeConfig.controls.mouseSpeed - this.windowHalf.x / threeConfig.controls.mouseSpeed)
    this.mouse.y = (event.clientY / threeConfig.controls.mouseSpeed - this.windowHalf.y / threeConfig.controls.mouseSpeed)

    this._mouseRay.set(this.mouse.x * 2 - 1, this.mouse.y * 2 + 1, threeConfig.controls.mouseDepth)
    this._mouseRay.unproject(this._camera)// get a ray pointing in appropriate direction
    this._mouseRay.sub(this._camera.position).normalize()

    if (threeConfig.controls.mouseEnabled) {
      this._target = { x: (1 - this.mouse.x) * 0.002, y: (1 - this.mouse.y) * 0.002 }
      this._camera.rotation.x += 0.5 * (this._target.y - this._camera.rotation.x)
      this._camera.rotation.y += 0.5 * (this._target.x - this._camera.rotation.y)
    }
    // every event checks and passes in event data, since this is a manager aiming to only maintain one instance of event listening
    if (this.eventHandlers.length > 0) {
      for (let i = 0; i < this.eventHandlers.length; ++i) {
      //  TODO: make this more generic, to handle a wider range of events that dont require world-mouse-coordinites
        this.eventHandlers[i](this._mouseRay)
      }
    }
  }

  onMouseDown (e) {
  }
  onMouseUp (e) {
  }

  update () {
    // update the control object
    // this._camera.update()
  }
}
