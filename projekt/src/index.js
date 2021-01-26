import './style.scss';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import Stats from 'stats.js';
import astralObject from './astralObj.js';
import parametres from './parametres';


const root = document.getElementById("root");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, root.offsetWidth * 0.995 / root.offsetHeight * 0.995, 1, 1000000000000000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const stats = new Stats();
let palyAnim = false;
let model = 1;
let activ;
const scales = [50,2000,2000,2000,2000,1000,1000,1200,1200];

const astarlObjects = [];


renderer.setSize(root.offsetWidth * 0.995, root.offsetHeight * 0.995);
root.appendChild(renderer.domElement);

function animate() {

  stats.begin();

  if (palyAnim) {
    astarlObjects.forEach(function(element){
      if(model == 1)
      element.newPosition(astarlObjects);
      if(model == 2)
      element.newPosition2(astarlObjects);
    })
  }
  renderer.render(scene, camera);
  controls.update();

  stats.end();

  requestAnimationFrame(animate);
}
function init() {
  camera.position.y = 1000000000000;
  camera.lookAt(0, 0, 0);
  renderer.setClearColor(0x000000, 1);

  console.log(astarlObjects);

  astarlObjects[0] =
    new astralObject(
        'Słońce',
        1.98855 * Math.pow(10,30),
        696342000,
        new THREE.MeshBasicMaterial({ color: 0xff5555 })
        );
    astarlObjects.push(
      new astralObject(
        'Merkury',
        3.3011 * Math.pow(10,23),
        2439700,
        new THREE.MeshBasicMaterial({ color:0xa74300}),
        57909050000,
        47360,
        'planet',
        1,
        false
      )
    );
    astarlObjects.push(
      new astralObject(
        'Wenus',
        4.867 * Math.pow(10,24),
        6051800,
        new THREE.MeshBasicMaterial({ color:0xf8b045}),
        1.0821 * Math.pow(10,11),
        35020,
        'planet',
        1,
        false
      )
    );
    astarlObjects.push(new astralObject(
      'Ziemia',
      5972190000000000000000000,
      6371008,
      new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      149598261000,
      29780,
      'planet',
      1,
      false
      )
    );
    astarlObjects.push(
      new astralObject(
        'Mars',
        6.4171 * Math.pow(10,23),
        3389500,
        new THREE.MeshBasicMaterial({ color:0xa30000}),
        2.2792 * Math.pow(10,11),
        24070,
        'planet',
        1,
        false
      )
    );
    astarlObjects.push(
      new astralObject(
        'Jowisz',
        1.89819 * Math.pow(10,27),
        71492000,
        new THREE.MeshBasicMaterial({ color:0xc0c24f}),
        7.7857 * Math.pow(10,11),
        13060,
        'planet',
        1,
        false
      )
    );
    astarlObjects.push(
      new astralObject(
        'Saturn',
        5.6834 * Math.pow(10,26),
        58232000,
        new THREE.MeshBasicMaterial({ color:0xfafc98}),
        1.43353 * Math.pow(10,12),
        9680,
        'planet',
        1,
        true
      )
    );
    astarlObjects.push(
      new astralObject(
        'Uran',
        8.6813 * Math.pow(10,25),
        25362000,
        new THREE.MeshBasicMaterial({ color:0x74eaff}),
        2.87246 * Math.pow(10,12),
        6800,
        'planet',
        1,
        false
      )
    );
    astarlObjects.push(
      new astralObject(
        'Neptun',
        1.02413 * Math.pow(10,26),
        24622000,
        new THREE.MeshBasicMaterial({ color:0x0066ff}),
        4.49506 * Math.pow(10,12),
        5430,
        'planet',
        1,
        false
      )
    );

    astarlObjects.forEach(function (element, i){
      element.setSize(scales[i]);
      if(Array.isArray(element.getMesh()))
      {
      const rings = element.getMesh();
      scene.add(rings[0]);
      scene.add(rings[1]);
      }
      else {
        scene.add(element.getMesh());
      }
    })


  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  root.appendChild(stats.dom);

  animate();
}

init();
document.getElementById('playButt').onclick = function () {
  document.getElementById('G').value = parametres.G;
  document.getElementById('time').value = Math.round(parametres.time/1440);
  if(!palyAnim) {
    palyAnim = true;
    this.innerHTML = "Stop";
  }
  else {
    palyAnim = false;
    this.innerHTML = 'Play';
  }
}
document.getElementById("G").onchange = function (){
parametres.G = this.value;
}
document.getElementById("G").onload = function (){
  this.calue = parametres.G;
  }
document.getElementById("time").onchange = function (){
  parametres.time = this.value*1440;
}
document.getElementById("time").onload = function (){
  this.value = Math.round(parametres.time/1440);
}
document.getElementById("model").onchange = function (){
  model = this.value;
}
document.getElementById("planets").onchange = function (){
  activ = Number(this.value);
  document.getElementById("mass").value = astarlObjects[activ].mass;
  document.getElementById("vel").value = astarlObjects[activ].velocity;
  document.getElementById("scale").value = scales[activ];
}
document.getElementById("mass").onchange = function (){
  if(activ!==undefined)
  {
    astarlObjects[activ].mass = this.value;
  }
}
document.getElementById("vel").onchange = function (){
  if(activ!==undefined)
  {
    astarlObjects[activ].setVelocity(this.value);
  }
}
document.getElementById("scale").onchange = function (){
  if(activ!==undefined)
  {
    scales[activ] = this.value;
    astarlObjects[activ].setSize(this.value);
  }
}
