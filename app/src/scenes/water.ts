import * as THREE from 'three';
import * as CONFIG from '../config';
import { getShader, ShaderType } from "../shader";
import { scene, render, callbacks } from "../script";
import { defineVairables } from '../shader';

export function init() {
    getShader('water').then(shader => {
        create(shader);
    });
}
function create(shader: ShaderType) {
    const geometry = new THREE.BufferGeometry();
    const side = (CONFIG.WATER.size / CONFIG.WATER.detail) + 1;

    const vertices = new Float32Array(Math.pow(side, 2) * 3);
    const indices = [];

    for (let x = 0; x < side + 1; x++) {
        for (let z = 0; z < side + 1; z++) {
            const i = (x * side + z) * 3;
            vertices[i]     = x * CONFIG.WATER.detail;
            vertices[i + 1] = 0;
            vertices[i + 2] = z * CONFIG.WATER.detail;
        }
    }
    for (let x = 0; x < side - 1; x++) {
        for (let z = 0; z < side - 1; z++) {
            const p1 = x * side + z;
            const p2 = x * side + z + 1;
            const p3 = (x + 1) * side + z;
            const p4 = (x + 1) * side + z + 1;
            indices.push(p1, p2, p3, p2, p4, p3);
        }
    }

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    // Wavelength (L): the crest-to-crest distance between waves in world space. Wavelength L relates to frequency w as w = 2/L.
    // Amplitude (A): the height from the water plane to the wave crest.
    // Speed (S): the distance the crest moves forward per second. It is convenient to express speed as phase-constant phase-constant.jpg , where phase = S x 2/L.
    // Direction (D ): the horizontal vector perpendicular to the wave front along which the crest travels.

    function rand(min:number, max:number):number {
        return ((Math.random() * (max - min)) + min);
    }

    const amplitudes = new Float32Array(CONFIG.WATER.uniforms.amount);
    const frequencies = new Float32Array(CONFIG.WATER.uniforms.amount);
    const phases = new Float32Array(CONFIG.WATER.uniforms.amount);
    const directions = new Array<THREE.Vector2>(CONFIG.WATER.uniforms.amount);

    for(let i = 0; i < CONFIG.WATER.uniforms.amount; i++) {
        amplitudes[i] = rand(
            CONFIG.WATER.uniforms.minAmplitude,
            CONFIG.WATER.uniforms.maxAmplitude
        );
        const wavelength = rand(
            CONFIG.WATER.uniforms.minWavelength,
            CONFIG.WATER.uniforms.maxWavelength
        );
        const speed = rand(
            CONFIG.WATER.uniforms.minSpeed,
            CONFIG.WATER.uniforms.maxSpeed
        );
        frequencies[i] = 2 / wavelength;
        phases[i] = speed * frequencies[i];
        directions[i] = new THREE.Vector2().random().subScalar(0.5).normalize();
    }

    const material = new THREE.ShaderMaterial({
        vertexShader: defineVairables(
            {
                name: "ARRAY_LENGTH",
                value: CONFIG.WATER.uniforms.amount,
                type: "Int"
            }
        )+shader.vert,
        fragmentShader: shader.frag,
        uniforms: {
            uTime: render.uniforms.time,
            uAmplitudes: { value: amplitudes },
            uFrequencies: { value: frequencies },
            uPhases: { value: phases },
            uDirections: {  value: directions },
        },
        wireframe:true
    });
    const mesh = new THREE.Mesh(
        geometry,
        material
    );
    scene.add(mesh);
    scene.add(new THREE.AxesHelper(1));
}