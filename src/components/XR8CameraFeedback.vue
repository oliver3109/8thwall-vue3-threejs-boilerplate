<script setup lang="ts">
import { ref } from 'vue'
import { useXR8 } from '@/XR8'
import { PipelineEngine } from '@/XR8/PipelineEngine'
import { ImageTrackingDemo } from '../Demos/ImageTrackingDemo'
import type { ImageLoast, ImageUpdated, ImageScanning } from '@/XR8/interfaces/XrController'

const emit = defineEmits([
  'initialized',
  'imagescanning',
  'imagefound',
  'imageupdated',
  'imagelost'
])

const camerafeed = ref(null)

const imageTargetTracking = new PipelineEngine('image-target-tracking', ImageTrackingDemo)

const { canvasWidth, canvasHeight } = useXR8(
  camerafeed,
  {
    XrControllerConfigure: {
      disableWorldTracking: false
    },
    CanvasScreenshotConfigure: {
      maxDimension: window.innerHeight,
      jpgCompression: 100
    }
  },
  [imageTargetTracking.getPiplineMoudle()],
  {
    initialized() {
      emit('initialized')
    }
  }
)

imageTargetTracking.on('reality.imagescanning', (event: ImageScanning) => {
  emit('imagescanning', event)
})
imageTargetTracking.on('reality.imagefound', (event: ImageUpdated) => {
  emit('imagefound', event)
})
imageTargetTracking.on('reality.imageupdated', (event: ImageUpdated) => {
  emit('imageupdated', event)
})
imageTargetTracking.on('reality.imagelost', (event: ImageLoast) => {
  emit('imagelost', event)
})
</script>

<template>
  <canvas ref="camerafeed" type="webgl" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>
