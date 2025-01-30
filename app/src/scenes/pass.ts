import * as THREE from 'three';
import { BloomEffect, EdgeDetectionMode, EffectPass, FXAAEffect, SMAAEffect } from 'postprocessing';
import { SharpnessEffect } from '../assets/declared/shaders/postprocessing/hpatEffects';
import { render, camera } from "../script";

export function init() {
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
}