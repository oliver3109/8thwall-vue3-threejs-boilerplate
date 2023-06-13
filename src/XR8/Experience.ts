import type { GameEntity } from './GameEntity'
import type { PipelineEngine } from './PipelineEngine'
import type { Resource } from './Resources'
import type {
  ImageLoast,
  ImageUpdated,
  Imageloading,
  Imagescanning
} from './interfaces/XrController'

export type ExperienceConstructor = new (engine: PipelineEngine) => Experience

export interface Experience extends GameEntity {
  init(): void
  resources: Resource[]

  constructGeometry?(event: Imageloading): void
  firstFindTarget?(event: Imagescanning): void
  showTarget?(event: ImageUpdated): void
  hideTarget?(event: ImageLoast): void
}
