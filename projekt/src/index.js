import './style.scss';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';


const root = document.getElementById("root");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, root.offsetWidth * 0.995 / root.offsetHeight * 0.995, 1, 1000000000000000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const stats = new Stats();
let palyAnim = false;


renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

const parametres = {
  G: 6.6743015 * Math.pow(10, -11),
  time: 86400
}

const terra = {
  name: 'Ziemia',
  mass: 5972190000000000000000000, // [kg]
  r: 6371008, // [m]
  calss: 'planet',
  level: 1,
  dist: 149598261000,  // [m]
  position: new THREE.Vector3(149598261000, 0, 0),
  velocity: 29780, // [m/s]
  velVec: new THREE.Vector3(0, 0, 29780),

  geometry: new THREE.SphereGeometry(6371008 * 109, 32, 32),
  materail: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  //mesh: new THREE.Mesh(geometry, material)
}

const sol = {
  name: 'Słońce',
  mass: terra.mass * 333000,
  r: terra.r * 109,
  position: new THREE.Vector3(0, 0, 0),
  class: 'star',
  level: 0,

  geometry: new THREE.SphereGeometry(terra.r * 109, 32, 32),
  materail: new THREE.MeshBasicMaterial({ color: 0xff5555 }),
  //mesh: new THREE.Mesh(geometry, material)
}


const objTerra = new THREE.Mesh(terra.geometry, terra.materail);
const objSol = new THREE.Mesh(sol.geometry, sol.materail);

function newPos() {
  let f = ((((terra.mass * sol.mass) / (terra.dist * terra.dist)) * parametres.G) * parametres.time) / terra.mass;
  console.log('V doś: ' + f);
  console.log('V nor: ' + terra.velocity);
  let fVec = new THREE.Vector3(0, 0, 0);
  fVec = terra.position.clone();
  fVec.normalize();
  fVec.multiplyScalar(-1);
  //console.log(fVec);
  fVec.multiplyScalar(f);
  terra.velVec = terra.velVec.add(fVec);
  terra.velocity = terra.velVec.length();
  let vt = new THREE.Vector3();
  vt = terra.velVec.clone();
  vt = vt.multiplyScalar(parametres.time);
  let vs = new THREE.Vector3();
  vs = terra.position.clone();
  vs = vs.add(vt);
  terra.position = vs.clone();
  terra.dist = terra.position.length();
  //console.log(terra.dist);
  //console.log(terra.velocity);
  //console.log(terra.velVec);
}


function animate() {

  stats.begin();

  if (palyAnim) {
    newPos();
    objTerra.position.set(terra.position.x, terra.position.y, terra.position.z);
    //console.log(objTerra.position);
  }
  renderer.render(scene, camera);
  controls.update();

  stats.end();

  requestAnimationFrame(animate);
}
function init() {
  camera.position.y = 100000000000;
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0x000000, 1);
  objTerra.rotateX(-Math.PI / 2);
  scene.add(objTerra);
  scene.add(objSol);
  objTerra.position.set(terra.position.x, terra.position.y, terra.position.z);

  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  root.appendChild(stats.dom);

  animate();
}

init();
document.getElementById('playButt').onclick = function () {
  palyAnim = true;
  //console.log(objSol);
}
