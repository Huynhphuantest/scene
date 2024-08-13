varying vec3 vUv;
varying float height;
uniform float uTime;

// #includes

void main() {
    vec3 worldPos = (
        modelMatrix * instanceMatrix * vec4(
            position, 1.0
        )
    ).xyz;

    vec2 REP = vec2(100000.0,100000.0);
    float distanceFromCam = distance(cameraPosition, worldPos);
    float WIND_NOISE = 0.0;
    float WIND_DIRECTION_CHANGE = 0.0;
    if(distanceFromCam < 100.0) {
        WIND_NOISE = pnoise(worldPos.xz * WIND_SIZE + uTime * WIND_SPEED, REP);
        WIND_DIRECTION_CHANGE = pnoise(worldPos.xz * WIND_DIRECTION_SIZE + uTime * WIND_DIRECTION_CHANGE_SPEED, REP);
    }

    vUv = worldPos;


    // 0.0 to 1.0
    height = position.y;
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
