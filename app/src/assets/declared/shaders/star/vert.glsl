uniform float uTime;
uniform float uSpeed;
attribute vec3 color;
varying vec3 vColor;
attribute float size;

// #includes

void main() {
    vColor = color;

    vec3 dir = normalize(vec3(
        random(position.x),
        random(position.y),
        random(position.z)
    ));
    mat4 rotationMatrix = rotation3d(dir, uTime * uSpeed);
    vec4 newPosition = vec4(position, 1.0) * rotationMatrix;
    vec4 mvPosition = modelViewMatrix * newPosition;
    gl_PointSize = size / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}
