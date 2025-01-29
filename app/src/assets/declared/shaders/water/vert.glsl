uniform int uAmount;
uniform float uTime;
uniform float uAmplitudes[ARRAY_MAX];
uniform float uPhases[ARRAY_MAX];
uniform float uFrequencies[ARRAY_MAX];
uniform vec2 uDirections[ARRAY_MAX];
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vUv;

// #includes

void main() {
    float sumOfWave = 0.0;
    float bi = 0.0;
    float ta = 0.0;
    float lastBi = 0.0;
    float lastTa = 0.0;
    for(int i = 1; i < uAmount; i++) {
        float H = (
            dot(
                uv + vec2(lastBi, lastTa),
                uDirections[i]
            ) * uFrequencies[i] +
            uTime * uPhases[i]
        );
        float sinH = exp(sin(H) - 1.0);
        sumOfWave += uAmplitudes[i] * sinH;
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
    vPosition = (modelMatrix * vec4(
        vec3(
            position.x,
            sumOfWave,
            position.z
        ),
        1.0
    )).xyz;
    vec4 modelViewPosition = modelViewMatrix * vec4(
        vec3(
            position.x,
            sumOfWave,
            position.z
        ),
        1.0
    );
    gl_Position = projectionMatrix * modelViewPosition; 
}
