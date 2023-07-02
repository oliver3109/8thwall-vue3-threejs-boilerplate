import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EventEmitter } from './utilities/EventEmitter'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// three@152 TTFLoader -> FontLoader
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader'

export type Resource =
  | {
      name: string
      type: Exclude<AssetType, 'cubeTexture'>
      path: string
    }
  | {
      name: string
      type: 'cubeTexture'
      path: string[]
    }

type AssetType = 'gltf' | 'texture' | 'cubeTexture' | 'font'

type Loaders = {
  gltf: GLTFLoader
  texture: THREE.TextureLoader
  cubeTexture: THREE.CubeTextureLoader
  font: TTFLoader
}

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
dracoLoader.preload()

export class Resources extends EventEmitter {
  private loadingManager = new THREE.LoadingManager(
    () => {
      this.emit('loaded')
    },
    // @ts-ignore
    (url: string, item: number, total: number) => {
      this.emit('progress', item / total)
    },
    (url: string) => {
      console.error(`Failed to load ${url}`)
    }
  )
  private loaders!: Loaders
  public items: Record<string, any> = {}

  constructor(private readonly resources: Resource[]) {
    super()
    this.initLoaders()
    this.load()
  }

  private initLoaders() {
    this.loaders = {
      gltf: new GLTFLoader(this.loadingManager),
      texture: new THREE.TextureLoader(this.loadingManager),
      cubeTexture: new THREE.CubeTextureLoader(this.loadingManager),
      font: new TTFLoader(this.loadingManager)
    }
  }

  getItem(name: string) {
    const item = this.items[name]
    if (!item) {
      throw new Error(`Resource ${name} not found`)
    }
    return item
  }

  load() {
    if (this.resources.length === 0) {
      setTimeout(() => {
        this.emit('loaded')
      })
    }

    for (const resource of this.resources) {
      switch (resource.type) {
        case 'gltf':
          this.loaders.gltf.setDRACOLoader(dracoLoader)
          this.loaders.gltf.load(resource.path, (file) => (this.items[resource.name] = file))
          break
        case 'texture':
          this.loaders.texture.load(resource.path, (file) => (this.items[resource.name] = file))
          break
        case 'cubeTexture':
          this.loaders.cubeTexture.load(resource.path, (file) => (this.items[resource.name] = file))
          break
        case 'font':
          this.loaders.font.load(resource.path, (file) => (this.items[resource.name] = file))
          break
      }
    }
  }
}
