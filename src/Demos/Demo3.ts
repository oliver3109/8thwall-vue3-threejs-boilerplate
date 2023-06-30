import type { Experience } from '@/XR8/Experience'
import type { PipelineEngine } from '@/XR8/PipelineEngine'
import type { Resource } from '@/XR8/Resources'
import * as THREE from 'three'

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: 'ion',
      path: './models/ion.glb',
      type: 'gltf'
    }
  ]

  mixer: THREE.AnimationMixer | undefined

  constructor(private engine: PipelineEngine) {
    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    this.engine.camera.position.set(0, 2, 2)
  }

  async init() {
    // Enable shadows in the renderer.
    // renderer.shadowMap.enabled = true
    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    this.engine.scene.add(directionalLight)

    const gltf = this.engine.resources.getItem('ion')
    const model = gltf.scene
    // model.castShadow = true
    model.position.set(0, 1, 0)
    // animate the model
    this.mixer = new THREE.AnimationMixer(model)
    const animation = gltf.animations[0]
    const action = this.mixer.clipAction(animation)
    action.play()

    this.engine.scene.add(model)
  }

  resize() {}

  update() {
    if (this.mixer) this.mixer.update(this.engine.deltaTime)
  }
}
