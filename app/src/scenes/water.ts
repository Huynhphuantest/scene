import * as THREE from 'three';
import * as CONFIG from '../config';
import { getShader, ShaderType } from "../shader";
import { scene, render, callbacks } from "../script";
import { defineVairables } from '../shader';

const skyCubeRenderTarget = new THREE.WebGLCubeRenderTarget(512);
skyCubeRenderTarget.texture.type = THREE.HalfFloatType;
skyCubeRenderTarget.texture.mapping = THREE.CubeReflectionMapping;
const skyCubeCamera = new THREE.CubeCamera(1, 1000, skyCubeRenderTarget);
let skyCubeNeedUpdate = true;
setTimeout(() => callbacks.push(() => {
    if(skyCubeNeedUpdate) {
        skyCubeCamera.update(render.renderer, scene);
        skyCubeNeedUpdate = false;
    }
}), 1000);
const skyMap = skyCubeRenderTarget.texture;

export function init() {
    getShader('water').then(shader => {
        create(shader);
    });
}
function create(shader:ShaderType) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array((CONFIG.WATER.size * CONFIG.WATER.size * CONFIG.WATER.detail) * 3);
    const uv = new Float32Array((CONFIG.WATER.size * CONFIG.WATER.size * CONFIG.WATER.detail) * 2);
    for(let i = 0; i < CONFIG.WATER.size * CONFIG.WATER.detail; i++) {
        for(let j = 0; j < CONFIG.WATER.size * CONFIG.WATER.detail; j++) {
            const vIndex = (i * CONFIG.WATER.size + j) * 3;
            const x = i;
            const z = j;
            vertices[vIndex  ] = x;
            vertices[vIndex+1] = 0;
            vertices[vIndex+2] = z;

            const uIndex = (i * CONFIG.WATER.size + j) * 2;
            uv[uIndex  ] = x;
            uv[uIndex+1] = z;
        }
    }
    const indices:number[] = [];
    for(let i = 0; i < CONFIG.WATER.size - 1; i++) {
        for(let j = 0; j < CONFIG.WATER.size - 1; j++) {
            const p1 = i * CONFIG.WATER.size + j;
            const p2 = i * CONFIG.WATER.size + j + 1;
            const p3 = (i+1) * CONFIG.WATER.size + j;
            const p4 = (i+1) * CONFIG.WATER.size + j + 1;
            indices.push(p1, p2, p3, p2, p4, p3);
        }
    }
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    const amplitudes = new Float32Array(CONFIG.WATER.amount);
    const wavelength = new Float32Array(CONFIG.WATER.amount);
    const frequencies = new Float32Array(CONFIG.WATER.amount);
    const phases = new Float32Array(CONFIG.WATER.amount);
    const speeds = new Float32Array(CONFIG.WATER.amount);
    const directions = new Array<THREE.Vector2>(CONFIG.WATER.amount).fill(new THREE.Vector2());
    function random(min:number, max:number):number {
        return ((Math.random() * (max - min)) + min);
    }
    let a = CONFIG.WATER.startAmplitude;
    let l = CONFIG.WATER.startWavelength;
    for(let i = 0; i < CONFIG.WATER.amount; i++) {
        a *= CONFIG.WATER.amplitudeIncrease;
        if(a === 0) a = CONFIG.WATER.startAmplitude;
        l *= CONFIG.WATER.wavelengthIncrease
        if(l === 0) l = CONFIG.WATER.startWavelength;
        const s = random(CONFIG.WATER.minSpeed, CONFIG.WATER.maxSpeed);
        
        const w = 2 / l;
        const f = s * w;
        directions[i] = new THREE.Vector2().random().subScalar(0.5).normalize();

        amplitudes[i] = a;
        wavelength[i] = l;
        frequencies[i] = w;
        phases[i] = f;
        speeds[i] = s;
    }
    const material = new THREE.ShaderMaterial({
        vertexShader:defineVairables({
            name: "ARRAY_MAX",
            value: CONFIG.WATER.amount
        }) + shader.vert,
        fragmentShader:shader.frag,
        uniforms: {
            uTime: render.uniforms.time,
            uAmount: { value: CONFIG.WATER.amount },
            uAmplitudes: { value: amplitudes },
            uFrequencies: { value: frequencies },
            uPhases: { value: phases },
            uDirections: {  value: directions },
            envMap: { value: skyMap }
        },
        side:THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(
        geometry,
        material
    );
    scene.add(mesh);
    scene.remove(mesh);
}