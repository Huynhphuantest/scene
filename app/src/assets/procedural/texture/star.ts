import * as THREE from 'three';

export function createStarTexture(_width:number, resolution:number, color:string):THREE.Texture {
    const width = resolution / 100 * _width;
    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    // TOP
    ctx.beginPath();
    ctx.moveTo(resolution/2, 0);
    ctx.lineTo(resolution/2 + width, resolution/2);
    ctx.lineTo(resolution/2 - width, resolution/2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(resolution/2, resolution);
    ctx.lineTo(resolution/2 + width, resolution/2);
    ctx.lineTo(resolution/2 - width, resolution/2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, resolution/2);
    ctx.lineTo(resolution/2, resolution/2 + width);
    ctx.lineTo(resolution/2, resolution/2 - width);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(resolution, resolution/2);
    ctx.lineTo(resolution/2, resolution/2 + width);
    ctx.lineTo(resolution/2, resolution/2 - width);
    ctx.closePath();
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
}