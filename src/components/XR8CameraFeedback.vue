<script setup lang="ts">
import { ref } from 'vue'
import { useXR8 } from '@/XR8'
import { PipelineEngine } from '@/XR8/PipelineEngine'
import { Demo } from './Demo'

const emit = defineEmits(['initialized'])

const camerafeed = ref(null)

const imageTargetTracking = new PipelineEngine('image-target-tracking', Demo)

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
</script>

<template>
  <canvas ref="camerafeed" type="webgl" :width="canvasWidth" :height="canvasHeight"></canvas>
</template>
