varying float height;
uniform float uTime;

// #includes

void main() {
    vec3 worldPos = (
        modelMatrix * instanceMatrix * vec4(
            position, 1.0
        )
    ).xyz;
    height = position.y;


    float distanceFromCam = distance(cameraPosition, worldPos);
    if(distanceFromCam > 50.0) {
        vec4 modelViewPosition = modelViewMatrix * instanceMatrix * vec4(
            position,
            1.0
        );
        gl_Position = projectionMatrix * modelViewPosition; 
        return;
    };
    float WIND_NOISE = cnoise(worldPos.xz * WIND_SIZE + uTime * WIND_SPEED);
    float WIND_DIRECTION_CHANGE = cnoise(worldPos.xz * WIND_DIRECTION_SIZE + uTime * WIND_DIRECTION_CHANGE_SPEED);
    mat3 directionMatrix = rotation3dY(WIND_DIRECTION_CHANGE*3.14);
    float curveAmount = 
        (pow(height, 1.2) + 0.25) *
        WIND_NOISE * CURVE_AMOUNT_MAX;
    mat3 curveMatrix = rotation3dX(curveAmount);

    vec4 modelViewPosition = modelViewMatrix * instanceMatrix * vec4(
        position *
        directionMatrix *
        curveMatrix,
        1.0
    );
    gl_Position = projectionMatrix * modelViewPosition; 
}
