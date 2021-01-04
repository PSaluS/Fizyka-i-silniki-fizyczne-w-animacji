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
let z12 = true;
let z23 = true;

renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

const cube1Geometry = new THREE.BoxGeometry(2,5,2);

const cube1Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube2Material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube3Material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const cube1 = new THREE.Mesh(cube1Geometry, cube1Material);
const cube2 = new THREE.Mesh(cube1Geometry, cube2Material);
const cube3 = new THREE.Mesh(cube1Geometry, cube3Material);

const parametres = {
    mass1: 10,
    mass2: 5,
    mass3: 5,

    f: .5,
    g: 9.81,
    t: 1/60,
    colizion: 1,

    force1: 100,

    v1: 0,
    v2: 0,
    v3: 0
}

const newV = (v) => {
    const vt = parametres.g * parametres.f * parametres.t;
    if(vt >= v) return 0;
    else return v - vt;
}

function begin() {

    parametres.v1 = (parametres.force1 / parametres.mass1);
    parametres.vv1 = 1;

    playAnim = true;
}

function animate() {

    stats.begin();

    if (playAnim) {

        if(parametres.v1 > 0) {
            cube1.translateX(parametres.v1*parametres.t);
            parametres.v1 = newV(parametres.v1);

        }
        if(parametres.v2 > 0) {
            cube2.translateX(parametres.v2*parametres.t);
            parametres.v2 = newV(parametres.v2);
        }
        if(parametres.v3 > 0) {
            cube3.translateX(parametres.v3*parametres.t);
            parametres.v3 = newV(parametres.v3);
        }
        if(cube2.position.x - cube1.position.x <= 2  && z12 == true ) {

            if(parametres.colizion == 0) {
                //Zderzenie niesprężyste ciała 1 i 2
                cube2.position.x = cube1.position.x + 2;
                const nv = (parametres.v1 * parametres.mass1) / (parametres.mass1 + parametres.mass2);
                parametres.v1 = nv;
                parametres.v2 = nv;
                z12 = false;

            }
            if(parametres.colizion == 1) {
                //Zderzenie sprężyste ciała 1 i 2
                parametres.v2 = (parametres.v1 * parametres.mass1) / parametres.mass2;
                parametres.v1 = 0;
            }
        }
        if(cube3.position.x - cube2.position.x <= 2 && z23 == true) {

            if(parametres.colizion == 0 ) {
                //Zderzenie niesprężyste ciała 2 i 3
                cube3.position.x = cube2.position.x + 2;
                const nv = (parametres.v1 * (parametres.mass1 + parametres.mass2)) / (parametres.mass1 + parametres.mass2 + parametres.mass3);
                parametres.v1 = nv;
                parametres.v2 = nv;
                parametres.v3 = nv;
                z23 = false;
            }
            if(parametres.colizion == 1) {
                //Zderzenie sprężyste ciała 2 i 3
                parametres.v3 = (parametres.v2 * parametres.mass2) / parametres.mass3;
                parametres.v2 = 0;
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
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00, wireframe: false });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);

    scene.add(floor);
    floor.rotateX(-Math.PI / 2);
    floor.position.y = - .5;

    scene.add(cube1);
    scene.add(cube2);
    scene.add(cube3);

    cube1.position.y = 2;
    cube2.position.y = 2;
    cube3.position.y = 2;

    cube1.position.x = -5;
    cube3.position.x = 5;

    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    root.appendChild(stats.dom);

    animate();
}
init();

document.getElementById('gravity').onchange = function () {
    parametres.g = this.value;
}
document.getElementById('rubb').onchange = function () {
    parametres.f = this.value;
}
document.getElementById('force').onchange = function () {
    parametres.force1 = this.value;
}
document.getElementById('mass1').onchange = function () {
    parametres.mass1 = this.value;
}
document.getElementById('mass2').onchange = function () {
    parametres.mass2 = this.value;
}
document.getElementById('mass3').onchange = function () {
    parametres.mass3 = this.value;
}
document.getElementById('collizion_type').onchange = function () {
    parametres.colizion = this.value;
}
document.getElementById('playButt').onclick = function () {
    begin();
}