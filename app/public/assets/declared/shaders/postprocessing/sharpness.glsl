uniform vec2 iResolution;
uniform float sharpness;
uniform float sharpnessFalloff;
uniform float offset;

//AcerolaFX Addaptive Sharpness

vec3 sample(vec2 uv, float deltaX, float deltaY) {
    return clamp(texture2D(
        inputBuffer,
        uv + vec2(deltaX / iResolution.x, deltaY / iResolution.y)
    ).xyz, 0.0, 1.0);
}

vec3 getMin(vec3 x, vec3 y, vec3 z) {
    return min(x, min(y, z));
}

vec3 getMax(vec3 x, vec3 y, vec3 z) {
    return max(x, max(y, z));
}

void adaptiveSharpness(vec2 uv, float sharpnessStrength, out vec4 outputColor) {
    float _sharpness = mix(-1.0/9.0, -1.0/6.0, sharpnessStrength);

    vec3 c = sample(uv,  1.0, -1.0);
    vec3 b = sample(uv,  0.0, -1.0);
    vec3 a = sample(uv, -1.0, -1.0);
    vec3 d = sample(uv, -1.0,  0.0);
    vec3 e = sample(uv,  0.0,  0.0);
    vec3 f = sample(uv,  1.0,  0.0);
    vec3 g = sample(uv, -1.0,  1.0);
    vec3 h = sample(uv,  0.0,  1.0);
    vec3 i = sample(uv,  1.0,  1.0);

    vec3 minRGB = getMin(getMin(getMin(getMin(d, e, f), b, h), a, c), g, i);

    vec3 maxRGB = getMax(getMax(getMax(getMax(d, e, f), b, h), a, c), g, i);

    vec3 amplitude = min(minRGB, 2.0 - maxRGB) / maxRGB;

    vec3 w = amplitude * sharpness;
    vec3 invW = 1.0 / (1.0 + 4.0 * w);

    outputColor = vec4(clamp((
        b * w +
        d * w +
        e +
        f * w +
        h * w
    ) * invW, 0.0, 1.0), 1.0);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    outputColor = vec4(0.0);
    adaptiveSharpness(uv, sharpness, outputColor);
    
    // Apdapt to depth thingy
    if (sharpnessFalloff > 0.0) {
        vec4 col = clamp(texture2D(inputBuffer, uv), 0.0, 1.0);
        float viewDistance = depth * cameraFar;

        float falloffFactor = 0.0;

        falloffFactor = (sharpnessFalloff / 0.69277) * max(0.0, viewDistance - offset);
        falloffFactor = exp2(-falloffFactor);

        outputColor = mix(col, outputColor, clamp(falloffFactor, 0.0, 1.0));
    }
}