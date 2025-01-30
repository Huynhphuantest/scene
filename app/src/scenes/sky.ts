import * as THREE from 'three';
import { getShader, ShaderType } from "../shader";
import { scene, render, camera, callbacks } from "../script";

export function init() {
    getShader('sky').then(shader => {
        create(shader);
    });
}
function create(shader:ShaderType) {
    const skyGeometry = new THREE.BoxGeometry(
        camera.far - camera.near,
        camera.far - camera.near,
        camera.far - camera.near,
    );
    const skyMaterial = new THREE.ShaderMaterial({
        vertexShader:shader.vert,
        fragmentShader:shader.frag,
        side:THREE.BackSide,
        uniforms: {
            uTime: render.uniforms.time
        }
    });
    const sky = new THREE.Mesh(
        skyGeometry,
        skyMaterial
    );
    callbacks.push(() => {
        sky.position.copy(camera.position);
    })
    scene.add(sky);
}