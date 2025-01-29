uniform float uTime;
varying vec3 vUv;

vec3 hsl2rgb( in vec3 c ) {
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

// #includes
void main() {
    vec3 p = normalize(vUv);
    float spread = 2.0; // inverse
    float brightnessChangeSpeed = 0.01;
    float colorChangeSpeed = 0.005;
    float colorSpread = 0.3; //inverse
    // Still in -1.0 1.0
    float brightness = map(
      cnoise((p * spread) + uTime * brightnessChangeSpeed),
        -1.0, 1.0, -0.3, 0.4
    ) * 0.2;
    float hue = abs(fract(
        cnoise(p * colorSpread + uTime * colorChangeSpeed)
    ));
    float saturation = 0.25;
    vec3 color = hsl2rgb(vec3(hue, saturation, brightness));
    gl_FragColor = vec4(color, 1.0);
}