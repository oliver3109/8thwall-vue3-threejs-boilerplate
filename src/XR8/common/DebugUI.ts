import Stats from 'three/examples/jsm/libs/stats.module.js'
import VConsole from 'vconsole'

let instance: DebugUI | null = null

export class DebugUI {
  stats!: Stats

  constructor() {
    if (instance) {
      return this
    }
    instance = this

    if (import.meta.env.DEV) {
      this.stats = new Stats()
      document.body.appendChild(this.stats.dom)
      this.stats.dom.style.display = 'block'

      new VConsole()
    }
  }

  update() {
    if (this.stats) {
      this.stats.update()
    }
  }
}
