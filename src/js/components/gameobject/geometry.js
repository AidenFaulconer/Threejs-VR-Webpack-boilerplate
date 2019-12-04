import { PlaneGeometry, SphereGeometry, Mesh } from 'three'// when to use { } im imports depends on how each module is exported... https://stackoverflow.com/questions/48537180/difference-between-import-something-from-somelib-and-import-something-from

import Material from './material'
// import { obj } from 'three/examples/jsm/loaders/OBJLoader2Parallel'
import threeConfig from '../../config/threeConfig'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

// This helper class can be used to create and then place geometry in the scene
export default class Geometry {
  constructor (scene) {
    // public
    this.scene = scene
    this.geo
    this.objLoader = new OBJLoader()// refrence to an obj loader
    // this.loader = new OBJLoader2Parallel()// new obj loader for each geometry object
  }

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

    this.scene.add(mesh)
  }
}
