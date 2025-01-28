uniform float uTime;
uniform float uID;
varying vec3 vUv;
varying float height;

// #includes
void main() {
    float randomVal = random(uID) * 2.0 - 1.0;
    gl_FragColor = vec4(
        0.2 + height * 0.4 + randomVal * 0.05,
        0.25 + height * 0.55 + randomVal * 0.05,
        0.05 + height * 0.1 + randomVal * 0.025,
        1.0
    );
}