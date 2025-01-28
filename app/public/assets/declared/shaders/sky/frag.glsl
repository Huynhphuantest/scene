uniform float uTime;
varying vec3 vUv;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

// #includes
void main() {
    vec3 p = normalize(vUv);
    vec3 REP = vec3(10000.0, 10000.0, 10000.0);
    float spread = 1.0; // inverse
    float brightnessChangeSpeed = 0.0;
    float colorChangeSpeed = 0.1;
    // Still in -1.0 1.0
    float brightness = map(
        pnoise((p * spread) + uTime * brightnessChangeSpeed, REP),
        -1.0, 1.0, -0.3, 0.5
    );
    float hue = abs(fract(
        pnoise(p + uTime * colorChangeSpeed, REP)
    ));
    float saturation = 0.35;
    vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
    gl_FragColor = vec4(color, 1.0);
}