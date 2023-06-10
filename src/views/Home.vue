<script setup lang="ts">
import XR8CameraFeedback from '@/components/XR8CameraFeedback.vue'
import type { XR8 } from '../interfaces/XR8'
import { ImageTargetTrackingPipelineModule } from '../XR8PipelineModules/ImageTargetTracking'

const imageTargetTracking = new ImageTargetTrackingPipelineModule(
  'image-target-tracking-threejs-scene'
)

const onInitialized = (xr8Instance: XR8) => {
  console.log('👌', xr8Instance)

  xr8Instance.addCameraPipelineModule(imageTargetTracking.getX8RPiplineMoudle)
}
</script>

<template>
  <XR8CameraFeedback @initialized="onInitialized" />
</template>
