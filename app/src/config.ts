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

export const GROUND = {
    size: Math.floor(Math.sqrt(Math.sqrt(1000000))) + 1,
    detail: 30,
    height: 3,
    intensity: 1/25
}
export const GRASS = {
    height: 1.25,
    heightRandom: 0.5,
    amount: 100000,
    detail: 5,
    width: 0.1,
    uniforms: {
        WIND_SIZE: 1 / 10,
        WIND_SPEED: 0.3,
        CURVE_AMOUNT_MAX: 0.8,
        WIND_DIRECTION_CHANGE_SPEED: 0.01,
        WIND_DIRECTION_SIZE: 0.1
    }
}

// Confusing naming ngl
export const STAR = {
    width: 10, // %
    resolution: 128, // You can't see it from far away anyways
    amount: 6000,
    minSize: 900,
    maxSize: 1300,
    speed: 1,
    spread: 100, // CAMERA.far - CAMERA.near, // - subtract distance
    distance: 100
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