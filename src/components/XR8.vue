<script setup lang="ts">
import { onMounted, ref } from 'vue'

const onxrloaded = () => {
  XR8.XrController.configure({ disableWorldTracking: false })
  XR8.addCameraPipelineModules([
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XRExtras.AlmostThere.pipelineModule(),
    XR8.Threejs.pipelineModule(), // Creates a ThreeJS AR Scene.
    // XR8.XrController.pipelineModule(), // Enables SLAM tracking.
    window.LandingPage.pipelineModule(), // Detects unsupported browsers and gives hints.
    // XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule() // Shows an error image on runtime error.
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({ canvas: document.getElementById('camerafeed') })

  console.log('✅', 'XR8 running')
}

const windowWidth = ref(0)
const windowheight = ref(0)

onMounted(() => {
  windowWidth.value = window.innerWidth
  windowheight.value = window.innerHeight
  window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
})
</script>

<template>
  <canvas id="camerafeed" :width="windowWidth" :height="windowheight"></canvas>
</template>
