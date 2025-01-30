import * as THREE from 'three';
import * as CONFIG from '../config';
import { getShader, ShaderType } from "../shader";
import { scene, render, control, camera } from "../script";
import { createGrassBladeGeometry3D } from '../assets/procedural/model/grass';
import { defineVairables } from '../shader';
import { NOISE } from '../math/EMath';

function groundHeight(x:number, z:number):number {
    const intensity = CONFIG.GROUND.intensity;
    return NOISE.perlin2(x * intensity,z * intensity) * CONFIG.GROUND.height;
}

export function init() {
    getShader('grass').then(shader => {
        createGround();
        create(shader);
    });
}
function create(shader:ShaderType) {
    const uTime = render.uniforms.time;
    const geometries = new Map<number, THREE.BufferGeometry>();
    CONFIG.GRASS.LOD.forEach(e => {
        geometries.set(
            e.detail,
            createGrassBladeGeometry3D(CONFIG.GRASS.width, e.detail)
        );
    });
    const material = new THREE.ShaderMaterial({
        vertexShader:defineVairables({
            name:"WIND_SPEED",
            value:CONFIG.GRASS.uniforms.WIND_SPEED
        }, {
            name:"WIND_SIZE",
            value:CONFIG.GRASS.uniforms.WIND_SIZE
        }, {
            name:"CURVE_AMOUNT_MAX",
            value:CONFIG.GRASS.uniforms.CURVE_AMOUNT_MAX
        }, {
            name:"WIND_DIRECTION_CHANGE_SPEED",
            value:CONFIG.GRASS.uniforms.WIND_DIRECTION_CHANGE_SPEED
        }, {
            name:"WIND_DIRECTION_SIZE",
            value:CONFIG.GRASS.uniforms.WIND_DIRECTION_SIZE
        })+shader.vert,
        fragmentShader:shader.frag,
        uniforms: {
            uTime
        },
    });
    const chunkSide = CONFIG.GRASS.size / CONFIG.GRASS.fieldSide;
    const fieldSide = chunkSide / CONFIG.GRASS.intensity;
    const amount = fieldSide * fieldSide;
    for(let fieldX = 0; fieldX < CONFIG.GRASS.fieldSide; fieldX++) {
        for(let fieldY = 0; fieldY < CONFIG.GRASS.fieldSide; fieldY++) {
            let level = CONFIG.GRASS.LOD[0].detail;
            const mesh = new THREE.InstancedMesh(
                geometries.get(level),
                material,
                amount
            );
            control.addEventListener('change', () => {
                const distance = mesh.position.distanceTo(camera.position);
                let detail = CONFIG.GRASS.LOD.find(e => {
                    return e.distance >= distance;
                })?.detail;
                if(detail === undefined) detail = CONFIG.GRASS.LOD[CONFIG.GRASS.LOD.length - 1].detail;
                if(detail === level) return;
                level = detail;
                mesh.geometry.dispose();
                mesh.geometry = geometries.get(level)!;
            });
            const offsetX = (-CONFIG.GRASS.size / 2) + (fieldX * chunkSide);
            const offsetZ = (-CONFIG.GRASS.size / 2) + (fieldY * chunkSide);
            mesh.position.set(offsetX, 0, offsetZ);
            for(let i = 0; i < amount; i++) {
                const indexX = (i % fieldSide);
                const indexZ = (i / fieldSide);
                const randomX = (Math.random() - 0.5);
                const randomZ = (Math.random() - 0.5);
                const x = (indexX + randomX) * CONFIG.GRASS.intensity;
                const z = (indexZ + randomZ) * CONFIG.GRASS.intensity;
                const matrix = new THREE.Matrix4();
                matrix.makeTranslation(
                    new THREE.Vector3(
                        x,
                        groundHeight(x + offsetX, z + offsetZ),
                        z
                    )
                );
                matrix.scale(new THREE.Vector3(1, CONFIG.GRASS.height + Math.random() * CONFIG.GRASS.height * CONFIG.GRASS.heightRandom, 1))
                mesh.setMatrixAt(i, matrix);
            }
            scene.add(mesh);
        }
    }
}
function createGround() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array((CONFIG.GROUND.size * CONFIG.GROUND.size) * 3);
    for(let i = 0; i < CONFIG.GROUND.size; i++) {
        for(let j = 0; j < CONFIG.GROUND.size; j++) {
            const index = (i * CONFIG.GROUND.size + j) * 3;
            const x = i - CONFIG.GROUND.size / 2;
            const z = j - CONFIG.GROUND.size / 2;
            vertices[index  ] = x;
            vertices[index+1] = groundHeight(x, z);
            vertices[index+2] = z;
        }
    }
    const indices:number[] = [];
    for(let i = 0; i < CONFIG.GROUND.size - 1; i++) {
        for(let j = 0; j < CONFIG.GROUND.size - 1; j++) {
            const p1 = i * CONFIG.GROUND.size + j;
            const p2 = i * CONFIG.GROUND.size + j + 1;
            const p3 = (i+1) * CONFIG.GROUND.size + j;
            const p4 = (i+1) * CONFIG.GROUND.size + j + 1;
            indices.push(p1, p2, p3, p2, p3, p4);
        }
    }
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
            color:0x1E551E,
            side:THREE.DoubleSide
        })
    );
    scene.add(mesh);
}