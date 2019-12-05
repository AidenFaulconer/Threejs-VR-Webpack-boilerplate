import { PlaneGeometry, SphereGeometry, Object3D, Quaternion, Mesh, MeshPhysicalMaterial, ShaderMaterial, MeshPhongMaterial } from 'three'// when to use { } im imports depends on how each module is exported... https://stackoverflow.com/questions/48537180/difference-between-import-something-from-somelib-and-import-something-from
// import { obj } from 'three/examples/jsm/loaders/OBJLoader2Parallel'
import Material from './material'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

import threeConfig from '../../config/threeConfig'

// This helper class can be used to create and then place geometry in the scene
// TODO: rework the control manager to be more generic with input
export default class Geometry {// two optional paramaters
  constructor (scene) {
    // public
    this._scene = scene

    this._objectPool = []; //used with a 'static' instance of this class (will change to a object pool manager)

    this.objLoader = new OBJLoader()// refrence to an obj loader
    this.orientaiton = new Quaternion()// object rotation

    // configure for objects to look at things
  }

  // load objects from custom configuration (static)
  loadFromConfiguration (events = false, control = false) {

    for (let model in threeConfig.models) {
      // load obj

      //TODO: have a object manager. prefrably with object pooling
      let geometryInstance = new Geometry(this._scene)
      this._objectPool.push(geometryInstance)

      this.objLoader.load('../../../../static/models/aiden.OBJ', (test) => { console.warn(test) })
      this.objLoader.load(threeConfig.models[model][0]['path'],
        (geometry) => {
          // configure materials
          let material
          if (threeConfig.models[model][0].material) {
            let materialprops = threeConfig.models[model][0]['material']
            switch (materialprops[0]['type']) {
              case 'physical':
                material = new MeshPhysicalMaterial(materialprops[0]['props'][0])
                break
              case 'custom':
                material = new ShaderMaterial(materialprops[0]['props'][0])
                break
              case 'phong':
                material = new MeshPhongMaterial(materialprops[0]['props'][0])
                break
              default: console.error('misconfigured material type, please use custom,phong or physical')
                break
            }
          }
          if (geometry.children.length > 0) {
            geometry.traverse((childMesh) => {
              material ? childMesh.material = material : console.log('using default material')
              childMesh.scale.set([threeConfig.models[model].scale, threeConfig.models[model].scale, threeConfig.models[model].scale])
              childMesh.position.set(threeConfig.models[model].position)
            })
          }
          this._geometry = geometry
          this._scene.add(this._geometry)
          if (events) control.eventHandlers.push(geometryInstance.watchObject)
        },
        () => {},
        (err) => {
          console.error('obj loading failed: ', err)
        })
    }
  }

  // allow custom callback, or default the function to whats passed to func
  // @param model: used when reading from configuration, default is none, it is a refrence to the model we are currently at in the config
  loadObj (url, func = null) {
    if (!func) console.error('please pass in a callback function to avoid erros')
    // this._object = this.objLoader.load(url, func)
  }
  // TODO: make an error class to abstract error messages
  // this can be used as a event handler
  watchObject (target) {
    // this._object.lookAt(...target)
    // console.warn(target)
  }
  // for complex mesh's

  // for primitives
  make (type) {
    if (type === 'plane') {
      return (width, height, widthSegments = 1, heightSegments = 1) => {
        this.geo = new PlaneGeometry(width, height, widthSegments, heightSegments)
      }
    }

    if (type === 'sphere') {
      return (radius, widthSegments = 32, heightSegments = 32) => {
        this.geo = new SphereGeometry(radius, widthSegments, heightSegments)
      }
    }
  }

  place (position, rotation) {
    const material = new Material(0xeeeeee).standard
    const mesh = new Mesh(this.geo, material)

    // Use ES6 spread to set position and rotation from passed in array
    mesh.position.set(...position)
    mesh.rotation.set(...rotation)

    if (threeConfig.shadow.enabled) {
      mesh.receiveShadow = true
    }

    this._scene.add(mesh)
  }
}
