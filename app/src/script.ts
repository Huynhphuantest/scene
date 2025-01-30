import * as THREE from 'three';
import * as CONFIG from './config';
import { Render } from "./render";
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export const callbacks:(() => void)[] = [];

export const scene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(0,1,-1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

scene.add(directionalLight);
scene.add(ambientLight);

export const camera = new THREE.PerspectiveCamera(
    CONFIG.CAMERA.fov,
    CONFIG.SCREEN.aspect,
    CONFIG.CAMERA.near,
    CONFIG.CAMERA.far
);
export const render = new Render(
    scene,
    camera,
    CONFIG.RENDERER
);
    
export const control = new OrbitControls(camera, document.body);
camera.position.z = 5;
control.panSpeed = 0.9;
control.rotateSpeed = 0.9;
control.enableDamping = true;
control.update();

render.callback = () => {
    control.update();
    callbacks.forEach(e => e());
}
render.animate();


scene.add(new THREE.AxesHelper(5));


import { init as initPass } from './scenes/pass';
initPass();

import { init as initSky } from './scenes/sky';
initSky();

import { init as initStar } from './scenes/star';
initStar();

import { init as initGrass } from './scenes/grass';
initGrass();
