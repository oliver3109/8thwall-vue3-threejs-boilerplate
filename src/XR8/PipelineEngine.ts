import * as THREE from 'three'
import type { Experience, ExperienceConstructor } from './Experience'
import { Resources } from './Resources'
import { Loader } from './common/Loader'

export class PipelineEngine {
  private readonly name: string
  public canvas!: HTMLCanvasElement
  public camera!: THREE.Camera
  public scene!: THREE.Scene
  public renderer!: THREE.Renderer
  public resources!: Resources
  private readonly experienceConstructor!: ExperienceConstructor
  private experience!: Experience
  private readonly loader!: Loader
  private clock: THREE.Clock
  public deltaTime: number = 0
  public currentTime: number = 0

  constructor(name: string, experienceConstructor: ExperienceConstructor) {
    this.name = name

    if (!experienceConstructor) {
      throw new Error('No experience provided')
    }

    this.clock = new THREE.Clock()
    this.experienceConstructor = experienceConstructor
    this.loader = new Loader()
  }

  private onStart({ canvas }: { canvas: HTMLCanvasElement }) {
    const { scene, camera, renderer } = XR8.Threejs.xrScene()

    this.canvas = canvas
    this.scene = scene
    this.camera = camera
    this.renderer = renderer

    this.experience = new this.experienceConstructor(this)
    this.resources = new Resources(this.experience.resources)

    this.resources.on('loaded', () => {
      this.experience.init()
      this.loader.complete()
    })

    this.resources.on('progress', (progress: number) => {
      this.loader.setProgress(progress)
    })

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

  public getPiplineMoudle() {
    const that = this

    const onStart = (event: { canvas: any }) => {
      that.onStart(event)
    }

    const onUpdate = () => {
      const elapsedTime = this.clock.getElapsedTime()
      that.deltaTime = elapsedTime - that.currentTime
      this.currentTime = elapsedTime
      that.experience.update(that.deltaTime)
    }

    const imagescanning = (event: { detail: any }) => {
      if (that.experience && that.experience.constructGeometry) {
        that.experience.constructGeometry(event)
      }
    }

    const imagefound = (event: { detail: any }) => {
      if (that.experience && that.experience.firstFindTarget) {
        that.experience.firstFindTarget(event)
      }
    }

    const imageupdated = (event: { detail: any }) => {
      if (that.experience && that.experience.showTarget) {
        that.experience.showTarget(event)
      }
    }

    const imagelost = (event: { detail: any }) => {
      if (that.experience && that.experience.hideTarget) {
        that.experience.hideTarget(event)
      }
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
