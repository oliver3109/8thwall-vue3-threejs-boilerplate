import type { XRScene } from '@/XR8/interfaces/Three'
import { EventEmitter } from '@/utils/EventEmitter'
import * as THREE from 'three'

export class ImageTargetTrackingPipelineModule extends EventEmitter {
  private readonly name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  private onStart({ canvas }: { canvas: HTMLCanvasElement }) {
    const { scene, camera, renderer } = XR8.Threejs.xrScene()

    // Add content to the scene and set the starting position of the camera.
    this.initXrScene({ scene, camera, renderer })

    // Prevent rolling/pinching gestures on the canvas
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault()
    })

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion
    })

    // When clicking on the canvas, re-enter the content.
    canvas.addEventListener(
      'touchstart',
      (e) => {
        e.touches.length === 1 && XR8.XrController.recenter()
      },
      true
    )
  }

  private async initXrScene({ scene, camera, renderer }: XRScene) {
    // Add soft white light to the scene.
    // This light cannot be used to cast shadows because it has no direction.
    scene.add(new THREE.AmbientLight(0xffffff, 9))

    // Create a 3D coordinate axis
    const axesHelper = new THREE.AxesHelper(150)
    scene.add(axesHelper)

    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)
    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.67
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    scene.add(plane)

    // Set the initial camera position relative to the scene we just arranged. This must be in the
    // The height is greater than y=0.
    camera.position.set(0, 0, 5)
  }

  private constructGeometry({ detail }: any) {}

  private firstFindTarget({ detail }: any) {
    if (detail.name === 'your-image-target-name') {
      //
    }
  }

  private showTarget({ detail }: any) {
    if (detail.name === 'your-image-target-name') {
      //
    }
  }

  private hideTarget({ detail }: any) {
    if (detail.name === 'your-image-target-name') {
      //
    }
  }

  private onUpdate() {}

  public getX8RPiplineMoudle() {
    const that = this

    const onStart = (event: { canvas: any }) => {
      this.emit('start')
      that.onStart(event)
    }

    const onUpdate = () => {
      that.onUpdate()
    }

    const imagescanning = (event: { detail: any }) => {
      this.emit('imagescanning')
      that.constructGeometry(event)
    }

    const imagefound = (event: { detail: any }) => {
      this.emit('imagefound')
      that.firstFindTarget(event)
    }

    const imageupdated = (event: { detail: any }) => {
      this.emit('imageupdated')
      that.showTarget(event)
    }

    const imagelost = (event: { detail: any }) => {
      this.emit('imagelost')
      that.hideTarget(event)
    }

    return {
      name: that.name,

      onStart,

      onUpdate,

      // Listeners are called right after the processing stage that fired them. This guarantees that
      // updates can be applied at an appropriate synchronized point in the rendering cycle.
      listeners: [
        { event: 'reality.imagescanning', process: imagescanning },
        { event: 'reality.imagefound', process: imagefound },
        { event: 'reality.imageupdated', process: imageupdated },
        { event: 'reality.imagelost', process: imagelost }
      ]
    }
  }
}
