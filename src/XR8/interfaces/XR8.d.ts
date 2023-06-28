import type { CanvasScreenshot } from './CanvasScreenshot'
import type { XrController } from './XrController'
import type { GlTextureRenderer } from './GlTextureRenderer'
import type { Threejs, XRScene } from './Three'
import type { run } from './Run'
import type { stop } from './Stop'

export {}

export interface XR8 {
  /**
   * 8th Wall camera applications are built
   * using a camera pipeline module framework.
   * For a full description on camera pipeline modules,
   * see [CameraPipelineModule](https://www.8thwall.com/docs/api/camerapipelinemodule/).
   * @param parameter
   * @returns
   */
  addCameraPipelineModule: (parameter: any) => void

  /**
   * Add multiple camera pipeline modules.
   * This is a convenience method that calls [XR8.addCameraPipelineModule()](https://www.8thwall.com/docs/api/xr8/addcamerapipelinemodule/)
   * in order on each element of the input array.
   * @param parameter
   * @returns
   */
  addCameraPipelineModules: (parameter: any) => void

  /**
   * Remove all camera pipeline modules from the camera loop.
   * @returns
   */
  clearCameraPipelineModules: () => void

  /**
   * Returns a promise that is fulfilled when
   * the AR Engine's WebAssembly is initialized.
   * @param parameter
   * @returns
   */
  initialize: () => Promise<void>

  /**
   * Indicates whether or not the AR Engine's WebAssembly is initialized.
   * @returns A Boolean indicating whether or not the AR Engine's WebAssembly is initialized.
   */
  isInitialized: () => boolean

  /**
   * Get the 8th Wall Web engine version.
   * @returns A string indicating the 8th Wall Web engine version.
   */
  version: () => string

  run: run

  stop: stop

  /**
   * Provides a camera pipeline module
   * that can generate screenshots of the current scene.
   */
  CanvasScreenshot: CanvasScreenshot

  /**
   * Provides a camera pipeline module that draws the camera feed to
   * a canvas as well as extra utilities for GL drawing operations.
   */
  GlTextureRenderer: GlTextureRenderer

  /**
   * Provides a camera pipeline module that drives three.js camera
   * to do virtual overlays.
   */
  Threejs: Threejs

  /**
   * XrController provides 6DoF camera tracking
   * and interfaces for configuring tracking.
   */
  XrController: XrController

  // TODO
}

declare global {
  interface Window {
    XR8: XR8
    LandingPage: any
    XRExtras: any
    Threejs: {
      xrScene: () => XRScene
    }
  }
  const XR8: XR8
  const XRExtras: any
}
