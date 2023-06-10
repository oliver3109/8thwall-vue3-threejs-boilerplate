export interface ConfigureParameters {
  maxDimension?: number
  jpgCompression?: number
}

export interface CanvasScreenshot {
  /**
   * Configures the expected result of canvas screenshots.
   * @param config
   * @returns
   */
  configure: (config: ConfigureParameters) => void

  /**
   * Creates a camera pipeline module that, when installed,
   * receives callbacks on when the camera has started
   * and when the canvas size has changed.
   * @returns
   */
  pipelineModule: () => void

  /**
   * Returns a Promise that when resolved, 
   * provides a buffer containing the JPEG compressed image. 
   * When rejected, an error message is provided.
   * @returns
   */
  takeScreenshot: () => Promise<string>
}
