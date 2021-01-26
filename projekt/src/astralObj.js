import * as THREE from 'three';
import parametres from './parametres.js';

export default class astarlObject {

    constructor(
        name,
        mass,
        r,
        material,
        dist = 0,
        velocity = 0,
        clas = 'star',
        level = 0,
        ring = false,
    ) {
        this.name = name;
        this.mass = mass;
        this.velocity = velocity;
        this.material = material;
        this.r = r;
        this.clas = clas;
        this.level = level;
        this.dist = dist;
        this.position;
        this.ring = ring;
        this.mesh;
        this.ringMesh;
        this.geometry;
        this.velVec = new THREE.Vector3(0,0,0);

        if(dist == 0) {
            this.position = new THREE.Vector3(0,0,0);
        }
        else {
            this.position = new THREE.Vector3(getRandomInt(-100,101),getRandomInt(-5,6),getRandomInt(-100,101)).normalize();
            this.velVec = new THREE.Vector3(- this.position.z,- this.position.y , this.position.x).normalize();
            this.position.multiplyScalar(this.dist);
            this.velVec.multiplyScalar(this.velocity);
        }
        this.geometry = new THREE.SphereGeometry(this.r , 32, 32);
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotateX(-Math.PI / 2);
        this.mesh.position.set(this.position);
        if (this.ring === true) {
            this.ringGeometry = new THREE.RingGeometry( this.r * 1.2, this.r * 2, 64 );
            this.ringMesh = new THREE.Mesh(this.ringGeometry, this.material);
            this.ringMesh.rotateX(-Math.PI / 2);
            this.ringMesh.position.set(this.position);
        }

    }

    setVelocity(vel) {
        this.velocity = vel;
        this.velVec.normalize();
        this.velVec.multiplyScalar(this.velocity);
    }

    getGeometry() {
        if(this.ring === true) {
            return [this.geometry, this.ringGeometry];
        } else {
            return this.geometry;
        }
    }

    getMesh() {
        if(this.ring === true) {
            return [this.mesh, this.ringMesh];
        } else {
            return this.mesh;
        }
    }

    setSize(scale) {
        const geometry = new THREE.SphereGeometry(this.r * scale, 32, 32);
        this.mesh.geometry = geometry;
        this.mesh.position.set(this.position);
        if (this.ring === true) {
            const ringGeometry = new THREE.RingGeometry( this.r * 1.2 * scale, this.r * 2 * scale, 64 );
            this.ringMesh = new THREE.Mesh(ringGeometry, this.material);
            this.ringMesh.position.set(this.position);
        }
    }

    newPosition(aObjs) {
            let f = ((((this.mass * aObjs[0].mass) / (this.dist * this.dist)) * parametres.G) * parametres.time) / this.mass;
            let fVec = new THREE.Vector3(0, 0, 0);
            fVec = this.position.clone();
            fVec.normalize();
            fVec.multiplyScalar(-1);
            fVec.multiplyScalar(f);
            this.velVec.add(fVec);
            this.velocity = this.velVec.length();
            let vt = new THREE.Vector3();
            vt = this.velVec.clone();
            vt = vt.multiplyScalar(parametres.time);
            let vs = new THREE.Vector3();
            vs = this.position.clone();
            vs = vs.add(vt);
            this.position = vs.clone();
            this.dist = this.position.length();

            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            if(this.ring === true) this.ringMesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    newPosition2(aObjs) {

        if(this.level !== 0) {
        for(let i = 0; i < aObjs.length; i++) {
            if(aObjs[i] !== this) {
            let posDelt = aObjs[i].position.clone();
            posDelt.sub(this.position);
            let f = ((((this.mass * aObjs[0].mass) / (Math.pow(posDelt.length(),2))) * parametres.G) * parametres.time) / this.mass;
            let fVec = new THREE.Vector3(0, 0, 0);
            fVec = posDelt.clone();
            fVec.normalize();
            fVec.multiplyScalar(f);
            this.velVec.add(fVec);
            this.velocity = this.velVec.length();


        }
    }
    if(this.level !== 0) {
        let vt = new THREE.Vector3();
        vt = this.velVec.clone();
        vt = vt.multiplyScalar(parametres.time);
        let vs = new THREE.Vector3();
        vs = this.position.clone();
        vs = vs.add(vt);
        this.position = vs.clone();
        this.dist = this.position.length();
    }
    }
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        if(this.ring === true) this.ringMesh.position.set(this.position.x, this.position.y, this.position.z);

}

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }