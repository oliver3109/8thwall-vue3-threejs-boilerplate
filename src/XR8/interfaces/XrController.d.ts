export interface XrControllerConfigure {
  /**
   * If true, turn off SLAM tracking for efficiency.
   * This needs to be done BEFORE XR8.run() is called.
   */
  disableWorldTracking?: boolean

  /**
   * If true, lighting will be provided by
   * XR8.XrController.pipelineModule() as processCpuResult.reality.lighting
   */
  enableLighting?: boolean

  /**
   * If true, worldPoints will be provided by
   * XR8.XrController.pipelineModule() as processCpuResult.reality.worldPoints.
   */
  enableWorldPoints?: boolean

  // TODO
}

export interface UpdateCameraProjectionMatrixParameters {
  origin: { x: number; y: number; z: number }
  facing: { w: number; x: number; y: number; z: number }
}

export interface XrController {
  /**
   * Configures the processing performed
   * by XrController (some settings may have performance implications).
   * @param config
   * @returns
   */
  configure: (config: ConfigureParameters) => boolean

  recenter: () => void

  /**
   * Reset the scene's display geometry and the camera's starting position
   * in the scene. The display geometry is needed to properly overlay
   * the position of objects in the virtual scene on top of their corresponding
   * position in the camera image. The starting position specifies where
   * the camera will be placed and facing at the start of a session.
   * @param parameter
   * @returns
   */
  updateCameraProjectionMatrix: (parameter: UpdateCameraProjectionMatrixParameters) => void

  /**
   * Creates a camera pipeline module that, when installed,
   * receives callbacks on when the camera has started,
   * camera proessing events, and other state changes.
   * These are used to calculate the camera's position.
   * @returns
   */
  pipelineModule: () => void
}

export interface ImageLoading {
  detail: {
    imageTargets: Array<{ name: string; type: string; metadata: any }>
  }
}

export interface ImageScanning {
  detail: {
    imageTargets: Array<{
      geometry: {
        scaledWidth: number
        scaledHeight: number
        height: number
        radiusTop: number
        radiusBottom: number
        arcStartRadians: number
        arcLengthRadians: number
      }
      metadata: any
      name: string
      properties: {
        moveable: boolean
        physicalWidthInMeters: number
        left: number
        top: number
        width: number
      }
      type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL'
    }>
  }
  name: 'reality.imagescanning'
}

export interface ImageUpdated {
  detail: {
    name: string
    type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL'
    position: THREE.Vector3
    rotation: THREE.Vector4
    scale: number
    scaledWidth: number
    scaledHeight: number
    height: number
    radiusTop: number
    radiusBottom: number
    arcStartRadians: number
    arcLengthRadians: number
  }
  name: 'reality.imageupdated'
}

export interface ImageLoast {
  detail: {
    name: string
    type: 'FLAT' | 'CYLINDRICAL' | 'CONICAL'
    position: THREE.Vector3
    rotation: THREE.Vector4
    scale: number
    scaledWidth: number
    scaledHeight: number
    height: number
    radiusTop: number
    radiusBottom: number
    arcStartRadians: number
    arcLengthRadians: number
  }
  name: 'reality.imagelost'
}
