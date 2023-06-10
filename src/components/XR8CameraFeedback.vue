<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'

const windowWidth = ref(0)
const windowheight = ref(0)

const emit = defineEmits(['initialized'])

export interface XR8CameraFeedbackProps {
  disableWorldTracking?: boolean // Is disable world tracking
  enableCanvasScreenshot?: boolean // Is screenshot enabled
}

const props = withDefaults(defineProps<XR8CameraFeedbackProps>(), {
  disableWorldTracking: false,
  enableCanvasScreenshot: false
})

const onxrloaded = () => {
  XR8.XrController.configure({ disableWorldTracking: props.disableWorldTracking })

  if (props.enableCanvasScreenshot) {
    XR8.CanvasScreenshot.configure({ maxDimension: window.innerHeight, jpgCompression: 100 })
  }

  // Existing pipeline modules.
  XR8.addCameraPipelineModules([
    // Provides a camera pipeline module that draws the camera feed to a canvas as well as extra utilities for GL drawing operations.
    XR8.GlTextureRenderer.pipelineModule(),
    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(), // Enables SLAM tracking.
    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.

    // XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule() // Shows an error image on runtime error.
  ])

  if (props.enableCanvasScreenshot) {
    // Provides a camera pipeline module that can generate screenshots of the current scene.
    XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule())
  }

  // Open the camera and start running the camera run loop.
  XR8.run({ canvas: document.getElementById('camerafeed') as HTMLCanvasElement })
}

/**
 * Completed during WebAssembly initialization of AR engine.
 */
const initialize = () => {
  if (XR8.isInitialized()) {
    console.log('✅', 'XR8 running')
    console.log(XR8.version())
    emit('initialized', XR8)
  }
}

/**
 * Turn off the XR8 camera feed and the device movement
 * is not tracked, remove all camera pipeline modules.
 */
const destroyXR8 = () => {
  XR8.stop()
  XR8.clearCameraPipelineModules()
}

onMounted(() => {
  windowWidth.value = document.body.clientWidth
  windowheight.value = document.body.clientHeight

  // Show loading screen before the full XR library has been loaded.
  XRExtras.Loading.showLoading({ onxrloaded })

  XR8.initialize().then(initialize)
})

onUnmounted(() => {
  destroyXR8()
})
</script>

<template>
  <canvas id="camerafeed" type="webgl" :width="windowWidth" :height="windowheight"></canvas>
</template>
