import type { Experience } from '@/XR8/Experience'
import type { PipelineEngine } from '@/XR8/PipelineEngine'
import type { Resource } from '@/XR8/Resources'
import * as THREE from 'three'
import { InstancedFlow } from 'three/examples/jsm/modifiers/CurveModifier'
import {
  TextGeometry,
  type TextGeometryParameters
} from 'three/examples/jsm/geometries/TextGeometry'
import type { ImageLost, ImageUpdated } from '@/XR8/interfaces/XrController'

const TEXT = ['君不见黄河之水天上来']

/**
 * create geometric text
 */
export const createTextGeometry = (text: string, config?: TextGeometryParameters) => {
  const def = {
    size: 1,
    height: 3,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 5
  }
  Object.assign(def, config)
  return new TextGeometry(text, def as TextGeometryParameters)
}

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: 'textFont',
      path: './fonts/FZBangShuKaiS-R-GB_Regular.json',
      type: 'font'
    }
  ]

  private flowList: { flow: InstancedFlow; curve: THREE.CatmullRomCurve3 }[] = [] // 流列表

  // target Container
  private readonly targetContainer!: THREE.Group

  // hide object
  private readonly hiderObj: THREE.Object3D = this.createTargetObjectHideMask(0.7, 0.8)

  constructor(private engine: PipelineEngine) {
    engine.camera.position.set(0, 0, 5)

    const axesHelper = new THREE.AxesHelper(10)
    engine.scene.add(axesHelper)

    engine.scene.add(new THREE.AmbientLight(0x404040, 5))

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.castShadow = true
    directionalLight.position.set(0, 50, 0)
    engine.scene.add(directionalLight)

    engine.scene.add(this.hiderObj)

    engine.scene.add(this.targetContainer)
  }

  async init() {
    // Initialize Curve List
    const pointList = this.initCurvesPoint(TEXT.length, new THREE.Vector3(0, 0, 0))
    const curves = this.initCatmullRomCurve3List(pointList)

    const font = this.engine.resources.getItem('textFont')
    for (const text of TEXT) {
      const textGeometry = createTextGeometry(text, {
        font,
        size: 0.05,
        height: 0.01 /* Text thickness */,
        curveSegments: 12 /* Number of curve points (5 reduces optimization performance) */,
        bevelEnabled: false /* Whether to turn on bevel */,
        bevelThickness: 0.01 /* bevel depth  */,
        bevelSize: 0.01 /* The extension distance between the oblique angle and the original text outline */,
        bevelSegments: 3 /* The number of segments in the diagonal (3 reduces optimization performance) */,
        bevelOffset: 0 /* Bevel offset */
      })
      textGeometry.rotateX(-Math.PI)
      const { curve } = curves[THREE.MathUtils.randInt(0, curves.length - 1)]
      const flow = this.createCurvesFlow(curve, textGeometry)
      this.flowList.push({ flow, curve })

      this.engine.scene.add(flow.object3D)
    }
  }

  resize() {}

  update() {
    for (const item of this.flowList) {
      const { flow, curve } = item
      flow.updateCurve(0, curve)
      flow.moveAlongCurve(0.0009)
    }
  }

  private createTargetObjectHideMask(scaledWidth: number, scaledHeight: number) {
    const width = 0.75 * scaledWidth
    const height = 1.25 * scaledHeight
    const geometry = new THREE.PlaneGeometry(width, height)
    const hiderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    hiderMaterial.colorWrite = false
    const mesh = new THREE.Mesh(geometry, hiderMaterial)
    mesh.visible = false
    return mesh
  }

  private initCurvesPoint(count: number, centerVec: THREE.Vector3) {
    const point = []
    for (let i = 0; i < count; i++) {
      const r = 0.2
      point.push([
        {
          x: -r + centerVec.x,
          y: centerVec.y,
          z: -r + centerVec.z
        },
        {
          x: -r + centerVec.x,
          y: centerVec.y,
          z: r + centerVec.z
        },
        {
          x: r + centerVec.x,
          y: centerVec.y,
          z: r + centerVec.z
        },
        {
          x: r + centerVec.x,
          y: centerVec.y,
          z: -r + centerVec.z
        }
      ])
    }
    return point
  }

  private initCatmullRomCurve3List(pointList: { x: number; y: number; z: number }[][]) {
    const curves = [...pointList].map(function (curvePoints) {
      const curveVertices = curvePoints.map(function (handlePos) {
        const { x, y, z } = handlePos
        return new THREE.Vector3(x, y, z)
      })
      const curve = new THREE.CatmullRomCurve3(curveVertices)
      curve.curveType = 'centripetal'
      curve.closed = true
      const points = curve.getPoints(50)
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
      )
      return {
        curve,
        line
      }
    })

    return curves
  }

  private createCurvesFlow(curve: THREE.CatmullRomCurve3, geometry: TextGeometry) {
    const material = new THREE.MeshStandardMaterial({
      color: 0xf7ff00
    })
    const instanceCount = 1 // 曲线上实例数
    const flow = new InstancedFlow(instanceCount, 1, geometry, material)
    flow.updateCurve(0, curve)
    flow.setCurve(0, 0)
    flow.moveIndividualAlongCurve(0, THREE.MathUtils.randFloat(0, 1))
    flow.object3D.setColorAt(0, new THREE.Color(0xffffff))
    return flow
  }

  showTarget({ detail }: ImageUpdated) {
    this.hiderObj.visible = true
    this.hiderObj.quaternion.copy(detail.rotation)
    this.hiderObj.scale.set(detail.scale, detail.scale, detail.scale)
    this.hiderObj.position.copy(detail.position)

    const pointList = this.initCurvesPoint(TEXT.length, detail.position)
    for (let i = 0; i < pointList.length; i++) {
      const { flow, curve } = this.flowList[i]

      const curveVertices = pointList[i].map(function (handlePos) {
        const { x, y, z } = handlePos
        return new THREE.Vector3(x, y, z)
      })
      curve.points = curveVertices
      flow.updateCurve(0, curve)
      flow.object3D.visible = true
    }
  }

  hideTarget({ detail }: ImageLost) {
    this.hiderObj.visible = false

    for (const { flow } of this.flowList) {
      flow.object3D.visible = true
    }
  }
}
