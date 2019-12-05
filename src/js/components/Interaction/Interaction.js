
import { Raycaster, Vector3 } from './node_modules/three'
import threeConfig from '../../config/threeConfig'

export default class Interaction {
  // container is the canvas element we are using threejs in, so we know where to search for input at
  // create -> configure -> persists and checks input
  constructor (camera, targetObj, container) {
    // private base properties
    this._camera = camera
    this._targetObj = targetObj
    this._container = container

    // mouse and length of raycase
    this.mouse = { x: 0, y: 0 }
    this.vector3 = new Vector3(0, 0, 0)
    // public base properties
    this.raycaster = new Raycaster(this._camera.position, this.vector3.sub(this._camera.position).normalize())

    // TODO: OPTIMIZE EVENT LISTENER USAGE
    document.addEventListener('mousedown', this.onMouseDown, false)
    document.addEventListener('mousemove', this.onMouseDown, false)
  }

  // https://stackoverflow.com/questions/26652888/three-js-orthographic-camera-object-picking/26656345#26656345
  onMouseDown (e) {
    e.preventDefault()

    // track mouse coodinites
    // (TODO: SOURCE FROM CONTROL.JS OR MAKE A MOUSE HANDLER CLASS FOR BOTH TO REFRENCE)
    // TODO: TEST PERSPECTIVE FROM RAYCAST
    this.mouse.y = e.clientY - windowHalfY
    this.mouse.x = e.clientX - windowHalfX

    // ray
    this.vector3.x = (e.clientX / container.clientWidth) * 2 - 1
    this.vector3.y = -(event.clientY / container.clientHeight) * 2 + 1
    this.vector3.z = threeConfig.controls.dep // depth, higher values mean less performance

    this.vector3 = this.vector3.unproject(this._camera)
    this.raycaster.ray.at(1, this.vector3)

    // raycast and detect intersections
    this.raycaster.setFromCamera()
    let intersects = this.raycaster.intersectObjects(this._targetObj, true)// true means we recursivly look at what we hit
    if (intersects.length > 0) alert('Mouse on target')
  }
}
