import {
  BoxBufferGeometry,
  Mesh,
  MeshPhongMaterial
} from 'three'
import { Object3DFacade } from 'troika-3d'
import { extendAsPhysical } from 'troika-physics'

const sx = 0.5
const sy = 0.5
const sz = 10

const geometry = new BoxBufferGeometry(sx, sy, sz, 1, 1, 1)
const material = new MeshPhongMaterial({
  transparent: true,
  opacity: 1.0,
  color: 0xFFFFFF,
  refractionRatio: 0.8
})

class FanBlade extends Object3DFacade {
  constructor (parent) {
    const ground = new Mesh(geometry, material.clone())

    super(parent, ground)
    this._physicsShapeCfg = {
      shape: 'box',
      ctrArgs: [{
        method: 'btVector3',
        args: [sx * 0.5, sy * 0.5, sz * 0.5]
      }]
    }
  }

  set color (c) {
    this.threeObject.material.color.set(c)
  }

  set environmentMap (envMapTexture) {
    this.threeObject.material.envMap = envMapTexture
  }
}

export default extendAsPhysical(FanBlade)
