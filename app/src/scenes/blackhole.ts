import * as THREE from 'three';
import { getShader, ShaderType } from "../shader";
import { camera } from "../script";

export function init() {
    getShader('blackhole').then(shader => {
        create(shader);
    });
}
function create(shader:ShaderType) {
    const blackholeGeometry = new THREE.SphereGeometry(100);
    const blackholeDirection = new THREE.Vector3(0,1,-1).normalize();
    const blackholdDistance = 500;
    const blackholePosition = blackholeDirection.multiplyScalar(blackholdDistance);

    const blackholeMaterial = new THREE.ShaderMaterial({
        vertexShader:shader.vert,
        fragmentShader:shader.frag
    });

    const blackhole = new THREE.Mesh(blackholeGeometry, blackholeMaterial);
    blackhole.position.copy(blackholePosition);
    blackhole.lookAt(camera.position);
    //scene.add(blackhole);
}