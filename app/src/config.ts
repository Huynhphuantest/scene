import * as THREE from 'three';

export type ScreenConfig = {
    target: HTMLElement,
    bounding: DOMRect,
    aspect: number
}

export type PerspectiveCameraParameters = {
    fov: number,
    far: number,
    near: number;
}

const SCREEN_TARGET = document.body;
const SCREEN_BOUNDING = SCREEN_TARGET.getBoundingClientRect();
export const SCREEN:ScreenConfig = {
    target: SCREEN_TARGET,
    bounding: SCREEN_BOUNDING,
    aspect: SCREEN_BOUNDING.width / SCREEN_BOUNDING.height,
}
SCREEN_TARGET.addEventListener('resize', () => {
    SCREEN.bounding = SCREEN_TARGET.getBoundingClientRect();
    SCREEN.aspect = SCREEN.bounding.width / SCREEN.bounding.height;
});

export const CAMERA:PerspectiveCameraParameters = {
    fov: 75,
    far: 1000,
    near: 0.1
}
export const RENDERER:THREE.WebGLRendererParameters = {
    powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false
}
const fieldSize = 50;
export const GROUND = {
    size: fieldSize,
    detail: 20,
    height: 3,
    intensity: 1/10 // inverse
}
export const GRASS = {
    height: 1.25,
    heightRandom: 0.5,
    size: fieldSize,
    intensity: 1/10, //this mean like 5 grass per unit?,
    fieldSide: 5, //so uhh this create a field that have length and wide of field, it isnt a good name but im lazy
    LOD: [
        {
            detail: 7,
            distance: 15
        },
        {
            detail: 5,
            distance: 20
        }, {
            detail: 3,
            distance: 25
        }, {
            detail: 2,
            distance: 30
        }, {
            detail: 1,
            distance: Infinity
        }
    ],
    width: 0.09,
    uniforms: {
        WIND_SIZE: 1 / 20, // inverse
        WIND_SPEED: 0.2,
        CURVE_AMOUNT_MAX: 1.0,
        WIND_DIRECTION_CHANGE_SPEED: 0.1,
        WIND_DIRECTION_SIZE: 1.0
    }
}

// Confusing naming ngl
export const STAR = {
    width: 5, // % the width of the star pointy thingy btw
    resolution: 32, // You can't see it from far away anyways
    amount: 70000,
    minSize: 500,
    maxSize: 12300,
    speed: 0.01,
    spread: 200, // CAMERA.far - CAMERA.near, // - subtract distance
    distance: 100,
    distributionSteepness: 60,
}

export const WATER = {
    size: 50,
    detail: 1/3,
    uniforms: {
        amount: 5,
        minAmplitude: 0.1,
        maxAmplitude: 2.0,
        minSpeed: 0.1,
        maxSpeed: 0.7,
        minWavelength: 0.1,
        maxWavelength: 1.0,
    }
}