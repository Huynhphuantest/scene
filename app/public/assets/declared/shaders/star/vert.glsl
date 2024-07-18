attribute vec3 color;
varying vec3 vColor;
attribute float size;

// #includes
void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size / -mvPosition.z ;
    gl_Position = projectionMatrix * mvPosition;
}
