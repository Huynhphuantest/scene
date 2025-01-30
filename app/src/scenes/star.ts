import * as THREE from 'three';
import * as CONFIG from '../config';
import { getShader, ShaderType } from "../shader";
import { scene, render } from "../script";
import { createStarTexture } from '../assets/procedural/texture/star';

export function init() {
    getShader('star').then(shader => {
        create(shader);
    });
}
function create(shader:ShaderType) {
    const positions = new Float32Array(CONFIG.STAR.amount * 3);
    const sizes = new Float32Array(CONFIG.STAR.amount);
    const colors = new Float32Array(CONFIG.STAR.amount * 3);

    const color = new THREE.Color();

    for(let i = 0; i < CONFIG.STAR.amount; i++) {
        const dir =  new THREE.Vector3().random().sub(new THREE.Vector3(
            0.5,
            0.5,
            0.5
        )).normalize();
        const pos = 
            dir
                .clone()
                .multiplyScalar(CONFIG.STAR.spread - CONFIG.STAR.distance)
                .add(
                    dir.clone().multiplyScalar(CONFIG.STAR.distance)
                );
        positions[i * 3    ] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;

        sizes[i] = Math.pow(1 - Math.random(), CONFIG.STAR.distributionSteepness) * (CONFIG.STAR.maxSize - CONFIG.STAR.minSize) + CONFIG.STAR.minSize;

        color.setHSL(Math.random(), 1.0, 0.85);
        colors[i * 3    ] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    const mesh = new THREE.Points(
        geometry,
        new THREE.ShaderMaterial({
            vertexShader:shader.vert,
            fragmentShader:shader.frag,
            uniforms: {
                uTexture: {
                    value: createStarTexture(
                        CONFIG.STAR.width,
                        CONFIG.STAR.resolution,
                        "white"
                    )
                },
                uTime: render.uniforms.time,
                uSpeed: { value: CONFIG.STAR.speed },
            },
            transparent:true,
            depthWrite:false
        })
    );
    scene.add(mesh);
}