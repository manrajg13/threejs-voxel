import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

var model
var clicked = false

// compresses model at the  cost of some decoding time
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#1c1522')

// setting WebGL Renderer dimensions according to window dimensions
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

const container = document.createElement('div')
document.body.appendChild(container)
container.appendChild(renderer.domElement)

// camera positioning and dimensions
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100)
camera.position.set(6, 5, 6)
scene.add(camera)

// event listeners for window resizing and orbit controls
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(2)
})

container.addEventListener('mousedown', function (event) {
    clicked = true
})

container.addEventListener('mouseup', function (event) {
    clicked = false
})

// lighting
const ambient = new THREE.AmbientLight(0xa0a0fc, 1.2)
scene.add(ambient)

const sunLight = new THREE.PointLight(0xffd178, 1.0)
sunLight.position.set(-10, 12, 5)
scene.add(sunLight)

// loading glb model
loader.load('model.glb', function (gltf) {
    model = gltf.scene
    model.position.y = -1
    scene.add(gltf.scene)
})

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement)

function setOrbitControlsLimits(){
    controls.enableDamping = true
    controls.enableRotate = true
    controls.enableZoom = true

    controls.dampingFactor = 0.10
    controls.maxPolarAngle = Math.PI /2.0
    controls.minPolarAngle = Math.PI /5.0
}

// putting it all together
function renderLoop() {
    // only rotate if nothing clicked
    if (model && !clicked) model.rotation.y += 0.01

    setOrbitControlsLimits()
    requestAnimationFrame(renderLoop)
    controls.update()
    renderer.render(scene, camera)
}

renderLoop()