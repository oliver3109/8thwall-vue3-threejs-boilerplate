export {}

export interface XRScene {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.Renderer
}

export interface XR8 {
  addCameraPipelineModule: (parameter: any) => void
  addCameraPipelineModules: (parameter: any) => void
  initialize: (parameter: any) => void
  version: () => string
  Threejs: {
    xrScene: () => XRScene
  }
  XrController: {
    recenter: () => void
    updateCameraProjectionMatrix: (parameter: any) => void
  }
}

declare global {
  interface Window {
    XR8: XR8
    LandingPage: any
    XRExtras: any
  }
  const XR8: XR8
  const XRExtras: any
}
