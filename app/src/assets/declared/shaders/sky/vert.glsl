varying vec3 vUv;

// #includes
void main() {
    vUv = position;
    vec4 modelViewPosition = modelViewMatrix * vec4(
        position,
        1.0
    );
    gl_Position = projectionMatrix * modelViewPosition; 
}
