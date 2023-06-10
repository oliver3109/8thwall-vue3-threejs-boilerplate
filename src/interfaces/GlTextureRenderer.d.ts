export interface GlTextureRenderer {
  /**
   * Creates a pipeline module that draws the camera feed to the canvas.
   * @returns
   */
  pipelineModule: () => void
}
