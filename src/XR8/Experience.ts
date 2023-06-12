import type { GameEntity } from './GameEntity'
import type { PipelineEngine } from './PipelineEngine'
import type { Resource } from './Resources'

export type ExperienceConstructor = new (engine: PipelineEngine) => Experience

export interface Experience extends GameEntity {
  init(): void
  resources: Resource[]

  constructGeometry?(event: any): void
  firstFindTarget?(event: any): void
  showTarget?(event: any): void
  hideTarget?(event: any): void
}
