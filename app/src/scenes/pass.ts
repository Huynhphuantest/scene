import * as THREE from 'three';
import { BloomEffect, EdgeDetectionMode, Effect, EffectPass, FXAAEffect, Pass, SMAAEffect } from 'postprocessing';
import { SharpnessEffect } from '../assets/declared/shaders/postprocessing/SharpnessEffect';
import { render, camera, scene } from "../script";
import { SSAAPass } from '../assets/declared/shaders/postprocessing/SSAAPass';

function addEffect(...effects:Effect[]) {
    render.composer.addPass(new EffectPass(camera, ...effects))
}
function addPass(pass:Pass) {
    render.composer.addPass(pass);
}

export function init() {
    //SMAA
    addEffect((() => {
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
    })());
    //FXAA
    addEffect((() => {
        const effect = new FXAAEffect({});
        const size = new THREE.Vector2();
        render.renderer.getSize(size);
        const ratio = render.renderer.getPixelRatio();
        effect.setSize(
            size.x * ratio,
            size.y * ratio,
        );
        effect.minEdgeThreshold = 0.05;
        effect.maxEdgeThreshold = 0.25
        return effect;
    })());
    //TAA
    //Sharpness
    addEffect(new SharpnessEffect({
        sharpness: 1.0
    }));
    //Bloom
    addEffect(new BloomEffect({
        luminanceThreshold:0.7,
        radius:0.5,
        intensity: 1
    }));
}