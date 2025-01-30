import * as THREE from 'three';
import { scene, render, callbacks } from "../script";
import { Spine } from '../objects/Spine';
import { NOISE } from '../math/EMath';

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