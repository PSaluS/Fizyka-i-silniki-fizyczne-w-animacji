import './style.scss';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';

const root = document.getElementById("root");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, root.offsetWidth * 0.995 / root.offsetHeight * 0.995, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

const cubGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubGeometry, cubMaterial);
const stats = new Stats();


renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

let playAnim = false;
let F_all;
let F_to_ramp;
let F_to_forw;
let F_rubb;
let F_rub_all;
let rad;
let moveVec;
let velChange;
const parametres = {
    angle: 45,
    height: 10,
    time: 1 / 60,

    f: 0.5,
    mass: 10,
    gravity: 9.81
}

function beginPlay() {

    rad = (parametres.angle * 2 * Math.PI) / 360;

    const rampGeometry = new THREE.PlaneGeometry(parametres.height / Math.sin(rad) + 1, 10);
    const rampMaterial = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: false });
    const ramp = new THREE.Mesh(rampGeometry, rampMaterial);
    scene.add(ramp);

    ramp.translateY(parametres.height / 2);
    ramp.translateX(parametres.height / 2 / Math.tan(rad));
    ramp.rotateX(-Math.PI / 2);
    ramp.rotateY(rad);

    cube.position.y = parametres.height;
    cube.position.x = 0;
    cube.position.z = 0;

    F_all = parametres.mass * parametres.gravity;
    F_to_ramp = Math.cos(rad) * F_all;
    F_to_forw = Math.sin(rad) * F_all;
    F_rubb = F_to_ramp * parametres.f;
    F_rub_all = F_all * parametres.f;
    if (F_to_forw > F_rubb) {
        console.log("ruszam sie");

        moveVec = new THREE.Vector3(Math.cos(rad), Math.sin(rad), 0);
        playAnim = true;
    }
    else console.log("za duże tarcie");

}

function animate() {

    stats.begin();

    if (playAnim) {
        if (cube.position.y > 0) {
            let vel = F_to_forw - F_rubb;
            vel = vel / parametres.mass;
            velChange = vel * Math.cos(rad);
            vel = vel * parametres.time;
            let velVec = moveVec.clone().multiplyScalar(vel);
            cube.translateX(velVec.x);
            cube.translateY(-velVec.y);


        }
        else {
            cube.position.y = 0;
            let v_rub = F_rub_all / parametres.mass * parametres.time;
            velChange -= v_rub;
            if (velChange > 0) {
                cube.translateX(velChange * parametres.time);
            }

        }

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
document.getElementById('height').onchange = function () {
    parametres.height = Number(document.getElementById('height').value);
    cube.position.y = document.getElementById('height').value;
}
document.getElementById('angle').onchange = function () {
    parametres.angle = document.getElementById('angle').value;
}
document.getElementById('gravity').onchange = function () {
    parametres.gravity = document.getElementById('gravity').value;
}
document.getElementById('mass').onchange = function () {
    parametres.mass = document.getElementById('mass').value;
}
document.getElementById('frubb').onchange = function () {
    parametres.f = document.getElementById('frubb').value;
}
document.getElementById('playButt').onclick = function () {
    beginPlay();
}