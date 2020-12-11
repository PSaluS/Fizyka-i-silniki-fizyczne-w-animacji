import './style.scss';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';


const root = document.getElementById("root");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, root.offsetWidth * 0.995 / root.offsetHeight * 0.995, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
let palyAnim = false;
let globI = 0;
let animLeng = 600;

const geometry = new THREE.SphereGeometry(0.2, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(geometry, material);

const targetGeometry = new THREE.CircleGeometry(.5, 32);
const targetOFFMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const targetONMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const target = new THREE.Mesh(targetGeometry, targetOFFMaterial);

const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00aa00, wireframe: true });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
const stats = new Stats();

const checkPoints = [];
renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

const parametres = {
  gravity: 9.81,
  placeReflect: .8,

  mass: 1,
  angle: 45,
  velocityBegin: 10,
}

function calculate() {
  const time = 1 / 60;
  const vGrav = - parametres.gravity * time;
  const rad = (parametres.angle * 2 * Math.PI) / 360;
  let vel = new THREE.Vector3(Math.cos(rad), Math.sin(rad), 0);
  vel.multiplyScalar(parametres.velocityBegin);
  checkPoints[0] = new THREE.Vector3(0, 0, 0);
  for (let i = 1; i < animLeng; i++) {
    vel.add(new THREE.Vector3(0, vGrav, 0));
    let posi = new THREE.Vector3(checkPoints[i - 1].x, checkPoints[i - 1].y, 0);
    let vel2 = new THREE.Vector3(vel.x, vel.y, 0);
    posi.add(vel2.multiplyScalar(time));
    if (posi.y < 0) {
      vel.y = vel.y * -parametres.placeReflect;
      posi.y = posi.y * -parametres.placeReflect;
    }
    checkPoints[i] = new THREE.Vector3(posi.x, posi.y, 0);
  }
}

function animate() {

  stats.begin();

  if (palyAnim) {
    sphere.position.set(checkPoints[globI].x, checkPoints[globI].y, 0)

    let originPoint = sphere.position.clone();

    for (let vertexIndex = 0; vertexIndex < sphere.geometry.vertices.length; vertexIndex++) {
      let localVertex = sphere.geometry.vertices[vertexIndex].clone();
      let globalVertex = localVertex.applyMatrix4(sphere.matrix);
      let directionVector = globalVertex.sub(sphere.position);

      let ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      let collisionResult = ray.intersectObject(target);
      if (collisionResult.length > 0 && collisionResult[0].distance < directionVector.length())
        target.material = targetONMaterial;
    }

    if (globI < animLeng - 1) globI++;
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

  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  root.appendChild(stats.dom);

  scene.add(sphere);
  scene.add(floor);
  scene.add(target);
  target.position.set(5, 3, 0);
  target.rotateX(-Math.PI / 2);
  floor.rotateX(-Math.PI / 2);
  floor.position.y = - 0.2;
  animate();
}

init();
document.getElementById('playButt').onclick = function () {
  calculate();
  globI = 0;
  palyAnim = true;
}
document.getElementById('velocity').onchange = function () {
  parametres.velocityBegin = document.getElementById('velocity').value;
}
document.getElementById('angle').onchange = function () {
  parametres.angle = document.getElementById('angle').value;
}
document.getElementById('gravity').onchange = function () {
  parametres.gravity = document.getElementById('gravity').value;
}
document.getElementById('reflect').onchange = function () {
  parametres.placeReflect = document.getElementById('reflect').value;
}
document.getElementById('animtime').onchange = function () {
  animLeng = document.getElementById('animtime').value * 60;
}
