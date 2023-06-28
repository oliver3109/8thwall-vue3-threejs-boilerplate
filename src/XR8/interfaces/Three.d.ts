import type { WebGLRenderer } from 'three'

export interface XRScene {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.Renderer | WebGLRenderer
  bloomComposer?: any
  composer?: any
}

export interface Threejs {
  /**
   * Get a handle to the xr scene, camera, renderer, (optional)
   * camera feed texture, and (optional) layerScenes.
   * @returns An object: { scene, camera, renderer, cameraTexture, layerScenes }
   */
  xrScene: () => XRScene

  /**
   * A pipeline module that interfaces with the three.js environment and lifecyle.
   * The three.js scene can be queried using XR8.
   * Threejs.xrScene() after XR8.Threejs.pipelineModule()'s onStart method is called.
   * Setup can be done in another pipeline module's onStart method by referring to XR8.
   * Threejs.xrScene() as long as XR8.addCameraPipelineModule() is
   * called on the second module after calling XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule()).
   *
   * - onStart, a three.js renderer and scene are created and configured to draw over a camera feed.
   * - onUpdate, the three.js camera is driven with the phone's motion.
   * - onRender, the renderer's render() method is invoked.
   *
   * Note that this module does not actually draw the camera feed to the canvas,
   * GlTextureRenderer does that. To add a camera feed in the background,
   * install the XR8.GlTextureRenderer.pipelineModule() before installing
   * this module (so that it is rendered before the scene is drawn).
   * @returns
   */
  pipelineModule: () => void
}
