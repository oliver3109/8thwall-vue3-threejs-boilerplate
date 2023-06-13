<script setup lang="ts">
import type { ImageLoast, ImageScanning, ImageUpdated } from '@/XR8/interfaces/XrController'
import XR8CameraFeedback from '@/components/XR8CameraFeedback.vue'

const onInitialized = () => {
  console.log('💡', 'initialized')
}

const onImageScanning = (event: ImageScanning) => {
  console.log('💡', 'imagescanning', event)
}

const onImageFound = (event: ImageUpdated) => {
  console.log('💡', 'imagefound', event)
}

const onImageUpdated = (event: ImageUpdated) => {
  console.log('💡', 'imageupdated', event)
}

const onImageLost = (event: ImageLoast) => {
  console.log('💡', 'imagelost', event)
}
</script>

<template>
  <XR8CameraFeedback
    @initialized="onInitialized"
    @imagescanning="onImageScanning"
    @imagefound="onImageFound"
    @imageupdated="onImageUpdated"
    @imagelost="onImageLost"
  />
</template>
