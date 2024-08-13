uniform float uTime;
varying vec3 vUv;

// #includes
void main() {
    vec3 ambientColor = vec3(
        0.0001,
        0.0004,
        0.0008
    );
    gl_FragColor = vec4(
        ambientColor,
        1.0
    );
}