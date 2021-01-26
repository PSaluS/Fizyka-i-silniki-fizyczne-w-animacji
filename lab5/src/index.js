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
let playAnim = false;

renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

const parametres = {
    p: 1.225, // gęstość płynu [kg/m^3]
    g: 9.81, // Przyśpieszenie grawitacyjne [m/s^2]


    v: 300, // Prędkość samolotu [m/s]
    mass: 100, // masa samolotu [kg]
    alpha: 10, // kąt natarcia [stopnie]
    sWing: 15, // Powierznia skrzydeł [m^2]
    m: 3, // Współczynnik kształtu profilu szkrzydła ?? [??]
    sOb: 10, // Powierznia rzutu natarcia ciała [m^2]
    s: 0, // Przesunięcie środka ciężkości ciała względem skrzydeł [m]
    Cd: 1 // współczynnik oporu ształtu ciała [0...1]


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

    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00, wireframe: false });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    scene.add(floor);
    floor.rotateX(-Math.PI / 2);

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    root.appendChild(stats.dom);

    animate();
}
init();