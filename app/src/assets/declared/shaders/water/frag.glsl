uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vUv;

// #includes

void main() {
    const float REFLECTIVITY = 0.05;
    const float METALIC = 0.1;
    const float SHININESS = 0.9;
    const float DIFFUSE = 2.0;
    const float MAP_CONTRAST = 4.0;

    vec3 light = -normalize(vec3(25.0, 50.0, 0.0));
    vec3 viewVec = normalize(cameraPosition - vPosition);
    vec3 lightToP = normalize(vPosition - light);

    //BASE
    vec3 baseColor = vec3(
        0.05, 0.3, 0.5
    );

    //AMBIENT
    float ambient = 0.1;

    //DIFFUSE
    float diffuse = pow((dot(
        light,
        vNormal
    ) + 1.0) / 2.0, 2.0) * DIFFUSE;

    //SPECULAR (BLINN PHONG)
    vec3 lightReflect = reflect(viewVec, lightToP);


    gl_FragColor = vec4(
        baseColor * pow((
            diffuse +
            ambient
        ), 2.0),
    1.0);
}