/**
 * XR8.run()
 * XR8.run(canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, sessionConfiguration)
 * https://www.8thwall.com/docs/api/xr8/run/
 */

export interface RunParameters {
  /**
   * The HTML Canvas that the camera feed will be drawn to.
   */
  canvas: HTMLCanvasElement

  /**
   * If true, use WebGL2 if available, otherwise fallback to WebGL1.
   * If false, always use WebGL1.
   */
  webgl2?: boolean

  /**
   * If true, XR should use it's own run loop.
   * If false, you will provide your own run loop and be responsible
   * for calling runPreRender and [runPostRender](https://www.8thwall.com/docs/api/xr8/runpostrender/)
   * yourself [Advanced Users only]
   */
  ownRunLoop?: boolean

  /**
   * Desired camera to use. Supported values for direction
   * are XR8.XrConfig.camera().BACK or XR8.XrConfig.camera().FRONT
   */
  cameraConfig?: any // TODO

  // TODO...
}

export type run = (config: RunParameters) => void
