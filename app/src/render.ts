import * as THREE from 'three';
import { SCREEN } from './config';
import { EffectComposer, RenderPass } from 'postprocessing';

export class Render {
    renderer:THREE.WebGLRenderer;
    scene:THREE.Scene;
    camera:THREE.PerspectiveCamera;
    animate: () => void;
    callback: () => void;
    uniforms:any;
    composer:EffectComposer;
    constructor(scene:THREE.Scene, camera:THREE.PerspectiveCamera, config:THREE.WebGLRendererParameters) {
        this.renderer = new THREE.WebGLRenderer(config);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.scene = scene;
        this.camera = camera;
        this.renderer.setSize(
            SCREEN.bounding.width,
            SCREEN.bounding.height,
        );
        this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
        SCREEN.target.appendChild(this.renderer.domElement);
        SCREEN.target.addEventListener('resize', () => {
            this.renderer.setSize(
                SCREEN.bounding.width,
                SCREEN.bounding.height
            );
            // Already updated
            this.camera.aspect = SCREEN.aspect;
            this.camera.updateProjectionMatrix();
        });
        this.uniforms = {
            time: {
                value:0
            }
        }
        this.callback = () => {};
        const startTime = Date.now();
        this.animate = () => {
            this.uniforms.time.value = (Date.now() - startTime) / 1000;
            this.callback();
            this.composer.render();
            requestAnimationFrame(this.animate);
        }
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
    }
}