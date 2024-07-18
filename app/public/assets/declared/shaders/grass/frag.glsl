uniform float uTime;
varying vec3 vUv;
varying float height;

// #includes
void main() {
    float randomVal = 0.8 * pnoise(vUv.xz * 10.0, vec2(100000.0, 100000.0));
    gl_FragColor = vec4(
        0.1 + height * 0.4 + randomVal * 0.05,
        0.15 + height * 0.6 + randomVal * 0.1,
        0.05 + height * 0.1 + randomVal * 0.025,
        1.0
    );
}