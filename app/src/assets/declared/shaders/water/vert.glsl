uniform float uTime;
uniform float uAmplitudes[ARRAY_LENGTH];
uniform float uPhases[ARRAY_LENGTH];
uniform float uFrequencies[ARRAY_LENGTH];
uniform vec2 uDirections[ARRAY_LENGTH];
varying vec3 vUv;
varying vec3 vNormal;

// #includes

float wave(vec2 pos, int i) {
    return uAmplitudes[i] * sin(
        dot(uDirections[i], pos) +
        uTime * uPhases[i]
    );
}

void main() {
    float sum = 0.0;
    float bi = 0.0;
    float ta = 0.0;
    float lastBi = 0.0;
    float lastTa = 0.0;
    for(int i = 0; i < ARRAY_LENGTH; i++) {
        float H = wave(position.xz, i);

        sum += H;

        float sinH = exp(sin(H) - 1.0);
        float cosH = cos(H);
        lastBi = uDirections[i].x * uFrequencies[i] * uAmplitudes[i] * sinH * cosH;
        lastTa = uDirections[i].y * uFrequencies[i] * uAmplitudes[i] * sinH * cosH;
        bi += lastBi;
        ta += lastTa;
    }
    vNormal = normalize(vec3(
        -bi, -ta, 1.0
    ));
    vUv = position;

    vec4 modelViewPosition = modelViewMatrix * vec4(
        vec3(
            position.x,
            position.y + sum,
            position.z
        ),
        1.0
    );
    gl_Position = projectionMatrix * modelViewPosition; 
}
