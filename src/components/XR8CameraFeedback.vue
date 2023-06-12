<script setup lang="ts">
import { ref } from 'vue'
import { useXR8 } from '@/XR8'
import { ImageTargetTrackingPipelineModule } from '@/XR8/PipelineModules/ImageTargetTracking'

const emit = defineEmits(['initialized'])

const camerafeed = ref(null)

const imageTargetTrackingPipelineModule = new ImageTargetTrackingPipelineModule(
  'image-target-tracking'
)

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
  [imageTargetTrackingPipelineModule.getX8RPiplineMoudle()],
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
