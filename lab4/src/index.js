import './style.scss';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';

const root = document.getElementById("root");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, root.offsetWidth * 0.995 / root.offsetHeight * 0.995, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const stats = new Stats();

renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

const cube1Geometry = new THREE.BoxGeometry(R1, R1, R1);
const cube2Geometry = new THREE.BoxGeometry(R2, R2, R2);

const cube1Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube2Material = new THREE.MeshBasicMaterial({ color: 0x0000ff });

const cube1 = new THREE.Mesh(cube1Geometry, cube1Material);
const cube2 = new THREE.Mesh(cube2Geometry, cube2Material);

parametres = {
    mass1: 10,
    mass2: 5,

    R1: 2,
    R2: 1,

    f: .5,

    force1: 10,
    force2: 0,

    F_arr: 1,
    F_arr: -1
}

function begin() {




}

function animate() {

    stats.begin();

    if (playAnim) {


    }

    renderer.render(scene, camera);
    controls.update();
    stats.end();
    requestAnimationFrame(animate);
}
function init() {
    camera.position.z = 10;
    camera.position.x = 5;
    renderer.setClearColor(0x8abdff, 1);

    const floorGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00, wireframe: true });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    scene.add(cube);
    cube.position.y = parametres.height;
    cube.position.x = 0;
    cube.position.z = 0;

    scene.add(floor);
    floor.rotateX(-Math.PI / 2);
    floor.position.y = - .5;


    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    root.appendChild(stats.dom);

    animate();
}
init();