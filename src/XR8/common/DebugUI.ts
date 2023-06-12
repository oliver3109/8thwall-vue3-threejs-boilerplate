import * as lilGui from 'lil-gui'
import Stats from 'three/examples/jsm/libs/stats.module.js'

let instance: DebugUI | null = null

export class DebugUI {
  gui!: lilGui.GUI
  stats!: Stats

  constructor() {
    if (instance) {
      return this
    }

    instance = this

    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)

    this.gui = new lilGui.GUI()

    if (!window.location.search.includes('debug')) {
      this.gui.hide()
      this.stats.dom.style.display = 'none'
    }

    this.gui.show()
    this.stats.dom.style.display = 'block'

    // this.gui.hide()
    // this.stats.dom.style.display = 'none'
  }

  update() {
    if (this.stats) {
      this.stats.update()
    }
  }
}
