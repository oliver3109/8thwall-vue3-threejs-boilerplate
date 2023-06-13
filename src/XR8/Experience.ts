import type { GameEntity } from './GameEntity'
import type { PipelineEngine } from './PipelineEngine'
import type { Resource } from './Resources'
import type { ImageLoast, ImageUpdated, ImageScanning } from './interfaces/XrController'

export type ExperienceConstructor = new (engine: PipelineEngine) => Experience

export interface Experience extends GameEntity {
  init(): void
  resources: Resource[]

  constructGeometry?(event: ImageScanning): void
  firstFindTarget?(event: ImageScanning): void
  showTarget?(event: ImageUpdated): void
  hideTarget?(event: ImageLoast): void
}
