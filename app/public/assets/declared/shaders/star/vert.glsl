uniform float uTime;
uniform float uSpeed;
attribute vec3 color;
varying vec3 vColor;
attribute float size;

// #includes
void main() {
    vColor = color;
    vec3 REP = vec3(100000.0, 0.0, 100000.0);
    vec3 dir = normalize(vec3(
        pnoise(normalize(color.xyz + position.xzy), REP),
        pnoise(normalize(color.zyx + position.zxy), REP),
        pnoise(normalize(color.yxz + position.yzx), REP)
    ));
    mat4 rotationMatrix = rotation3d(dir, uTime * pnoise(dir, REP) * uSpeed);
    vec4 newPosition = vec4(position, 1.0) * rotationMatrix;
    vec4 mvPosition = modelViewMatrix * newPosition;
    gl_PointSize = size / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}
