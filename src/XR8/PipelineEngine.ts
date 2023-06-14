import * as THREE from 'three'
import type { Experience, ExperienceConstructor } from './Experience'
import { Resources } from './Resources'
import { Loader } from './common/Loader'
import { EventEmitter } from './utilities/EventEmitter'
import type {
  ImageLoading,
  ImageLost,
  ImageScanning,
  ImageUpdated
} from './interfaces/XrController'
import { DebugUI } from './common/DebugUI'

export class PipelineEngine extends EventEmitter {
  private readonly name: string
  public canvas!: HTMLCanvasElement
  public camera!: THREE.Camera
  public scene!: THREE.Scene
  public renderer!: THREE.Renderer
  public readonly debug: DebugUI
  public resources!: Resources
  private readonly experienceConstructor!: ExperienceConstructor
  private experience!: Experience
  private readonly loader!: Loader
  private clock: THREE.Clock
  public deltaTime: number = 0
  public currentTime: number = 0

  constructor(name: string, experienceConstructor: ExperienceConstructor) {
    super()
    this.name = name

    if (!experienceConstructor) {
      throw new Error('No experience provided')
    }

    this.clock = new THREE.Clock()
    this.experienceConstructor = experienceConstructor
    this.loader = new Loader()
    this.debug = new DebugUI()
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

      this.debug.update()
    }

    const imageloading = (event: ImageLoading) => {
      that.emit('reality.imageloading', event)
    }

    const imagescanning = (event: ImageScanning) => {
      if (that.experience && that.experience.constructGeometry) {
        that.experience.constructGeometry(event)
      }
      that.emit('reality.imagescanning', event)
    }

    const imagefound = (event: ImageScanning) => {
      if (that.experience && that.experience.firstFindTarget) {
        that.experience.firstFindTarget(event)
      }
      that.emit('reality.imagefound', event)
    }

    const imageupdated = (event: ImageUpdated) => {
      if (that.experience && that.experience.showTarget) {
        that.experience.showTarget(event)
      }
      that.emit('reality.imageupdated', event)
    }

    const imagelost = (event: ImageLost) => {
      if (that.experience && that.experience.hideTarget) {
        that.experience.hideTarget(event)
      }
      that.emit('reality.imagelost', event)
    }

    return {
      name: that.name,

      onStart,

      onUpdate,

      // Listeners are called right after the processing stage that fired them. This guarantees that
      // updates can be applied at an appropriate synchronized point in the rendering cycle.
      listeners: [
        { event: 'reality.imageloading', process: imageloading },
        { event: 'reality.imagescanning', process: imagescanning },
        { event: 'reality.imagefound', process: imagefound },
        { event: 'reality.imageupdated', process: imageupdated },
        { event: 'reality.imagelost', process: imagelost }
      ]
    }
  }
}
