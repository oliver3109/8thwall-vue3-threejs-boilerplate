import type { Experience } from '@/XR8/Experience'
import type { PipelineEngine } from '@/XR8/PipelineEngine'
import type { Resource } from '@/XR8/Resources'
import * as THREE from 'three'

export class ImageTrackingDemo implements Experience {
  resources: Resource[] = []

  constructor(private engine: PipelineEngine) {
    // Set the initial camera position relative to the scene we just arranged. This must be in the
    // The height is greater than y=0.
    engine.camera.position.set(0, 0, 5)
  }

  async init() {
    // Add soft white light to the scene.
    // This light cannot be used to cast shadows because it has no direction.
    this.engine.scene.add(new THREE.AmbientLight(0xffffff, 9))

    // Create a 3D coordinate axis
    const axesHelper = new THREE.AxesHelper(150)
    this.engine.scene.add(axesHelper)

    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)
    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.67
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    this.engine.scene.add(plane)
  }

  update() {}
}
