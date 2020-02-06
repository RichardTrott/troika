import { Facade, utils } from 'troika-core'

const { createClassExtender } = utils

/**
 * Extends a given Facade class to become a `PhysicsObjectFacade`, allowing it to
 * have its position and rotation controlled by a `PhysicsManager`.
 *
 * Physical property configuration

 * physics: {
 *   isDisabled: boolean // When toggled, will delete/add the shape from the Physics World,
 *   isPaused: boolean // When toggled, will change the activation state of the shape, potentially allowing it to passively receive collisions from other shapes
 *   isKinematic: boolean // Kinematic bodies will interact with dynamic objects in the physicsWorld, but have their position/orientation controlled by the facade parent.
 *   isStatic: boolean // Static bodies will interact with dynamic objects in the physicsWorld, but have their position/orientation fixed in place.
 *   isSoftBody: boolean default=false
 *
 *   mass: number // kilograms
 *
 *   friction: float (0-1) default=0.5
 *   rollingFriction: float(0-1) default=0
 *   spinningFriction: float(0-1) default=0
 *
 *   restitution: float (0-1) default=0  "bounciness" of an object
 *
 *   // Rigid Bodies only
 *   linearDamping: float(0-1) default=0 // Additional "drag" friction applied to linear (translation) motion. Applied even when bodies are not colliding.
 *   angularDamping: float(0-1) default=0 // Additional "drag" friction applied to angular (rotation) motion. Applied even when bodies are not colliding.
 *
 *   // Soft Bodies only
 *   pressure: float(-Infinity,+Infinity] default=100 // Pressure coefficient of soft volume
 * }
 *
 * @param {class} BaseFacadeClass
 * @return {PhysicsObjectFacade} a new class that extends the BaseFacadeClass
 */
export const extendAsPhysical = createClassExtender('physical', BaseFacadeClass => {
  class PhysicsObjectFacade extends BaseFacadeClass {
    constructor (parent, threeObject) {
      super(parent, threeObject)

      this.$isPhysicsControlled = false // Managed by PhysicsManager

      this._prevScaleX = this.scaleX
      this._prevScaleY = this.scaleY
      this._prevScaleZ = this.scaleZ

      this.notifyWorld('physicsObjectAdded')
    }

    set physics (desc = {}) {
      this._physicsConfigId = JSON.stringify(desc)
      this._physicsConfig = desc
    }

    get physics () {
      return this._physicsConfig
    }

    afterUpdate () {
      const _prevWorldMatrixVersion = this._worldMatrixVersion

      super.afterUpdate()

      let _needsPhysicsUpdate = false
      if (this._worldMatrixVersion !== _prevWorldMatrixVersion) {
        const scaleChanged = this._prevScaleX !== this.scaleX || this._prevScaleY !== this.scaleY || this._prevScaleZ !== this.scaleZ
        // Dynamic objects (controlled by the dynamicsWorld) need to receive troika-managed scale changes
        // if (this.$isPhysicsControlled && scaleChanged) {
        if (scaleChanged) {
          // https://pybullet.org/Bullet/BulletFull/classbtCollisionShape.html
          // NOTE: btSphereShape does NOT support non-uniform scaling (scaleX/Y/Z must be identical)
          _needsPhysicsUpdate = true
          this.$physicsDirty_Scale = true

          this._prevScaleX = this.scaleX
          this._prevScaleY = this.scaleY
          this._prevScaleZ = this.scaleZ
        }
        // Kinematic or Static objects that exist in the dynamicsWorld (OR dynamic objects that have yet to be registered within the dynamicsWorld)
        // but are not controlled/influenced by it (they _do_ influence dynamic objects)
        // need their full position/orientation/scale matrix updated
        if (!this.$isPhysicsControlled) {
          _needsPhysicsUpdate = true
          this.$physicsDirty_Matrix = true
        }
      }

      if (this._physicsConfigId) {
        if (this._physicsConfigIdPrev && this._physicsConfigId !== this._physicsConfigIdPrev) {
          this.$physicsDirty_Config = true
          _needsPhysicsUpdate = true
        }
        this._physicsConfigIdPrev = this._physicsConfigId
      }

      if (_needsPhysicsUpdate) {
        this.notifyWorld('physicsObjectNeedsUpdate')
      }
    }

    destructor () {
      this.notifyWorld('physicsObjectRemoved')
      super.destructor()
    }
  }

  // Ignore any parent-set position/orientation props when
  // facade is under control of the Physics/Dynamics world
  ;[
    'x', 'y', 'z',
    'quaternionX', 'quaternionY', 'quaternionZ', 'quaternionW',
    'rotateX', 'rotateY', 'rotateZ' /* 'rotateOrder */
  ].forEach(function (controlledProp) {
    Object.defineProperty(PhysicsObjectFacade.prototype, controlledProp, {
      get: function () {
        return Reflect.get(BaseFacadeClass.prototype, controlledProp, this)
      },
      set: function (value) {
        if (this.$isPhysicsControlled) return // dynamicsWorld is driving this property, user/troika-set updates are ignored
        Reflect.set(BaseFacadeClass.prototype, controlledProp, value, this)
      }
    })
  })

  Facade.defineEventProperty(PhysicsObjectFacade, 'onCollision', 'collision')

  return PhysicsObjectFacade
})
