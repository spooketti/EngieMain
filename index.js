import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(90,window.innerWidth / window.innerHeight,0.1,10000);

camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();

loader.load(
    'maps/badwater.glb',

    (gltf) => {
        const map = gltf.scene;
        scene.add(map);
        const box = new THREE.Box3().setFromObject(map);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        map.position.sub(center);
        const maxSize = Math.max(size.x,size.y,size.z);
        camera.position.set(maxSize,maxSize * 0.7,maxSize);
        controls.target.set(0, 0, 0);
        controls.update();
        console.log('loaded');
    },

    undefined,

    (error) => {
        console.error('map load fail', error);
    }
);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
