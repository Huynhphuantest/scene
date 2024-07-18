uniform float uTime;
uniform sampler2D uTexture;
varying vec3 vColor;

// #includes
void main() {
    gl_FragColor = vec4(
        vColor,
        1.0
    ) * texture2D( uTexture, gl_PointCoord );
}