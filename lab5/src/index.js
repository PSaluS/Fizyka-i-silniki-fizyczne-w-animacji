import './style.scss';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2.js';
// import aer1 from "../object/11804_Airplane_v2_l2.obj";

const root = document.getElementById("root");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, root.offsetWidth * 0.995 / root.offsetHeight * 0.995, 0.1, 100000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const stats = new Stats();
let playAnim = false;
// const aeroplane = new OBJLoader2();
let aer;

renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

const parametres = {
    p: 1.225, // gęstość płynu [kg/m^3]
    g: 9.81, // Przyśpieszenie grawitacyjne [m/s^2]
    t: 1/60, // Czas jedenj klatki naimacji [s]

    v: 100, // Prędkość samolotu [m/s]
    vDown: 0,
    mass: 1315, // masa samolotu [kg]
    alpha: 10, // kąt natarcia [stopnie]
    sWing: 11.2, // Powierznia skrzydeł [m^2]
    m: 0.3, // Współczynnik kształtu profilu szkrzydła ?? [??]
    sOb: 3, // Powierznia rzutu natarcia ciała [m^2]
    Cd: 0.7 // współczynnik oporu kształtu ciała [0...1]
}

 function LoadOBJ(soruce) {

    const obj = new OBJLoader2();
    obj.load(soruce, (colback));
    scene.add(obj.baseObject3d);
    obj.baseObject3d.applyMatrix4(scalMatrix(0.01));
    obj.baseObject3d.rotateX(-Math.PI / 2);
    return obj.baseObject3d;
}

export function scalMatrix(scale) {

    const scal = new THREE.Matrix4();
    scal.set(
        scale,  0,  0,  0,
        0,  scale,  0,  0,
        0,  0,  scale,  0,
        0,  0,  0,  1
        );
        return scal;
}

function getRad(angle) {
    return Number((angle * Math.PI)/180);
}

function lift() {
    const Cz = Number(2 * parametres.m * getRad(45 - parametres.alpha));
    const FN = Number(Cz * parametres.p * parametres.sWing * (Math.pow(parametres.v,2)/2));
    const velY = Number(((FN - (parametres.g * parametres.mass)) * parametres.t) / parametres.mass);
    parametres.vDown += velY;
}

function newVel() {
    const FT = parametres.Cd * parametres.sOb * ((parametres.p * Math.pow(parametres.v,2))/2);
    const newV = parametres.v - ((FT * parametres.t) / parametres.mass);
    if(newV > 0.1)    parametres.v = newV;
    else    parametres.v = 0;
}

function animate() {

    stats.begin();

    if (playAnim) {
        newVel();
        lift();
        const changeY = parametres.vDown * parametres.t;
        const changeX = (parametres.v * parametres.t);
        aer.position.set(
            aer.position.x - changeX,
            aer.position.y + changeY,
            0
        )
        camera.position.set(aer.position.x, aer.position.y, 50);
        camera.lookAt(aer.position);
    }

    renderer.render(scene, camera);
    controls.update();
    stats.end();
    requestAnimationFrame(animate);
}

function colback() {
    console.log("3D Model loaded!");
}

function init() {

    

    camera.position.z = 100;
    // camera.position.x = 5;
    renderer.setClearColor(0x8abdff, 1);

    const floorGeometry = new THREE.PlaneGeometry(10000, 10000, 500,500);
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00, wireframe: true });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    scene.add(floor);
    floor.translateZ(-6);
    floor.translateX(-5000);

    aer = LoadOBJ('../object/11804_Airplane_v2_l2.obj');
    // aer = LoadOBJ(aer1);
    // console.log(aer1);
    // aer = aer1;

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    root.appendChild(stats.dom);

    animate();
}
init();
document.getElementById('playButt').onclick = function () {
    playAnim = true;
}

document.getElementById('p').onchange = function () {
parametres.p  = this.value;
}
document.getElementById('g').onchange = function () {
parametres.g  = this.value;
}
document.getElementById('t').onchange = function () {
parametres.t  = this.value / 60;
}
document.getElementById('v').onchange = function () {
parametres.v  = this.value;
}
document.getElementById('mass').onchange = function () {
parametres.mass  = this.value;
}
document.getElementById('alpha').onchange = function () {
parametres.alpha  = this.value;
}
document.getElementById('sWing').onchange = function () {
parametres.sWing  = this.value;
}
document.getElementById('m').onchange = function () {
parametres.m  = this.value;
}
document.getElementById('sOb').onchange = function () {
parametres.sOb  = this.value;
}
document.getElementById('Cd').onchange = function () {
parametres.Cd  = this.value;
}