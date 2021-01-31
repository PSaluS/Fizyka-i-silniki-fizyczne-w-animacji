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
let palyAnim = false;

renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

const carGeometry = new THREE.CircleGeometry(10, 64);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00, wireframe: true });
const car = new THREE.Mesh(carGeometry, carMaterial);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const box1Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const box2Material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const box1 = new THREE.Mesh(boxGeometry, box1Material);
const box2 = new THREE.Mesh(boxGeometry, box2Material);


const parametres = {
    gravity: 9.81,
    time: 1 / 60,
    aV: Math.PI * 2 / 2,
    rad: Math.PI * 2 / 120,

    f_static: 0.8,
    f_kin: 0.5,

    mass1: 10,
    mass2: 5,

    R1: 5,
    R2: 2
}

function animate() {

    stats.begin();

    if (palyAnim) {
        let F1_od = parametres.mass1 * (parametres.aV * parametres.aV) * parametres.R1;
        let F1_do = parametres.f_static * parametres.mass1 * parametres.gravity;
        let T1 = parametres.f_kin * parametres.mass1 * parametres.gravity;
        let F1_wy = F1_od - T1;
        let V1_wy = F1_wy * parametres.time / parametres.mass1;

        let F2_od = parametres.mass2 * (parametres.aV * parametres.aV) * parametres.R2;
        let F2_do = parametres.f_static * parametres.mass2 * parametres.gravity;
        let T2 = parametres.f_kin * parametres.mass2 * parametres.gravity;
        let F2_wy = F2_od - T2;
        let V2_wy = F2_wy * parametres.time / parametres.mass2;

        car.rotateZ(parametres.rad);
        box1.rotateZ(parametres.rad);
        box2.rotateZ(parametres.rad);

        if (F1_do >= F1_od) {
            box1.translateY((parametres.aV * parametres.R1) * parametres.time);

        } else {
            box1.translateY(((parametres.aV * parametres.R1) + V1_wy) * parametres.time);
            let newL = new THREE.Vector3(box1.position.x, 0, box1.position.z);
            parametres.R1 = newL.length();
        }

        if (F2_do >= F2_od) {
            box2.translateY((parametres.aV * parametres.R2) * parametres.time);

        } else {
            box2.translateY(((parametres.aV * parametres.R2) + V2_wy) * parametres.time);
            let newL2 = new THREE.Vector3(box2.position.x, 0, box2.position.z);
            parametres.R2 = newL2.length();
        }

        // box1.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), parametres.aV);
        // box1.translateX(parametres.rad);

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

    car.rotateX(-Math.PI / 2);
    box1.rotateX(-Math.PI / 2);
    box2.rotateX(-Math.PI / 2);

    box1.position.y = .5;
    box1.position.x = parametres.R1;
    box2.position.y = .5;
    box2.position.x = parametres.R2;
    // box1.translateX(parametres.R1);
    scene.add(car);
    scene.add(box1);
    scene.add(box2);


    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    root.appendChild(stats.dom);


    animate();
}

init();
document.getElementById('playButt').onclick = function () {
    palyAnim = true;
}
document.getElementById('gravity').onchange = function () {
    parametres.gravity = Number(this.value);
}
document.getElementById('angleVel').onchange = function () {
    parametres.aV = (Number(this.value) * 2 * Math.PI) / 360;
    parametres.rad = parametres.aV / 60;
}
document.getElementById('tStatic').onchange = function () {
    parametres.f_static = Number(this.value);
}
document.getElementById('tKin').onchange = function () {
    parametres.f_kin = Number(this.value);
}
document.getElementById('mass1').onchange = function () {
    parametres.mass1 = Number(this.value);
}
document.getElementById('r1').onchange = function () {
    parametres.R1 = Number(this.value);
    box1.position.x = parametres.R1;
}
document.getElementById('mass2').onchange = function () {
    parametres.mass2 = Number(this.value);
}
document.getElementById('r2').onchange = function () {
    parametres.R2 = Number(this.value);
    box2.position.x = -parametres.R2;
}