import {
  unrefElement,
  type MaybeRefOrGetter,
  tryOnMounted,
  tryOnScopeDispose,
  tryOnUnmounted,
  defaultWindow,
  useSupported
} from '@vueuse/core'
import type { XrControllerConfigure } from './interfaces/XrController'
import type { CanvasScreenshotConfigure } from './interfaces/CanvasScreenshot'
import type { XR8 } from './interfaces/XR8'
import { ref, watch } from 'vue'

export interface XR8Options {
  window?: Window & typeof globalThis
  customThreejsPipelineModule?: () => any
  XrControllerConfigure?: XrControllerConfigure
  CanvasScreenshotConfigure?: CanvasScreenshotConfigure
}

export interface XR8EventCallback {
  initialized?: (xr8Instance: XR8) => void
  stop?: () => void
}

/**
 * initialization XR8 instance
 *
 * @param el
 * @param options
 */
export function useXR8(
  el: MaybeRefOrGetter<HTMLElement | null | undefined> | string,
  options: XR8Options,
  pipelineModules: Array<any> = [],
  callback?: XR8EventCallback
) {
  const { window = defaultWindow } = options

  const isSupported = ref<boolean>(false)

  const canvasWidth = ref(0)
  const canvasHeight = ref(0)

  const isXR8Loaded = async () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(useSupported(() => window && 'XR8' in window).value)
      }, 200)
    })
  }

  /**
   * Starting initialization
   * @returns
   */
  const start = () => {
    const target = typeof el === 'string' ? document?.querySelector(el) : unrefElement(el)
    if (!target) return

    XRExtras.Loading.showLoading({
      onxrloaded: () => {
        if (options.XrControllerConfigure) {
          XR8.XrController.configure(options.XrControllerConfigure)
        }

        if (options.CanvasScreenshotConfigure) {
          XR8.CanvasScreenshot.configure(options.CanvasScreenshotConfigure)
        }

        XR8.addCameraPipelineModules([
          // Provides a camera pipeline module that draws the camera feed to a canvas as well as extra utilities for GL drawing operations.
          XR8.GlTextureRenderer.pipelineModule(),
          // Enables SLAM tracking.
          XR8.XrController.pipelineModule(),
          // Modifies the canvas to fill the window.
          XRExtras.FullWindowCanvas.pipelineModule(),
          // Manages the loading screen on startup.
          XRExtras.Loading.pipelineModule(),
          // Shows an error image on runtime error.
          XRExtras.RuntimeError.pipelineModule(),

          /** VPS */
          // Detects unsupported browsers and gives hints.
          XRExtras.AlmostThere.pipelineModule()
        ])

        // No provided customization threejs pipeline module
        if (!options.customThreejsPipelineModule) {
          XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule()) // Creates a ThreeJS AR Scene.
        } else {
          XR8.addCameraPipelineModule(options.customThreejsPipelineModule()) // Creates a customization ThreeJS AR Scene.
        }

        if (options.CanvasScreenshotConfigure) {
          // Provides a camera pipeline module that can generate screenshots of the current scene.
          XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule())
        }

        // Add custom pipeline
        XR8.addCameraPipelineModules(pipelineModules)

        // Open the camera and start running the camera run loop.
        XR8.run({ canvas: target as HTMLCanvasElement })
      }
    })

    XR8.initialize().then(initialize)
  }

  /**
   * Stop XR8 instance
   */
  const stop = () => {
    console.log('✅', 'XR8 stopping')
    XR8.stop()
    XR8.clearCameraPipelineModules()
    callback && callback.stop && callback.stop()
  }

  /**
   * Completed during WebAssembly initialization of AR engine.
   */
  const initialize = () => {
    if (XR8.isInitialized()) {
      console.log('✅', 'XR8 running')
      console.log(XR8.version())
      callback && callback.initialized && callback.initialized(XR8)
    }
  }

  watch(
    () => isSupported.value,
    (hasXR8) => {
      if (hasXR8) start()
    },
    {
      deep: true,
      immediate: true
    }
  )

  tryOnMounted(async () => {
    for (let i = 0; i < 10; i++) {
      const _isSupport = await isXR8Loaded()
      isSupported.value = _isSupport
      if (_isSupport) {
        break
      }
    }
    canvasWidth.value = document.body.clientWidth
    canvasHeight.value = document.body.clientHeight
  })
  tryOnUnmounted(stop)
  tryOnScopeDispose(stop)

  const getXR8Instance = (): XR8 => {
    return XR8
  }

  return { start, stop, getXR8Instance, canvasWidth, canvasHeight }
}

export type UseXR8Return = ReturnType<typeof useXR8>
