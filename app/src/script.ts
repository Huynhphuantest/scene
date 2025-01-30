import * as THREE from 'three';
import * as CONFIG from './config';
import { Render } from "./render";
import { defineVairables, getShader } from './shader';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { createGrassBladeGeometry3D } from './assets/procedural/model/grass';
import { NOISE } from './math/EMath';
import { createStarTexture } from './assets/procedural/texture/star';
import { BloomEffect, EdgeDetectionMode, EffectPass, FXAAEffect, SMAAEffect } from 'postprocessing';

import { SharpnessEffect } from './assets/declared/shaders/postprocessing/hpatEffects';
import { Spine } from './objects/Spine';

const callbacks:(() => void)[] = [];

const scene = new THREE.Scene();

const directionalLight = new THREE.DirectionalLight();
directionalLight.position.set(0,1,-1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

scene.add(directionalLight);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
    CONFIG.CAMERA.fov,
    CONFIG.SCREEN.aspect,
    CONFIG.CAMERA.near,
    CONFIG.CAMERA.far
);
const render = new Render(
    scene,
    camera,
    CONFIG.RENDERER
);

const axis = new THREE.AxesHelper(2);
axis.position.y = 1;
scene.add(axis);

render.composer.addPass(new EffectPass(camera,
    (() => {
        const effect = new SMAAEffect({
            edgeDetectionMode: EdgeDetectionMode.DEPTH
        });
        const size = new THREE.Vector2();
        render.renderer.getSize(size);
        const ratio = render.renderer.getPixelRatio();
        effect.setSize(
            size.x * ratio,
            size.y * ratio,
        );
        
        return effect;
    })(),
    (() => {
        const effect = new FXAAEffect({});
        effect.minEdgeThreshold = 0.05;
        effect.maxEdgeThreshold = 0.25
        return effect;
    })(),
    new SharpnessEffect({
        sharpness: 1.0
    }),
    new BloomEffect({
        luminanceThreshold:0.7,
        radius:0.5,
        intensity: 1
    }),
));
    
const control = new OrbitControls(camera, document.body);
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

function groundHeight(x:number, z:number):number {
    const intensity = CONFIG.GROUND.intensity;
    return NOISE.perlin2(x * intensity,z * intensity) * CONFIG.GROUND.height;
}

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

//FISH
{
    const time = render.uniforms.time;
    const speed = 0.5;
    const wander = 0.6;
    const spread = 0;
    const srand = 0.1;
    const rand = 19343684;
    const amount = 0;
    for(let i = 0; i < amount; i++) {
        const fish = new Spine({
            angleConstraint:Math.PI/2
        }, [2, 1.8, 1.5, 1.2, 1, 0.6]);
        fish.position.x = (Math.random() * 2 - 1) * spread;
        fish.position.z = (Math.random() * 2 - 1) * spread;
        const x1 = Math.random() * rand;
        const x2 = Math.random() * rand;
        const z1 = Math.random() * rand;
        const z2 = Math.random() * rand;
        const sx1 = 1 - Math.random() * srand;
        const sx2 = 1 - Math.random() * srand;
        const sz1 = 1 - Math.random() * srand;
        const sz2 = 1 - Math.random() * srand;
        callbacks.push(() => {
            fish.move(
                new THREE.Vector3(
                    NOISE.perlin2(
                        x1 + time.value * wander * sx1,
                        x2 + time.value * wander * sx2
                    ) * speed,
                    0,
                    NOISE.perlin2(
                        z1 + time.value * wander * sz1,
                        z2 + time.value * wander * sz2
                    ) * speed
                )
            );
        });
        fish.show(scene);
    }
}

//Sky
getShader('sky').then(shader => {
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
});

//Stars
getShader('star').then(shader => {
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

        color.setHSL(Math.random(), 1.0, 0.85)
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
});

//Ground
{
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


//Grasses
getShader('grass').then(shader => {
    const uTime = render.uniforms.time;
    const geometry = createGrassBladeGeometry3D(CONFIG.GRASS.width, CONFIG.GRASS.detail);
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
    const mesh = new THREE.InstancedMesh(
        geometry,
        material,
        CONFIG.GRASS.amount
    );
    const bladePerRow = Math.floor(Math.sqrt(CONFIG.GRASS.amount));
    for(let i = 0; i < CONFIG.GRASS.amount; i++) {
        const size = 0.1;
        const randomScale = 2;
        const x = (i % bladePerRow * size + (Math.random() * size * randomScale)) - (bladePerRow*size)/2;
        const z = (Math.floor(i / bladePerRow) * size + (Math.random() * size * randomScale)) - (bladePerRow*size)/2;
        const matrix = new THREE.Matrix4();
        matrix.makeTranslation(new THREE.Vector3(x, groundHeight(x, z) ,z));
        matrix.scale(new THREE.Vector3(1, CONFIG.GRASS.height + Math.random() * CONFIG.GRASS.height * CONFIG.GRASS.heightRandom, 1))
        mesh.setMatrixAt(i, matrix);
    }
    scene.add(mesh);
});


//Blackhole?
getShader('blackhole').then(shader => {
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
});

//Water
getShader('water').then(shader => {
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
}); 