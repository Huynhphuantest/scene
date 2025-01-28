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
const fieldSize = 100000;
export const GROUND = {
    size: Math.floor(Math.sqrt(Math.sqrt(fieldSize * 10))),
    detail: 20,
    height: 3,
    intensity: 1/30 // inverse
}
export const GRASS = {
    height: 1.25,
    heightRandom: 0.5,
    amount: fieldSize,
    detail: 5,
    width: 0.08,
    uniforms: {
        WIND_SIZE: 1 / 20, // inverse
        WIND_SPEED: 0.2,
        CURVE_AMOUNT_MAX: 1.0,
        WIND_DIRECTION_CHANGE_SPEED: 0.01,
        WIND_DIRECTION_SIZE: 1.0
    }
}

// Confusing naming ngl
export const STAR = {
    width: 5, // % the width of the star pointy thingy btw
    resolution: 32, // You can't see it from far away anyways
    amount: 70000,
    minSize: 1150,
    maxSize: 12300,
    speed: 0.01,
    spread: 200, // CAMERA.far - CAMERA.near, // - subtract distance
    distance: 100,
    distributionSteepness: 40,
}

export const WATER = {
    size: 60,
    detail: 5,
    amount: 64,
    startAmplitude: 0.2,
    amplitudeIncrease: 0.98,
    startWavelength: 2.5,
    wavelengthIncrease: 1.015,
    minSpeed: 1,
    maxSpeed: 8,
}