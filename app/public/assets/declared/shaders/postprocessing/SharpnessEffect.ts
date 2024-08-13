import { Effect, EffectAttribute } from 'postprocessing';
import { Uniform, Vector2 } from 'three';
// @ts-expect-error
import fragmentShader from './sharpness.glsl?raw';
import { SCREEN } from '../../../../../src/config';

export class SharpnessEffect extends Effect {
  resolution:Vector2;
  sharpness:number;
  constructor({
      sharpness = 1.0,
      sharpnessFallOff = 0.0,
      width = SCREEN.bounding.width,
      height = SCREEN.bounding.height,
      offset = 0
    }) {
    super('SharpnessEffect', fragmentShader, {
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map<string, Uniform>([
        ['sharpness', new Uniform(sharpness)],
        ['iResolution', new Uniform(new Vector2(width, height))],
        ['sharpnessFallOff', new Uniform(sharpnessFallOff)],
        ['offset', new Uniform(offset)],
      ]),
    });
    this.resolution = new Vector2();
    this.sharpness = sharpness;
  }

  setSize(width: number, height: number) {
    this.resolution.set(width, height);
    this.uniforms.get('iResolution')!.value.x = this.resolution.x
    this.uniforms.get('iResolution')!.value.y = this.resolution.y
  }
}